class MessageBuilder {
    constructor(appTag) {
        this.mainTag = document.querySelector('.app-container');
        this.contentWrap = this.mainTag.querySelector('.content-column');
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
            fileIcon.textContent = data.name;
            contentTextValue.appendChild(fileIcon);
            contentTextValue.appendChild(downloadBtn)
            downloadBtn.addEventListener('click', this.downloadFile);
        }

        contentDate.textContent = date;
        contentText.appendChild(contentTextValue);
        contentText.appendChild(contentDate);
        contentItem.appendChild(contentText);
        data && history ? this.contentWrap.insertBefore(contentItem, this.contentWrap.firstElementChild) : this.contentWrap.appendChild(contentItem);

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

    displayFiles(data) {
        console.log(data)
        const contentItem = document.createElement('div');
        const contentText = document.createElement('div');
        const contentTextValue = document.createElement('div');
        const contentDate = document.createElement('div');
    }


}

const messageBuilder = new MessageBuilder('.app-container');

export default messageBuilder