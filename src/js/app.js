import FromInput from '../components/formInput/FormInput';
import Search from '../components/search/Search';
import Commands from '../components/commands/Commands';
import AudioInput from '../components/audioInput/AudioInput';
import lazyLoad from '../components/lazyLoad/LazyLoad';

window.addEventListener('DOMContentLoaded', () => {
  const mainTag = '.app-container';
  const mainInput = new FromInput(mainTag);
  const lLoad = lazyLoad;
  const search = new Search(mainTag);
  const commands = new Commands(mainTag);
  const audioInput = new AudioInput(mainTag);
  lLoad.loadMessages();
});
