class MessageBuilder {
    constructor(appTag) {
        this.mainTag = document.querySelector('.app-container');
        this.contentWrap = this.mainTag.querySelector('.content-column');
        this.file = undefined;
        this.downloadFile = this.downloadFile.bind(this);
    }

    downloadFile = (e) => {
        e.preventDefault();
        const link = document.createElement('a');
        const name = e.target.getAttribute('name');
        link.href = e.target.href
        link.rel = 'noopener';
        link.download = name;
        link.click();
    }
      

    createMessage(data, id, history = false) {
        const audioTypes = ['audio/ogg', 'audio/wav', 'audio/mp3', 'audio/mpeg'];
        const videoTypes = ['video/mp4', 'video/ogg', 'video/webm'];
        const imageTypes = ['image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
        const contentItem = document.createElement('div');
        const contentText = document.createElement('div');
        const contentTextValue = document.createElement('div');
        const contentDate = document.createElement('div');
        const date = new Date(data.date).toLocaleString('ru');
        contentItem.classList.add('content-item');

        id ? contentItem.setAttribute('messageId', id): contentItem.setAttribute('messageId', data.id);

        contentText.classList.add('content-text');
        contentTextValue.classList.add('content-text-value');
        contentDate.classList.add('content-item-date');

        if (data.type === 'url') {
            const link = `<a href="${data.value}" target="_blank"> ${data.value}</a>`;
            contentTextValue.innerHTML = link;
        }
        else if (imageTypes.includes(data.type)) {
            const img = document.createElement('img');
            img.setAttribute('src', data.value);
            img.setAttribute('name', data.name);
            this.file = data;
            img.addEventListener('click', this.downloadFile);
            contentTextValue.appendChild(img);
        }
        else if (audioTypes.includes(data.type)) {
            const audio = document.createElement('audio');
            const downloadBtn = document.createElement('a');
            downloadBtn.classList.add('download-btn');
            downloadBtn.href = data.value;
            downloadBtn.setAttribute('target', 'blank');
            downloadBtn.setAttribute('name', data.name);
            audio.setAttribute('controls', 'nodownload');
            audio.setAttribute('controlsList', 'nodownload');
            audio.src = data.value;
            downloadBtn.addEventListener('click', this.downloadFile);
            contentTextValue.appendChild(audio);
            contentTextValue.appendChild(downloadBtn);
        }
        else if (videoTypes.includes(data.type)) {
            const video = document.createElement('video');
            const downloadBtn = document.createElement('a');
            downloadBtn.classList.add('download-btn');
            downloadBtn.href = data.value;
            downloadBtn.setAttribute('target', 'blank');
            downloadBtn.setAttribute('name', data.name);
            const source = document.createElement('source');
            source.src = data.value;
            source.type = 'video/webm';
            source.setAttribute('codecs', 'avc1.42E01E')
            video.appendChild(source);
            video.setAttribute('controls', '');
            video.setAttribute('controlsList', 'nodownload');
            downloadBtn.addEventListener('click', this.downloadFile);
            contentTextValue.appendChild(video);
            contentTextValue.appendChild(downloadBtn);

        }
        else if (data.type === 'text') {
            contentTextValue.textContent = data.value;
        }
        else {
            const fileIcon = document.createElement('span');
            const downloadBtn = document.createElement('a');
            downloadBtn.classList.add('download-btn');
            downloadBtn.href = data.value;
            downloadBtn.setAttribute('target', 'blank');
            downloadBtn.setAttribute('name', data.name);
            fileIcon.setAttribute('name', data.name.replace(/\s/g, ''));
            fileIcon.classList.add('document-icon');
            fileIcon.textContent = data.name;
            contentTextValue.appendChild(fileIcon);
            contentTextValue.appendChild(downloadBtn)
            downloadBtn.addEventListener('click', this.downloadFile);
        }
        contentDate.textContent = date;
        contentText.appendChild(contentTextValue);
        contentText.appendChild(contentDate);
        contentItem.appendChild(contentText);
        if (data && history) {
            this.contentWrap.insertBefore(contentItem, this.contentWrap.firstElementChild);
        }
        else {
            this.contentWrap.appendChild(contentItem)
        }
    }

}

const messageBuilder = new MessageBuilder('.app-container');

export default messageBuilder