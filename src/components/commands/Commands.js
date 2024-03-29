import messageBuilder from '../messageBuilder/MessageBuilder';
import lazyLoad from '../lazyLoad/LazyLoad';
import appConfig from '../../configuration/Configuration';

export default class Commands {
  constructor(appTag) {
    this.appConfig = appConfig;
    this.appContainer = document.querySelector(appTag);
    this.contentColumn = this.appContainer.querySelector('.content-column');
    this.commandInput = this.appContainer.querySelector('.main-input');
    this.allCommands = ['weather', 'time', 'clear', 'roll', 'password'];
    this.commandSelector = '[command="true"]';
    this.contentItemSelector = '.content-item';
    this.lazyLoad = lazyLoad;
    this.builder = messageBuilder;
    this.currentCommand = undefined;
    this.geolocation = undefined;
    this.commandInput.addEventListener('change', this.validateCommand);

    this.validateCommand = this.validateCommand.bind(this);
  }

  validateCommand = (e) => {
    const currentCommands = Array.from(document.querySelectorAll(this.commandSelector));
    if (currentCommands.length > 0) currentCommands.forEach((item) => item.remove());
    const checkMainCommand = /^@chaos:/g;

    if (e.target.value.match(checkMainCommand)) {
      // eslint-disable-next-line
      const commandVariable = e.target.value.replace(checkMainCommand, '').replace(/\s/g, '').replace(/\d/g, '').replace(/\+|\*|\-|\//g, '');
      const command = this.allCommands.indexOf(commandVariable);
      if (command !== -1) {
        this.currentCommand = this.allCommands[command];
        switch (this.allCommands[command]) {
          case 'weather': this.getWeather(); break;
          case 'time': this.showTime(); break;
          case 'clear': this.clearData(); break;
          case 'roll': this.roll(e.target.value); break;
          case 'password': this.passwordGen(); break;

          default: break;
        }
        e.target.value = '';
        return;
      }
      e.target.value = 'ошибка ввода';
      setTimeout(() => {
        this.contentColumn.scrollTop = this.contentColumn.scrollHeight;
      }, 100);
    }
  };

  getWeather() {
    this.commandInput.value = '';
    // eslint-disable-next-line
    fetch(`${this.appConfig.serverUrl}${this.appConfig.childUrls.getWeather}`, { method: 'GET' }).then((response) => {
      if (response.status === 200) return response.json();
    })
      .then((data) => {
        this.builder.displayWeather(data);
      });
  }

  showTime() {
    this.getUserGeo();
  }

  getUserGeo() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((data) => {
        this.geolocation = {
          localTime: new Date(data.timestamp).toLocaleString('ru', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
          }),
          longitude: data.coords.longitude,
          latitude: data.coords.latitude,
        };
        this.commandInput.value = '';
        this.builder.displayTime(this.geolocation);
      }, this.geUserGeoErr, { enableHighAccuracy: true });
    }
  }

  clearData() {
    fetch(`${this.appConfig.serverUrl}${this.appConfig.childUrls.clearData}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 204) window.location.reload();
      });
  }

  getFiles() {
    fetch(`${this.appConfig.serverUrl}${this.appConfig.childUrls.getFiles}}`, {
      method: 'GET', headers: { 'Content-Type': 'application/json' },
    })
    // eslint-disable-next-line
      .then((response) => { if (response.status === 200) return response.json(); })
      .then((data) => {
        this.appContainer.querySelectorAll(this.contentItemSelector)
          .forEach((item) => item.remove());
        data.fiels.forEach((item) => {
          this.builder.createMessage(item.data, item.data.id, false, true);
        });
        this.commandInput.value = '';
      });
  }

  getMedia() {
    fetch(`${this.appConfig.serverUrl}${this.appConfig.childUrls.getMedia}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    // eslint-disable-next-line
      .then((response) => { if (response.status === 200 ) return response.json(); })
      .then((data) => {
        this.appContainer.querySelectorAll(this.contentItemSelector)
          .forEach((item) => item.remove());
        data.fiels.forEach((item) => {
          this.builder.createMessage(item.data, item.data.id, false, true);
        });
        this.commandInput.value = '';
      });
  }

  roll(data) {
    const strArr = data.replace(/^@chaos:(\s|\w)roll/, '').replace(/\s/g, '').split('-');
    if (strArr.length < 2) return;
    const min = strArr[0];
    const max = strArr[1];
    const resultObj = {
      text: 'случайное число',
      number: Math.floor(Math.random() * (max - min) + min),
    };
    this.builder.displayRoll(resultObj);
  }

  passwordGen() {
    this.letters = 'abcdefghijklmnopqrstuvwxyz';
    this.numeric = '0123456789';
    this.symbols = '!@#$%^&*+~`|?=';
    this.minLength = 10;
    this.resultPassword = '';
    this.tmpStr = '';

    while (this.resultPassword.length < this.minLength) {
      const rndLetter = Math.ceil(this.letters.length * Math.random() * Math.random());
      const rndNumber = Math.ceil(this.numeric.length * Math.random() * Math.random());
      const rndSymbols = Math.ceil(this.symbols.length * Math.random() * Math.random());
      let catchLetterElem = this.letters.charAt(rndLetter);
      catchLetterElem = (this.resultPassword.length % 2 === 0)
        ? (catchLetterElem.toUpperCase()) : (catchLetterElem);
      this.tmpStr += catchLetterElem;
      this.tmpStr += this.numeric.charAt(rndNumber);
      this.tmpStr += this.symbols.charAt(rndSymbols);
      this.resultPassword = this.tmpStr;
    }
    this.resultPassword = this.resultPassword.split('').sort(() => 0.5 - Math.random()).join('');
    this.builder.displayPassword(this.resultPassword);
  }
}
