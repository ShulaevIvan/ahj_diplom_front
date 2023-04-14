import messageBuilder from '../messageBuilder/MessageBuilder';
import pinnedMessage from '../pinnedMessage/PinnedMessage';
import sidebarCategory from '../sidebarCategory/SidebarCategory';
import appConfig from '../../configuration/Configuration';

class LazyLoad {
  constructor() {
    this.appConfig = appConfig;
    this.contentColumn = document.querySelector('.content-column');
    this.contentItemSelector = '.content-item';
    this.pinnedItemSelector = '.pinned-item';
    this.bulder = messageBuilder;
    this.sidebarCategory = sidebarCategory;
    this.audioTypes = ['audio/ogg', 'audio/wav', 'audio/mp3', 'audio/mpeg'];
    this.videoTypes = ['video/mp4', 'video/ogg', 'video/webm'];
    this.imageTypes = ['image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    this.counter = 0;
    this.hidenMessages = [];
    this.pinnedMessage = pinnedMessage;
    this.contentColumn.addEventListener('scroll', this.loadHistory);
    this.sidebarCategory.resetBtns.forEach((restBtn) => restBtn.addEventListener('click', this.loadMessages));
    this.loadHistory = this.loadHistory.bind(this);
  }

  loadHistory = () => {
    this.oldHistory = undefined;
    console.log(this)
    if (this.contentColumn.scrollTop === 0) {
      const displayingMsg = Array.from(this.contentColumn
        .querySelectorAll(this.contentItemSelector));
      const displayingIds = [];

      if (displayingMsg.length < 10) return;

      displayingMsg.forEach((msg) => {
        displayingIds.push(Number(msg.getAttribute('messageid')));
      });

      fetch(`${this.appConfig.serverUrl}${this.appConfig.childUrls.acutalMsg}`, {
        method: 'POST',
        body: JSON.stringify(displayingIds),
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      });

      fetch(`${this.appConfig.serverUrl}${this.appConfig.childUrls.loadHistory}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      })// eslint-disable-next-line
        .then((response) => {
          if (response.status === 200) return response.json();
        })
        .then((data) => {
          if (data.history.length <= 10) {
            data.history.forEach((item) => {
              if (item.data.type === 'geolocation') {
                this.bulder.createGeolocationMessage(item.data, item.data.id, true);
                return;
              }
              this.bulder.createMessage(item.data, item.data.id, true);
            });
          }
        });
    }
  };

  loadMessages = async (e) => {
    this.sidebarCategory.resetBtns.forEach((restBtn) => restBtn.removeEventListener('click', this.loadMessages));
    const displayingMsg = Array.from(this.contentColumn.querySelectorAll(this.contentItemSelector));
    const pinnedMsg = this.contentColumn.querySelector(this.pinnedItemSelector);
    // eslint-disable-next-line
    if (pinnedMsg) pinnedMsg.remove();
    displayingMsg.forEach((item) => item.remove());

    await fetch(`${this.appConfig.serverUrl}${this.appConfig.childUrls.messages}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.sidebarCategory.addCounterByType(data.messages);
      });

    await fetch(`${this.appConfig.serverUrl}${this.appConfig.childUrls.lastMessages}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
    // eslint-disable-next-line
      .then((response) => {
        if (response.status === 200) return response.json();
      })
      .then((data) => {
        const allMsg = data.messages;
        let msg;
        allMsg.forEach((msgObj) => {
          this.counter += 1;
          if (this.imageTypes.includes(msgObj.data.type) || msgObj.data.type === 'text' || msgObj.data.type === 'url' && this.counter <= 10) {
            msg = messageBuilder.createMessage(msgObj.data);
          } else if (msgObj.data.type === 'geolocation' && this.counter <= 10) {
            msg = messageBuilder.createGeolocationMessage(msgObj.data, msgObj.data.id);
          } else if (this.audioTypes.includes(msgObj.data.type)
          || this.videoTypes.includes(msgObj.data.type) && this.counter <= 10) {
            const reader = new FileReader();
            msgObj.data.value = msgObj.data.file;
            msg = messageBuilder.createMessage(msgObj.data, msgObj.data.id);
          } else if (!this.audioTypes.includes(msgObj.data.type)
          || !this.videoTypes.includes(msgObj.data.type) && this.counter <= 10) {
            const reader = new FileReader();
            msgObj.data.value = msgObj.data.file;
            msg = messageBuilder.createMessage(msgObj.data, msgObj.data.id);
          }
          if (msgObj.data.pinned) {
            this.pinnedMessage.createPinnedMessage(msg);
          }
        });
        setTimeout(() => {
          const dispMsg = Array.from(this.contentColumn.querySelectorAll(this.contentItemSelector));
          if (dispMsg.length > 0) dispMsg[dispMsg.length - 1].scrollIntoView();
        }, 200);
      });
    this.sidebarCategory.resetBtns.forEach((restBtn) => restBtn.addEventListener('click', this.loadMessages));
  };

  countMessages() {
    this.messagesCount = Array.from(document.querySelectorAll(this.contentItemSelector)).length;
    return this.messagesCount;
  }
}
const lazyLoad = new LazyLoad();

export default lazyLoad;
