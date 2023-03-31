import messageBuilder from "../messageBuilder/messageBuilder";
class Geolocation {
    constructor(appTag) {
        this.appContainer = document.querySelector(appTag);
        this.geolocationBtn = this.appContainer.querySelector('.geolocation-btn');
        this.builder =  messageBuilder;
        this.geolocationData = {}
        this.sendGeolocation = this.sendGeolocation.bind(this);
    }


    sendGeolocation = (e) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((data) => {
                this.geolocationData = {
                    localTime: new Date(data.timestamp).toLocaleString(),
                    longitude: data.coords.longitude,
                    latitude: data.coords.latitude,
                };
                this.builder.createGeolocationMessage(this.geolocationData);
            }, function(err) { console.log (err)}, { enableHighAccuracy: true });
        }
    }
}

const geolocation = new Geolocation('.app-container');

export default geolocation;