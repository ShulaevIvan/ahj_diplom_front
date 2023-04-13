import messageBuilder from '../messageBuilder/MessageBuilder';
import appConfig from '../../configuration/Configuration';

class SideBarCategory {
  constructor(appTag) {
    this.appConfig = appConfig;
    this.appContainer = document.querySelector(appTag);
    this.contentColumn = this.appContainer.querySelector('.content-column');
    this.sidebarColumn = this.appContainer.querySelector('.sidebar-column');
    this.sidebarTextBlockWrap = this.sidebarColumn.querySelector('.sidebar-text-message-count-wrap');
    this.sidebarImageBlockWrap = this.sidebarColumn.querySelector('.sidebar-image-message-count-wrap');
    this.sidebarAudioBlockWrap = this.sidebarColumn.querySelector('.sidebar-audio-message-count-wrap');
    this.sidebarVideoBlockWrap = this.sidebarColumn.querySelector('.sidebar-video-message-count-wrap');
    this.sidebarFielsBlockWrap = this.sidebarColumn.querySelector('.sidebar-fiels-message-count-wrap');
    this.resetBtns = Array.from(this.sidebarColumn.querySelectorAll('.sidebar-reset-filter'));
    this.serverUrl = appConfig.serverUrl;
    this.builder = messageBuilder;
    this.textTypes = ['text', 'url'];
    this.audioTypes = ['audio/ogg', 'audio/wav', 'audio/mp3', 'audio/mpeg'];
    this.videoTypes = ['video/mp4', 'video/ogg', 'video/webm'];
    this.imageTypes = ['image/png', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/avif', 'image/bmp'];
    this.geolocationType = ['geolocation'];
    this.contentItemSelector = '.content-item';

    this.showBtns = Array.from(this.sidebarColumn.querySelectorAll('.show-messages-sidebar'))
      .forEach((btn) => btn.addEventListener('click', this.showMessagesEvent));
  }

  async addCounterByType(data) {
    this.allMessages = data;
    this.msgTagsArr = [];
    let msgObj;
    let counterTag;

    return new Promise((resolve, reject) => {
      if (this.allMessages.length === 0) return;
      this.allMessages.forEach((msg) => {
        if (this.textTypes.includes(msg.data.type)) {
          counterTag = 'text';
          msgObj = {
            type: msg.data.type,
            tag: 'text',
          };
          this.msgTagsArr.push(msgObj);
        } else if (this.audioTypes.includes(msg.data.type)) {
          msgObj = {
            type: msg.data.type,
            tag: 'audio',
          };
          this.msgTagsArr.push(msgObj);
        } else if (this.videoTypes.includes(msg.data.type)) {
          msgObj = {
            type: msg.data.type,
            tag: 'video',
          };
          this.msgTagsArr.push(msgObj);
        } else if (this.imageTypes.includes(msg.data.type)) {
          msgObj = {
            type: msg.data.type,
            tag: 'image',
          };
          this.msgTagsArr.push(msgObj);
        } else if (this.geolocationType.includes(msg.data.type)) {
          msgObj = {
            type: msg.data.type,
            tag: 'image',
          };
          this.msgTagsArr.push(msgObj);
        } else {
          msgObj = {
            type: msg.data.type,
            tag: 'fiels',
          };
          this.msgTagsArr.push(msgObj);
        }
      });
      resolve(this.msgTagsArr);
    })
      .then((dataMsg) => {
        const text = dataMsg.filter((msg) => msg.tag === 'text');
        const image = dataMsg.filter((msg) => msg.tag === 'image');
        const audio = dataMsg.filter((msg) => msg.tag === 'audio');
        const video = dataMsg.filter((msg) => msg.tag === 'video');
        const fiels = dataMsg.filter((msg) => msg.tag === 'fiels');

        this.sidebarColumn.querySelector('.sidebar-text-message-count').textContent = text.length;
        this.sidebarColumn.querySelector('.sidebar-image-message-count').textContent = image.length;
        this.sidebarColumn.querySelector('.sidebar-audio-message-count').textContent = audio.length;
        this.sidebarColumn.querySelector('.sidebar-video-message-count').textContent = video.length;
        this.sidebarColumn.querySelector('.sidebar-text-message-count').textContent = text.length;
        this.sidebarColumn.querySelector('.sidebar-fiels-message-count').textContent = fiels.length;
      });
  }

  async addCouuntValue(data) {
    return new Promise((resolve, reject) => {
      const messageType = data.type;
      let counterTag;
      if (messageType === 'text' || messageType === 'url') counterTag = 'text';
      else if (this.imageTypes.includes(messageType)) counterTag = 'image';
      else if (this.audioTypes.includes(messageType)) counterTag = 'audio';
      else if (this.videoTypes.includes(messageType)) counterTag = 'video';
      else if (this.geolocationType.includes(messageType)) counterTag = 'image';
      else counterTag = 'fiels';

      counterTag = this.sidebarColumn.querySelector(`.sidebar-${counterTag}-message-count`);
      const messageObj = {
        type: messageType,
        tag: counterTag,
      };
      resolve(messageObj);
    })
      .then((msgData) => {
        this.getCounterValue(msgData.type, msgData.tag);
      });
  }

  async getCounterValue(type, tag) {
    let counterType = type;
    const counterTag = tag;
    const typesObj = {
      text: ['text', 'url'],
      image: ['image/png', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/avif', 'image/bmp'],
      audio: ['audio/ogg', 'audio/wav', 'audio/mp3', 'audio/mpeg'],
      video: ['video/mp4', 'video/ogg', 'video/webm', 'video/x-msvideo'],
      fiels: [
        'application/x-abiword', 'application/x-freearc', 'application/vnd.amazon.ebook', 'application/x-bzip', 'application/x-bzip2',
        'text/csv', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-fontobject', 'application/gzip', 'text/html', 'application/pdf', 'application/vnd.rar',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      geolocation: ['geolocation'],
    };
    if (typesObj.text.includes(type)) counterType = 'text';
    if (typesObj.image.includes(type)) counterType = 'image';
    if (typesObj.video.includes(type)) counterType = 'video';
    if (typesObj.audio.includes(type)) counterType = 'audio';
    if (typesObj.fiels.includes(type)) counterType = 'fiels';
    if (typesObj.geolocation.includes(type)) counterType = 'image';

    await fetch(`${this.appConfig.serverUrl}${this.appConfig.childUrls.counterType}${counterType}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
      .then((response) => response.json())
      .then(((data) => {
        let dataCounter = data;
        if (dataCounter) {
          counterTag.textContent = dataCounter.counter;
        }
        dataCounter = undefined;
      }));
  }

  showMessagesEvent = (e) => {
    const linktype = e.target.getAttribute('linktype');
    fetch(`${this.appConfig.serverUrl}${this.appConfig.childUrls.messageType}${linktype}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
      .then((response) => response.json())
      .then(((data) => {
        document.querySelectorAll(this.contentItemSelector).forEach((item) => item.remove());
        data.messages.forEach((msg) => {
          if (msg.data.type === 'geolocation') {
            this.builder.createGeolocationMessage(msg.data, msg.id);
          } else {
            this.builder.createMessage(msg.data, msg.id);
          }
        });
        setTimeout(() => {
          const loadedMessaeges = Array.from(this.contentColumn
            .querySelectorAll(this.contentItemSelector));
          if (loadedMessaeges.length > 1) this.contentColumn.lastChild.scrollIntoView();
        }, 300);
      }));
  };
}

const sidebarCategory = new SideBarCategory('.app-container');

export default sidebarCategory;
