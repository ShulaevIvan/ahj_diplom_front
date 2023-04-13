import messageBuilder from '../messageBuilder/MessageBuilder';
import lazyLoad from '../lazyLoad/LazyLoad';
import appConfig from '../../configuration/Configuration';

export default class Search {
  constructor(appTag) {
    this.appConfig = appConfig;
    this.mainContainer = document.querySelector(appTag);
    this.contentColumn = this.mainContainer.querySelector('.content-column');
    this.builder = messageBuilder;
    this.lazyLoad = lazyLoad;
    this.displayedMessages = undefined;
    this.contentItemSelector = '.content-item';
    this.searchInput = this.mainContainer.querySelector('.search-input');
    this.findMatches = this.findMatches.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.searchInput.addEventListener('input', this.findMatches);
    this.searchInput.addEventListener('click', this.clearInput);
    this.searchInput.addEventListener('keydown', this.backspaceKeyEvent);
  }

  findMatches = (e) => {
    // eslint-disable-next-line
    const target = e.target;
    target.removeEventListener('input', this.findMatches);
    this.displayedMessages = Array.from(this.contentColumn
      .querySelectorAll(this.contentItemSelector));
    if (this.displayedMessages.length === 0) return;

    setTimeout(() => {
      const inputValue = target.value.trim();
      fetch(`${this.appConfig.serverUrl}${this.appConfig.childUrls.searchText}${inputValue}`, { method: 'GET' })
      // eslint-disable-next-line
        .then((response) => { if (response.status === 200) return response.json(); })
        .then((data) => {
          if (data.messages.length > 0) {
            this.displayedMessages.forEach((item) => item.remove());
            data.messages.forEach((message) => {
              this.builder.createMessage(message.data, message.data.id);
            });
            target.addEventListener('input', this.findMatches);
            return;
          }
          target.addEventListener('input', this.findMatches);
        });
    }, 300);
  };

  clearInput = (e) => {
    if (this.displayedMessages !== undefined) {
      const currentMessages = Array.from(this.mainContainer
        .querySelectorAll(this.contentItemSelector));
      if (currentMessages.length > 0 && this.searchInput !== '') currentMessages.forEach((msg) => msg.remove());
      this.lazyLoad.loadMessages();
      this.searchInput.value = '';
    }
  };

  backspaceKeyEvent = (e) => {
    if (e.keyCode === 8) this.searchInput.value = '';

    if (this.displayedMessages !== undefined) {
      const currentMessages = this.mainContainer.querySelectorAll(this.contentItemSelector);
      if (currentMessages.length > 0) currentMessages.forEach((msg) => msg.remove());

      this.displayedMessages.forEach((item) => {
        this.contentColumn.appendChild(item);
      });
    }
  };
}
