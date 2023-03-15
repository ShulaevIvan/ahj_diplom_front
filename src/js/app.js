import FromInput from '../components/formInput/formInput';
import lazyLoad from '../components/lazyLoad/lazyLoad';

window.addEventListener('DOMContentLoaded', () => {
    const mainInput = new FromInput('.app-container');
    const url = 'http://localhost:7070';
    const lLoad = new lazyLoad(url);
    lLoad.loadMessages();

});