class MessageBuilder {
    constructor(appTag) {
        this.mainTag = document.querySelector('.app-container');
        this.contentWrap = this.mainTag.querySelector('.content-column');
        this.pinnedWrap = this.contentWrap.querySelector('.pinned-wrap');
        this.pinnedMessageId = undefined;
        this.file = undefined;
        this.audioTypes = ['audio/ogg', 'audio/wav', 'audio/mp3', 'audio/mpeg'];
        this.videoTypes = ['video/mp4', 'video/ogg', 'video/webm'];
        this.imageTypes = ['image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
        this.downloadFile = this.downloadFile.bind(this);
    }

    downloadFile = (e) => {
        e.preventDefault();
        const link = document.createElement('a');
        const name = e.target.getAttribute('name');
        e.target.classList.contains('img-download') ? link.href = e.target.src : link.href = e.target.href;
        link.rel = 'noopener';
        link.download = name;
        link.click();
    }
      

    createMessage(data, id, history = false, command = false) {
        const contentItem = document.createElement('div');
        const contentText = document.createElement('div');
        const contentTextValue = document.createElement('div');
        const contentDate = document.createElement('div');
        const msgName = document.createElement('div');
        const date = new Date(data.date).toLocaleString('ru');
        contentItem.classList.add('content-item');
        contentItem.addEventListener('click', this.addPinned)

        id ? contentItem.setAttribute('messageId', id): contentItem.setAttribute('messageId', data.id);

        contentText.classList.add('content-text');
        contentTextValue.classList.add('content-text-value');
        contentDate.classList.add('content-item-date');
        msgName.classList.add('msg-name');

        if (data.type === 'url') {
            const link = `<a href="${data.value}" target="_blank"> ${data.value}</a>`;
            contentTextValue.innerHTML = link;
        }
        else if (this.imageTypes.includes(data.type)) {
            const fileName = data.name;
            fetch(data.file)
            .then(response => response.blob())
            .then((blobData) => {
                const blob = URL.createObjectURL(blobData)
                const img = document.createElement('img');
                img.setAttribute('src', blob);
                img.setAttribute('href', blob);
                img.setAttribute('name', fileName);
                img.classList.add('img-download');
                this.file = data;
                img.addEventListener('click', this.downloadFile);
                msgName.textContent = fileName;
                contentTextValue.appendChild(msgName)
                contentTextValue.appendChild(img);
            })
        }
        else if (this.audioTypes.includes(data.type)) {
            const audio = document.createElement('audio');
            const downloadBtn = document.createElement('a');
            downloadBtn.classList.add('download-btn');
            downloadBtn.href = data.file;
            downloadBtn.setAttribute('target', 'blank');
            downloadBtn.setAttribute('name', data.name);
            audio.setAttribute('controls', 'nodownload');
            audio.setAttribute('controlsList', 'nodownload');
            audio.src = data.file;
            downloadBtn.addEventListener('click', this.downloadFile);
            msgName.textContent = data.name;
            contentTextValue.appendChild(msgName)
            contentTextValue.appendChild(audio);
            contentTextValue.appendChild(downloadBtn);
        }
        else if (this.videoTypes.includes(data.type)) {
            const video = document.createElement('video');
            const downloadBtn = document.createElement('a');
            downloadBtn.classList.add('download-btn');
            downloadBtn.href = data.file;
            downloadBtn.setAttribute('target', 'blank');
            downloadBtn.setAttribute('name', data.name);
            const source = document.createElement('source');
            source.src = data.file;
            source.type = 'video/webm';
            source.setAttribute('codecs', 'avc1.42E01E')
            video.appendChild(source);
            video.setAttribute('controls', '');
            video.setAttribute('controlsList', 'nodownload');
            downloadBtn.addEventListener('click', this.downloadFile);
            msgName.textContent = data.name;
            contentTextValue.appendChild(msgName)
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
            if (command) {
                contentItem.setAttribute('command', true);
                downloadBtn.href = data.file
            }
            else {
                downloadBtn.href = data.value;
            }
            downloadBtn.setAttribute('target', 'blank');
            downloadBtn.setAttribute('name', data.name);
            fileIcon.setAttribute('name', data.name.replace(/\s/g, ''))
            fileIcon.classList.add('document-icon');
            msgName.textContent = data.name;
            contentTextValue.appendChild(msgName)
            contentTextValue.appendChild(fileIcon);
            contentTextValue.appendChild(downloadBtn)
            downloadBtn.addEventListener('click', this.downloadFile);
        }

        contentDate.textContent = date;
        contentText.appendChild(contentTextValue);
        contentText.appendChild(contentDate);
        contentItem.appendChild(contentText);

        data && history ? this.contentWrap.insertBefore(contentItem, this.contentWrap.firstElementChild.nextSibling) : this.contentWrap.appendChild(contentItem);

    }

    displayWeather(data) {
        const allDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'cб', 'вс'];
        const allMonth = ['Янв', 'Фев', 'Март', 'Апрель', 'Май', 
                         'Июнь', 'Июль', 'Август', 'Сентябрь', 
                         'Октябрь', 'Ноябрь', 'Ноябрь', 'Декабрь',
        ];
        const contentItem = document.createElement('div');
        const weatherWrap = document.createElement('div');
        const weatherDate = document.createElement('div');
        const weatherTemp = document.createElement('div');
        const weatherWind = document.createElement('div');
        const weatherDateDay = document.createElement('span');
        const weatherMonth = document.createElement('span');
        const weatherYear = document.createElement('span');

        weatherDateDay.textContent = `${allDays[data.weather.day]}`;
        weatherMonth.textContent = `${allMonth[data.weather.month]}`
        weatherYear.textContent = `${data.weather.year}`;
        weatherTemp.textContent = `температура ${data.weather.temp} °C`;
        weatherWind.textContent = `ветер ${data.weather.wind} м/с`;

        contentItem.classList.add('content-item');
        weatherWrap.classList.add('weather-wrap');
        weatherDate.classList.add('weather-date');
        weatherTemp.classList.add('weather-temp');
        weatherTemp.classList.add('weather-wind');

        contentItem.setAttribute('command', true)

        weatherDate.appendChild(weatherDateDay);
        weatherDate.appendChild(weatherMonth);
        weatherDate.appendChild(weatherYear);

        weatherWrap.appendChild(weatherDate);
        weatherWrap.appendChild(weatherTemp);
        weatherWrap.appendChild(weatherWind);
        contentItem.appendChild(weatherWrap);
        this.contentWrap.appendChild(contentItem)
        

        const resultDate = new Date(data.weather.year, data.weather.month, data.weather.day).toLocaleDateString();
    }

    displayTime(data) {
        const contentItem = document.createElement('div');
        const timeWrap = document.createElement('div');

        contentItem.classList.add('content-item');
        timeWrap.classList.add('time-wrap')

        contentItem.setAttribute('command', true)
        timeWrap.textContent = data.localTime;

        contentItem.appendChild(timeWrap);
        this.contentWrap.appendChild(contentItem);
    }

    addPinned  = (e) => {
        if (!e.target.classList.contains('download-btn')) {
            const contentItem = e.target.parentNode.closest('.content-item');
            contentItem.setAttribute('pinned', 'true');
            if (this.pinnedMessageId === undefined) {
                this.pinnedMessageId = contentItem.getAttribute('messageid');
                this.createPinnedMessage(contentItem.cloneNode(true))
            }
        }
        
    }

    removePinned = (e) => {
        if (e.target.classList.contains('pinned-content')) {
            const pinnedWrap = e.target.parentNode.closest('.pinned-wrap');
            pinnedWrap.firstElementChild.remove();
            pinnedWrap.classList.remove('pinned-show');
            this.pinnedMessageId = undefined;
            document.querySelectorAll('.content-item').forEach((item) => item.removeAttribute('pinned'));
        }
        
    }

    createPinnedMessage(tag) {
        const content = tag.querySelector('.content-text-value');
        const date = tag.querySelector('.content-item-date');
        const video = content.querySelector('video');
        const audio = content.querySelector('audio');
        const img = content.querySelector('img');
    
        const pinnedWrap = document.querySelector('.pinned-wrap');
        const pinnedItem = document.createElement('div');
        const pinnedMedia = document.createElement('div');
        const pinnedContent = document.createElement('div');
        const pinnedDate = document.createElement('div');
        const pinnedLinkWrap = document.createElement('div');
        const pinnedLink = document.createElement('a');

        pinnedItem.classList.add('pinned-item');
        pinnedMedia.classList.add('pinned-media');
        pinnedContent.classList.add('pinned-content');
        pinnedLinkWrap.classList.add('pinned-link');
        pinnedLink.classList.add('pinned-link-item');
        pinnedDate.classList.add('pinned-date');

        pinnedLink.addEventListener('click', this.pinnedLinkEvent);

        pinnedLinkWrap.appendChild(pinnedLink)


        if (video) {
            pinnedMedia.appendChild(video)
        }
        else if (audio) {
            pinnedContent.style.width = 20 + '%'
            pinnedMedia.style.width = 50 + '%';
            pinnedMedia.appendChild(audio)
        }
        else if (img) {
            pinnedMedia.appendChild(img)
        }
        pinnedContent.textContent = content.textContent;
        pinnedDate.textContent = date.textContent;
        pinnedItem.appendChild(pinnedMedia);
        pinnedItem.appendChild(pinnedContent);
        pinnedItem.appendChild(pinnedDate);
        pinnedItem.appendChild(pinnedLinkWrap);
        pinnedWrap.appendChild(pinnedItem);
        pinnedLinkWrap.classList.add('pinned-show');
        this.pinnedWrap.addEventListener('click', this.removePinned);
    }

    pinnedLinkEvent = (e) => {
        const item = e.target.parentNode.closest('.pinned-item');
        if (!item.classList.contains('pinned-full')) {
            const pinnedContent = item.querySelector('.pinned-content');
            const pinnedMedia = item.querySelector('.pinned-media');
            item.classList.add('pinned-item-max');
            pinnedContent.classList.add('pinned-content-full');
            pinnedMedia.classList.add('pinned-media-full'); 
            item.classList.add('pinned-full')
        }
        else {
            const pinnedContent = item.querySelector('.pinned-content');
            const pinnedMedia = item.querySelector('.pinned-media');
            item.classList.remove('pinned-item-max');
            pinnedContent.classList.remove('pinned-content-full');
            pinnedMedia.classList.remove('pinned-media-full'); 
            item.classList.remove('pinned-full')

        }
         
    }
}

const messageBuilder = new MessageBuilder('.app-container');

export default messageBuilder