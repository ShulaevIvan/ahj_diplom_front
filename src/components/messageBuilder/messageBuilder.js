class MessageBuilder {
    constructor(appTag) {
        this.mainTag = document.querySelector('.app-container');
        this.contentWrap = this.mainTag.querySelector('.content-column');
    }

    createMessage(value) {
        const contentItem = document.createElement('div');
        const contentText = document.createElement('div');
        const contentTextValue = document.createElement('div');
        const contentDate = document.createElement('div');

        const date = new Date().toLocaleString();

        contentItem.classList.add('content-item');
        contentText.classList.add('content-text');
        contentTextValue.classList.add('content-text-value');
        contentDate.classList.add('content-item-date');

        contentTextValue.textContent = value;
        contentDate.textContent = date;
        contentText.appendChild(contentTextValue);
        contentText.appendChild(contentDate);
        contentItem.appendChild(contentText);
        this.contentWrap.appendChild(contentItem);

    }
}
export default MessageBuilder