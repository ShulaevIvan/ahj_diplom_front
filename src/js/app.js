import FromInput from '../components/formInput/formInput';
import Search from '../components/search/search';
import Commands from '../components/commands/commands';
import AudioInput from '../components/audioInput/audioInput';
import lazyLoad from '../components/lazyLoad/lazyLoad';

window.addEventListener('DOMContentLoaded', () => {
  const mainTag = '.app-container';
  const mainInput = new FromInput(mainTag);
  const lLoad = lazyLoad;
  const search = new Search(mainTag);
  const commands = new Commands(mainTag);
  const audioInput = new AudioInput(mainTag);
  lLoad.loadMessages();
});
