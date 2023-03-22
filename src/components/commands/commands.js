import messageBuilder  from '../messageBuilder/messageBuilder';

export default class Commands {
    constructor(appTag) {
        this.appContainer = document.querySelector(appTag);
        this.commandInput = this.appContainer.querySelector('.main-input');
        this.allCommands = ['погода', 'время', 'все', 'очистить', 'выход'];
        this.currentCommand = undefined;
        this.geolocation = undefined;

        this.builder = messageBuilder;
        this.commandInput.addEventListener('change', this.validateCommand);
    }

    validateCommand = (e) => {
        const currentCommands = Array.from(document.querySelectorAll('[command="true"]'));
        if (currentCommands.length > 0) currentCommands.forEach((item) => item.remove());

        const checkMainCommand = /^@chaos:/g;
        if (e.target.value.match(checkMainCommand)) {
            const commandVariable = e.target.value.replace(checkMainCommand, '').replace(/\s/g,'');
            const command = this.allCommands.indexOf(commandVariable);
            if (command !== -1) {
                this.currentCommand = this.allCommands[command];
                switch (this.allCommands[command]) {
                    case 'погода': this.getWeather();
                    case 'время': this.showTime();
                    default : break;
                }
                
            }
        }
    }

    getWeather() {
        this.commandInput.value = '';
        fetch('http://localhost:7070/commands/weather', { method: 'GET'}).then((response) =>  {
            if (response.status === 200) return response.json()
        })
        .then((data) => {
            this.builder.displayWeather(data)
        })
    }

    showTime() {
        this.getUserGeo();
    }

    getUserGeo() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((data) => {
            this.geolocation = {
              localTime: new Date(data.timestamp).toLocaleString(),
              longitude: data.coords.longitude,
              latitude: data.coords.latitude,
            };
            this.commandInput.value = '';
            this.builder.displayTime(this.geolocation);
            console.log(this.geolocation)
          }, this.geUserGeoErr, { enableHighAccuracy: true });
        }

      
    }
}

