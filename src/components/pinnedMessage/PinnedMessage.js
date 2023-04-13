import appConfig from '../../configuration/Configuration';

class PinnedMessage {
  constructor(appTag) {
    this.appConfig = appConfig;
    this.appContainer = document.querySelector(appTag);
    this.pinnedWrap = this.appContainer.querySelector('.pinned-wrap');
    this.contentItemSelector = '.content-item';
    this.contentItemDateSelector = '.content-item-date';
    this.pinnedItemSelector = '.pinned-item';
    this.pinnedMediaSelector = '.pinned-media';
    this.contentTextSelector = '.content-text-value';
    this.pinnedContentSelector = '.pinned-content';
    this.pinnedWrapSelector = '.pinned-wrap';
    this.pinnedLinkSelector = '.pinned-link';
    this.pinnedMessageId = undefined;
    this.pinnedItem = undefined;
    this.serverUrl = this.appConfig.serverUrl;
    this.createPinnedMessage = this.createPinnedMessage.bind(this);
    this.addPinned = this.addPinned.bind(this);
  }

  addPinned = (e) => {
    const pinnedMessages = this.appContainer.querySelectorAll(this.pinnedItemSelector);
    if (!e.target.classList.contains('download-btn') && pinnedMessages.length === 0) {
      this.pinnedItem = e.target.parentNode.closest(this.contentItemSelector);
      this.pinnedItem.setAttribute('pinned', 'true');
      if (this.pinnedMessageId === undefined) {
        this.pinnedMessageId = this.pinnedItem.getAttribute('messageid');
        const sendData = {
          id: this.pinnedMessageId,
        };
        const req = fetch(`${this.appConfig.serverUrl}${this.appConfig.childUrls.setPinned}`, {
          method: 'POST',
          body: JSON.stringify(sendData),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            this.createPinnedMessage(this.pinnedItem.cloneNode(true));
            this.pinnedItem = undefined;
          });
      }
    }
  };

  removePinned = (e) => {
    if (e.target.classList.contains('pinned-content')) {
      const pinnedId = e.target.parentNode.getAttribute('pinnedid');
      const sendData = {
        id: pinnedId,
      };
      fetch(`${this.appConfig.serverUrl}${this.appConfig.childUrls.rmPinned}`, {
        method: 'POST',
        body: JSON.stringify(sendData),
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const pinnedWrap = e.target.parentNode.closest(this.pinnedWrapSelector);
          pinnedWrap.firstElementChild.querySelector(this.pinnedLinkSelector).removeEventListener('click', this.pinnedLinkEvent);
          pinnedWrap.firstElementChild.remove();
          pinnedWrap.classList.remove('pinned-show');
          this.pinnedMessageId = undefined;
          document.querySelectorAll('.content-item').forEach((item) => item.removeAttribute('pinned'));
        });
    }
  };

  async createPinnedMessage(tag) {
    const id = tag.getAttribute('messageid');
    const content = tag.querySelector(this.contentTextSelector);
    const date = tag.querySelector(this.contentItemDateSelector);
    const video = content.querySelector('video');
    const audio = content.querySelector('audio');
    const img = content.querySelector('img');
    const pinnedWrap = document.querySelector(this.pinnedWrapSelector);
    const pinnedItem = document.createElement('div');
    const pinnedMedia = document.createElement('div');
    const pinnedContent = document.createElement('div');
    const pinnedDate = document.createElement('div');
    const pinnedLinkWrap = document.createElement('div');
    const pinnedLink = document.createElement('a');

    pinnedItem.classList.add('pinned-item');
    pinnedMedia.classList.add('pinned-media');
    pinnedContent.classList.add('pinned-content');
    pinnedLinkWrap.classList.add('pinned-link');
    pinnedLink.classList.add('pinned-link-item');
    pinnedDate.classList.add('pinned-date');
    pinnedItem.setAttribute('pinnedid', id);
    pinnedItem.setAttribute('pinned', true);

    pinnedLink.addEventListener('click', this.pinnedLinkEvent);

    pinnedLinkWrap.appendChild(pinnedLink);

    if (video) pinnedMedia.appendChild(video.cloneNode(true));
    if (img) pinnedMedia.appendChild(img.cloneNode(true));
    else if (audio) {
      pinnedContent.style.width = `${30}%`;
      pinnedMedia.style.width = `${30}%`;
      pinnedMedia.appendChild(audio.cloneNode(true));
    }
    pinnedContent.textContent = content.textContent;
    pinnedDate.textContent = date.textContent;
    pinnedItem.appendChild(pinnedMedia);
    pinnedItem.appendChild(pinnedContent);
    pinnedItem.appendChild(pinnedDate);
    pinnedItem.appendChild(pinnedLinkWrap);
    pinnedWrap.appendChild(pinnedItem);
    pinnedLinkWrap.classList.add('pinned-show');
    this.pinnedWrap.addEventListener('click', this.removePinned);
  }

  pinnedLinkEvent = (e) => {
    this.item = e.target.parentNode.closest(this.pinnedItemSelector);
    if (!this.item.classList.contains('pinned-full')) {
      const pinnedContent = this.item.querySelector(this.pinnedContentSelector);
      const pinnedMedia = this.item.querySelector(this.pinnedMediaSelector);
      this.item.classList.add('pinned-item-max');
      pinnedContent.classList.add('pinned-content-full');
      pinnedMedia.classList.add('pinned-media-full');
      this.item.classList.add('pinned-full');
      return;
    }
    const pinnedContent = this.item.querySelector(this.pinnedContentSelector);
    const pinnedMedia = this.item.querySelector(this.pinnedMediaSelector);
    this.item.classList.remove('pinned-item-max');
    pinnedContent.classList.remove('pinned-content-full');
    pinnedMedia.classList.remove('pinned-media-full');
    this.item.classList.remove('pinned-full');
  };
}

const pinnedMessage = new PinnedMessage('.app-container');

export default pinnedMessage;
