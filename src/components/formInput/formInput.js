import messageBuilder from '../messageBuilder/messageBuilder';
import sidebarCategory from '../sidebarCategory/sidebarCategory';
import geolocation from '../sendGeolocation/sendGeolocation';

class FromInput {
  constructor(appTag) {
    this.mainContainer = document.querySelector(appTag);
    this.contentColumn = this.mainContainer.querySelector('.content-column');
    this.mainInput = this.mainContainer.querySelector('.main-input');
    this.fileInput = this.mainContainer.querySelector('.hidden-upload-btn');
    this.geolocation = geolocation;
    this.builder = messageBuilder;
    this.sidebar = sidebarCategory;
    this.lastMessageId = undefined;
    this.serverWsUrl = 'ws://localhost:7070';
    this.serverUrl = 'http://localhost:7070';
    this.wsServer = new WebSocket(this.serverWsUrl);

    this.inputAccept = this.inputAccept.bind(this);
    this.validateMainInput = this.validateMainInput.bind(this);
    this.getBase64 = this.getBase64.bind(this);
    this.fileLoad = this.fileLoad.bind(this);
    this.dropEvent = this.dropEvent.bind(this);

    this.wsServer.addEventListener('open', this.openWs);
    this.wsServer.addEventListener('close', this.closeWs);
    this.wsServer.addEventListener('message', this.messageWs);
    this.mainInput.addEventListener('keydown', this.inputAccept);
    this.mainInput.addEventListener('click', this.clearInput);
    this.fileInput.addEventListener('change', this.fileLoad);
    this.contentColumn.addEventListener('dragover', this.dragEvent);
    this.contentColumn.addEventListener('drop', this.dropEvent);
    this.geolocation.geolocationBtn.addEventListener('click', this.geolocation.sendGeolocation);
  }

  inputAccept = async (e) => {
    const inputValue = e.target.value;
    const checkCommand = /^@chaos:/g;
    if (inputValue.match(checkCommand)) return;

    if (e.key === 'Enter' && inputValue !== '' && inputValue.trim() !== '') {
      await fetch(`${this.serverUrl}/messages/lastid`, { method: 'GET' })
        .then((response) => response.json())
        .then((data) => {
          this.lastMessageId = data.lastId;
          const inputType = this.validateMainInput(inputValue);
          const lastItem = this.contentColumn.lastChild;
          data.id = this.lastMessageId;
          data.type = inputType;
          data.name = inputValue;
          data.value = inputValue;
          data.date = new Date().getTime();
          this.builder.createMessage(data);
          this.wsServer.send(JSON.stringify(data));
          this.sidebar.addCouuntValue(data);

          this.mainInput.value = '';
          if (lastItem.lastChild) lastItem.scrollIntoView(true);
        });
    }
  };

  async fileLoad(e) {
    return new Promise((resolve, reject) => {
      const files = e.srcElement.files;
      Object.entries(files).forEach((fileObj) => {
        fetch(`${this.serverUrl}/messages/lastid`, { method: 'GET' })
          .then((response) => response.json())
          .then((dataId) => {
            e.preventDefault();
            this.lastMessageId = dataId.lastId;
            const url = URL.createObjectURL(fileObj[1]);
            this.getBase64(fileObj[1], url);
          });
      });
      resolve();
    });
  }

  async getBase64(file, url) {
    return new Promise((resolve, reject) => {
      const messageId = this.lastMessageId;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const data = {
          id: messageId,
          type: file.type,
          name: file.name,
          value: url,
          file: reader.result,
          date: new Date().getTime(),
        };
        this.wsServer.send(JSON.stringify(data));
        resolve(data);
      };
    })
      .then((data) => {
        const lastItem = this.contentColumn.lastChild;
        this.builder.createMessage(data);
        setTimeout(() => {
          if (lastItem.lastChild) lastItem.scrollIntoView(true);
          this.sidebar.addCouuntValue(data);
        }, 300);
      });
  }

  validateMainInput = (inputData) => {
    this.inputData = inputData;
    // eslint-disable-next-line
    const catchUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
    const catchImg = /([/|.|\w|\s|-])*\.(?:jpg|gif|png|svg|gif)/;

    if (catchUrl.test(this.inputData)) return 'url';
    // eslint-disable-next-line
    else if (catchImg.test(this.inputData)) return 'img';
    return 'text';
  };

  dragEvent = (e) => {
    this.target = e.target;
    e.preventDefault();
  };

  dropEvent = (e) => {
    e.preventDefault();
    this.files = Array.from(e.dataTransfer.files);
    this.files.forEach((file) => {
      fetch(`${this.serverUrl}/messages/lastid`, { method: 'GET' })
      // eslint-disable-next-line
        .then((response) => { if (response.status === 200) return response.json(); })
        .then((data) => {
          this.lastMessageId = data.lastId;
          const url = URL.createObjectURL(file);
          this.getBase64(file, url);
        });
    });
  };

  clearInput = (e) => {
    this.target = e.target;
    if (this.target.value === 'ошибка ввода') this.target.value = '';
  };
}

export default FromInput;
