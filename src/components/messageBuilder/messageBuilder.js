class MessageBuilder {
    constructor(appTag) {
        this.mainTag = document.querySelector('.app-container');
        this.contentWrap = this.mainTag.querySelector('.content-column');
        this.file = undefined;
        this.downloadFile = this.downloadFile.bind(this);
    }

    downloadFile = (e) => {
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = 'test.png';
        // a.click();
        // URL.revokeObjectURL(url);
    }

    createMessage(data) {
        const contentItem = document.createElement('div');
        const contentText = document.createElement('div');
        const contentTextValue = document.createElement('div');
        const contentDate = document.createElement('div');

        const date = new Date().toLocaleString();

        contentItem.classList.add('content-item');
        contentText.classList.add('content-text');
        contentTextValue.classList.add('content-text-value');
        contentDate.classList.add('content-item-date');
        if (data.type === 'url') {
            const link = `<a href="${data.value}" target="_blank"> ${data.value}</a>`;
            contentTextValue.innerHTML = link;
        }
        else if (data.type === 'image/png' || data.type === 'image/jpeg' || data.type === 'image/jpg') {
            const img = document.createElement('img');
            img.setAttribute('src', data.value);
            this.file = data;
            img.addEventListener('click', this.downloadFile)
            contentTextValue.appendChild(img);
        }
        else if (data.type === 'text') {
            contentTextValue.textContent = data.value;
        }
        contentDate.textContent = date;
        contentText.appendChild(contentTextValue);
        contentText.appendChild(contentDate);
        contentItem.appendChild(contentText);
        this.contentWrap.appendChild(contentItem);

    }
}
export default MessageBuilder