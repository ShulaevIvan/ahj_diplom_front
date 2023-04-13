class Configuration {
  constructor(server, port) {
    this.port = port;
    this.server = server;
    this.serverUrl = `http://${this.server}:${this.port}`;
    this.websocketUrl = `ws://${this.server}:${this.port}`;
    this.childUrls = {
      getLastId: '/messages/lastid',
      getWeather: '/commands/weather',
      clearData: '/commands/deleteall',
      getFiles: '/commands/files',
      getMedia: '/commands/media',
      acutalMsg: '/messages/actual',
      loadHistory: '/messages/loadhistory',
      messages: '/messages',
      lastMessages: '/messages/last',
      yandexMapsUrl: 'https://static-maps.yandex.ru/1.x',
      setPinned: '/messages/setpinned',
      rmPinned: '/messages/rmpinned',
      searchText: '/messages/search?text=',
      counterType: '/messages/counter?type=',
      messageType: '/messages/types?type=',
    };
  }
}

const appConfig = new Configuration('localhost', 7070);

export default appConfig;
