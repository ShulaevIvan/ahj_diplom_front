import messageBuilder from '../messageBuilder/messageBuilder';
import sidebarCategory from '../sidebarCategory/sidebarCategory';

class Geolocation {
  constructor(appTag) {
    this.appContainer = document.querySelector(appTag);
    this.contentColumn = this.appContainer.querySelector('.content-column');
    this.geolocationBtn = this.appContainer.querySelector('.geolocation-btn');
    this.builder = messageBuilder;
    this.sidebar = sidebarCategory;
    this.geolocationData = {};
    this.serverWsUrl = 'ws://localhost:7070';
    this.serverUrl = 'http://localhost:7070';
    this.wsServer = new WebSocket(this.serverWsUrl);
    this.sendGeolocation = this.sendGeolocation.bind(this);
  }

  sendGeolocation = async (e) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((geoData) => {
        this.geolocationData = {
          localTime: new Date(geoData.timestamp).toLocaleString(),
          longitude: geoData.coords.longitude,
          latitude: geoData.coords.latitude,
        };
        fetch(`${this.serverUrl}/messages/lastid`, { method: 'GET' }).then((response) => response.json())
          .then((lastIdData) => {
            const data = {
              id: lastIdData.lastId,
              type: 'geolocation',
              name: 'geodata',
              value: this.geolocationData,
              date: new Date().getTime(),
            };
            this.wsServer.send(JSON.stringify(data));
            this.builder.createGeolocationMessage(data, data.id);
            this.sidebar.addCouuntValue(data);
            const lastItem = this.contentColumn.lastChild;
            if (lastItem.lastChild) lastItem.scrollIntoView(true);
          });
      }, this.onErr, { enableHighAccuracy: true });
    }
  };

  onErr = (err) => {
    this.err = err;
    return this.err;
  };
}

const geolocation = new Geolocation('.app-container');

export default geolocation;
