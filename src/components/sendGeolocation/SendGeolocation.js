import messageBuilder from '../messageBuilder/MessageBuilder';
import sidebarCategory from '../sidebarCategory/SidebarCategory';
import appConfig from '../../configuration/Configuration';

class Geolocation {
  constructor(appTag) {
    this.appConfig = appConfig;
    this.appContainer = document.querySelector(appTag);
    this.contentColumn = this.appContainer.querySelector('.content-column');
    this.geolocationBtn = this.appContainer.querySelector('.geolocation-btn');
    this.builder = messageBuilder;
    this.sidebar = sidebarCategory;
    this.geolocationData = {};
    this.wsServer = new WebSocket(this.appConfig.websocketUrl);
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
        fetch(`${this.appConfig.serverUrl}${this.appConfig.childUrls.getLastId}`, { method: 'GET' }).then((response) => response.json())
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
            setTimeout(() => {
              if (lastItem.lastChild) lastItem.scrollIntoView(true);
            }, 500);
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
