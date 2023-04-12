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


        }

    }
}


const appConfig = new Configuration('localhost', 7070);

export default appConfig;