import MessageBuilder from '../messageBuilder/messageBuilder';

export default class Search {
  constructor(appTag) {
    this.mainContainer = document.querySelector(appTag);
    this.contentColumn = this.mainContainer.querySelector('.content-column');
    this.builder = MessageBuilder;
    this.displayedMessages = undefined;
    this.searchInput = this.mainContainer.querySelector('.search-input');

    this.searchInput.addEventListener('input', this.findMatches);
    this.searchInput.addEventListener('click', this.clearInput);
    this.searchInput.addEventListener('keydown', this.backspaceKeyEvent);
  }

  findMatches = (e) => {
    // eslint-disable-next-line
    const target = e.target;
    target.removeEventListener('input', this.findMatches);
    this.displayedMessages = Array.from(this.mainContainer.querySelectorAll('.content-item'));
    if (this.displayedMessages.length === 0) return;

    setTimeout(() => {
      const inputValue = target.value.trim();
      fetch(`http://localhost:7070/messages/search?text=${inputValue}`, { method: 'GET' })
      // eslint-disable-next-line
        .then((response) => { if (response.status === 200) return response.json(); })
        .then((data) => {
          if (data.messages.length > 0) {
            this.displayedMessages.forEach((item) => item.remove());
            data.messages.forEach((message) => {
              this.builder.createMessage(message.data, message.data.id);
            });
            target.addEventListener('input', this.findMatches);
          } else {
            target.addEventListener('input', this.findMatches);
          }
        });
    }, 300);
  };

  clearInput = (e) => {
    this.searchInput.value = '';
    if (this.displayedMessages !== undefined) {
      const currentMessages = this.mainContainer.querySelectorAll('.content-item');
      if (currentMessages.length > 0) currentMessages.forEach((msg) => msg.remove());
      this.displayedMessages.forEach((item) => {
        this.contentColumn.appendChild(item);
      });
      this.contentColumn.lastChild.scrollIntoView();
    }
  };

  backspaceKeyEvent = (e) => {
    if (e.keyCode === 8) this.searchInput.value = '';

    if (this.displayedMessages !== undefined) {
      const currentMessages = this.mainContainer.querySelectorAll('.content-item');
      if (currentMessages.length > 0) currentMessages.forEach((msg) => msg.remove());

      this.displayedMessages.forEach((item) => {
        this.contentColumn.appendChild(item);
      });
    }
  };
}
