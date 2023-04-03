import messageBuilder from '../messageBuilder/messageBuilder';

export default class AudioInput {
  constructor(appTag) {
    this.serverUrl = 'ws://localhost:7070';
    this.wsServer = new WebSocket(this.serverUrl);
    this.appContainer = document.querySelector(appTag);
    this.microphone = this.appContainer.querySelector('.mic-btn');
    this.micCancelBtn = this.appContainer.querySelector('.mic-cancel-btn');
    this.micOkBtn = this.appContainer.querySelector('.mic-ok-btn');
    this.microphoneTimerTag = this.appContainer.querySelector('.microphone-timer');
    this.soundController = undefined;
    this.microfoneTimerInterval = undefined;
    this.builder = messageBuilder;
    this.reader = new FileReader();
    this.lastId = undefined;

    this.microphone.setAttribute('mic-status', 'deactivated');

    this.microphoneClickEvent = this.microphoneClickEvent.bind(this);
    this.microphoneOkEvent = this.microphoneOkEvent.bind(this);
    this.microphoneCancelEvent = this.microphoneCancelEvent.bind(this);

    this.micOkBtn.addEventListener('click', this.microphoneOkEvent);
    this.micCancelBtn.addEventListener('click', this.microphoneCancelEvent);
    this.microphone.addEventListener('click', this.microphoneClickEvent);
  }

  microphoneClickEvent = async (e) => {
    const microphoneTimer = this.appContainer.querySelector('.microphone-timer');

    if (this.microphone.getAttribute('mic-status') === 'deactivated') {
      this.microphone.setAttribute('mic-status', 'active');
      fetch('http://localhost:7070/messages/lastid', { method: 'GET' })
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
          const lastItem = this.appContainer.querySelector('.content-column').lastChild;
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

  microfoneTimerFunc() {
    const secondsTag = this.appContainer.querySelector('.microphone-timer-seconds');
    const minutesTag = this.appContainer.querySelector('.microphone-timer-minutes');
    let seconds = 0;
    let minutes = 0;
    let zero = true;
    secondsTag.textContent = '00';
    minutesTag.textContent = '00';
    this.microfoneTimerInterval = setInterval(() => {
      seconds += 1;
      if (seconds === 60) {
        minutes += 1;
        seconds = 0;
      }
      if (seconds > 9 || minutes > 9) zero = false;
      if (zero) {
        secondsTag.textContent = `0${seconds}`;
        minutesTag.textContent = `0${minutes}`;
      } else {
        secondsTag.textContent = `${seconds}`;
        minutesTag.textContent = `0${minutes}`;
      }
    }, 1000);
  }
}
