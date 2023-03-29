import FromInput from '../components/formInput/formInput';
import lazyLoad from '../components/lazyLoad/lazyLoad';
import Search from '../components/search/search';
import Commands from '../components/commands/commands';
import AudioInput from '../components/audioInput/audioInput';

window.addEventListener('DOMContentLoaded', () => {
    const mainInput = new FromInput('.app-container');
    const url = 'http://localhost:7070';
    const lLoad = new lazyLoad(url);
    const search = new Search('.app-container');
    const commands = new Commands('.app-container');
    const audioInput = new AudioInput('.app-container');
    lLoad.loadMessages();

});