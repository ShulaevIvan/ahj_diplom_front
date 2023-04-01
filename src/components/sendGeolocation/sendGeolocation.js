import messageBuilder from "../messageBuilder/messageBuilder";
import sidebarCategory from '../sidebarCategory/sidebarCategory';
class Geolocation {
    constructor(appTag) {
        this.appContainer = document.querySelector(appTag);
        this.contentColumn = this.appContainer.querySelector('.content-column');
        this.geolocationBtn = this.appContainer.querySelector('.geolocation-btn');
        this.builder =  messageBuilder;
        this.sidebar = sidebarCategory;
        this.geolocationData = {}
        this.serverUrl = 'ws://localhost:7070'
        this.wsServer = new WebSocket(this.serverUrl);
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
                fetch('http://localhost:7070/messages/lastid', { method: 'GET'})
                .then((response) => response.json())
                .then((lastIdData) => {
                    const data = {
                        id: lastIdData.lastId,
                        type: 'geolocation',
                        name: 'geodata',
                        value: this.geolocationData,
                        date: new Date().getTime()
                    }
                    this.wsServer.send(JSON.stringify(data)); 
                    this.builder.createGeolocationMessage(data, data.id);
                    this.sidebar.addCouuntValue(data);
                    const lastItem = this.contentColumn.lastChild;
                    if (lastItem.lastChild) lastItem.scrollIntoView(true);
                });

                
            }, function(err) { console.log (err)}, { enableHighAccuracy: true });
        }
    }

}

const geolocation = new Geolocation('.app-container');

export default geolocation;