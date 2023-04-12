import messageBuilder from '../messageBuilder/messageBuilder';
import sidebarCategory from '../sidebarCategory/sidebarCategory';
import appConfig from '../../configuration/Configuration';

export default class AudioInput {
  constructor(appTag) {
    this.appConfig = appConfig;
    this.serverUrl = this.appConfig.serverUrl;
    this.wsServer = new WebSocket(this.appConfig.websocketUrl);
    
    this.appContainer = document.querySelector(appTag);
    this.microphone = this.appContainer.querySelector('.mic-btn');
    this.micCancelBtn = this.appContainer.querySelector('.mic-cancel-btn');
    this.micOkBtn = this.appContainer.querySelector('.mic-ok-btn');
    this.microphoneTimerTag = this.appContainer.querySelector('.microphone-timer');
    this.microphoneTimerSecondsTag = this.appContainer.querySelector('.microphone-timer-seconds');
    this.micpohoneTimerMinutesTag = this.appContainer.querySelector('.microphone-timer-minutes');

    this.contentColumnSelector = '.content-column';
    this.soundController = undefined;
    this.microfoneTimerInterval = undefined;
    this.builder = messageBuilder;
    this.sidebar = sidebarCategory;
    this.lastId = undefined;

    this.microphone.setAttribute('mic-status', 'deactivated');

    this.micOkBtn.addEventListener('click', this.microphoneOkEvent);
    this.micCancelBtn.addEventListener('click', this.microphoneCancelEvent);
    this.microphone.addEventListener('click', this.microphoneClickEvent);
  }

  microphoneClickEvent = async (e) => {
    if (this.microphone.getAttribute('mic-status') === 'deactivated') {
      this.microphone.setAttribute('mic-status', 'active');
      fetch(`${this.appConfig.serverUrl}${this.appConfig.childUrls.lastId}`, { method: 'GET' })
        .then((response) => response.json())
        // eslint-disable-next-line
        .then((data) => this.lastId = data.lastId);

      this.microphone.classList.add('hide-mic');
      this.micOkBtn.classList.remove('hide-mic-control');
      this.micCancelBtn.classList.remove('hide-mic-control');
      this.microphoneTimerTag.classList.remove('hide-mic-timer');
      const soundByteArr = [];

      this.soundStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      this.soundController = new MediaRecorder(this.soundStream);
      this.soundController.addEventListener('dataavailable', (event) => {
        soundByteArr.push(event.data);
      });

      this.soundController.addEventListener('stop', (event) => {
        const blob = new Blob(soundByteArr);
        this.soundData = URL.createObjectURL(blob);
        const file = new File([blob], `voise_message_${new Date().toLocaleDateString()}`, { type: 'audio/ogg' }, { lastModified: new Date().getTime() });
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const data = {
            id: this.lastId,
            type: file.type,
            name: file.name,
            value: this.soundData,
            file: reader.result,
            date: new Date().getTime(),
          };
          this.builder.createMessage(data);
          this.wsServer.send(JSON.stringify(data));
          this.sidebar.addCouuntValue(data);
          const lastItem = this.appContainer.querySelector(this.contentColumnSelector).lastChild;
          if (lastItem.lastChild) lastItem.scrollIntoView(true);
        };
      });
      this.soundController.start();
      clearInterval(this.microfoneTimerInterval);
      this.microfoneTimerFunc();
    }
  };

  microphoneOkEvent = (e) => {
    if (this.microphone.getAttribute('mic-status') === 'active') {
      this.soundController.stop();
      clearInterval(this.microfoneTimerInterval);
      this.microphone.setAttribute('mic-status', 'deactivated');
      this.soundController = undefined;
      this.microphone.classList.add('hide-mic');
      this.micOkBtn.classList.add('hide-mic-control');
      this.micCancelBtn.classList.add('hide-mic-control');
      this.microphoneTimerTag.classList.add('hide-mic-timer');
      this.microphone.classList.remove('hide-mic');
    }
  };

  microphoneCancelEvent = (e) => {
    if (this.microphone.getAttribute('mic-status') === 'active') {
      this.microphone.setAttribute('mic-status', 'deactivated');
      this.soundController = undefined;
      this.microphone.classList.add('hide-mic');
      this.micOkBtn.classList.add('hide-mic-control');
      this.micCancelBtn.classList.add('hide-mic-control');
      this.microphoneTimerTag.classList.add('hide-mic-timer');
      this.microphone.classList.remove('hide-mic');
    }
  };

  microfoneTimerFunc = () => {
    let seconds = 0;
    let minutes = 0;
    let zero = true;
    this.microphoneTimerSecondsTag.textContent = '00';
    this.micpohoneTimerMinutesTag.textContent = '00';
    this.microfoneTimerInterval = setInterval(() => {
      seconds += 1;
      if (seconds === 60) {
        minutes += 1;
        seconds = 0;
      }
      if (seconds > 9 || minutes > 9) zero = false;
      if (zero) {
        this.microphoneTimerSecondsTag.textContent = `0${seconds}`;
        this.micpohoneTimerMinutesTag.textContent = `0${minutes}`;
      } else {
        this.microphoneTimerSecondsTag.textContent = `${seconds}`;
        this.micpohoneTimerMinutesTag.textContent = `0${minutes}`;
      }
    }, 1000);
  }
}
