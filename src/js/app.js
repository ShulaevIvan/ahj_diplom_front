import FromInput from '../components/formInput/formInput';
import lazyLoad from '../components/lazyLoad/lazyLoad';
import Search from '../components/search/search';

window.addEventListener('DOMContentLoaded', () => {
    const mainInput = new FromInput('.app-container');
    const url = 'http://localhost:7070';
    const lLoad = new lazyLoad(url);
    const search = new Search('.app-container')
    lLoad.loadMessages();

});