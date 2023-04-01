import pinnedMessage from '../pinnedMessage/pinnedMessage';

class MessageBuilder {
    constructor(appTag) {
        this.mainTag = document.querySelector('.app-container');
        this.contentWrap = this.mainTag.querySelector('.content-column');
        this.file = undefined;
        this.pinned = pinnedMessage;
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
        contentItem.addEventListener('click', this.pinned.addPinned)

        id ? contentItem.setAttribute('messageId', id): contentItem.setAttribute('messageId', data.id);

        contentText.classList.add('content-text');
        contentTextValue.classList.add('content-text-value');
        contentDate.classList.add('content-item-date');
        msgName.classList.add('msg-name');

        if (data.type === 'url') {
            const link = `<a href="${data.name}" target="_blank"> ${data.name}</a>`;
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
        return contentItem

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
        this.contentWrap.lastChild.scrollIntoView();
        

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

    createGeolocationMessage(geoData, id, history = false) {
        const data = geoData;
        this.yandexStaticUrl = 'https://static-maps.yandex.ru/1.x/';
        this.urlIcon = `pt=${data.value.longitude},${data.value.latitude}`;
        this.imgUrl = `${this.yandexStaticUrl}?ll=${data.value.longitude},${data.value.latitude}&z=15&size=450,450&l=map&${this.urlIcon}`;
        
        const contentItem = document.createElement('div');
        const contentText = document.createElement('div');
        const geolocationWrap = document.createElement('div');
        const geolocationCordsWrap = document.createElement('div');
        const geolocationLatitude = document.createElement('div');
        const geolocationLongitude = document.createElement('div');
        const geolocationLocalTime = document.createElement('div');
        const geolocationImageWrap = document.createElement('div');
        const geolocationImage = document.createElement('img');
        const contentItemDate = document.createElement('div');

        const geolocationLatitudeH4 = document.createElement('h4');
        const geolocationLongitudeH4 = document.createElement('h4');
        const geolocationLocalTimeH4 = document.createElement('h4');

        geolocationLatitudeH4.textContent = data.value.latitude;
        geolocationLongitudeH4.textContent = data.value.longitude;
        geolocationLocalTimeH4.textContent = data.value.localTime;
        contentItemDate.textContent = new Date(data.date).toLocaleString('ru');
        geolocationImage.setAttribute('src', this.imgUrl);
        id ? contentItem.setAttribute('messageId', id): contentItem.setAttribute('messageId', data.id);

        contentItem.classList.add('content-item');
        contentText.classList.add('content-text');
        geolocationWrap.classList.add('geolocation-wrap');
        geolocationCordsWrap.classList.add('geolocation-cords-wrap');
        geolocationLatitude.classList.add('geolocation-latitude');
        geolocationLongitude.classList.add('geolocation-longitude');
        geolocationLocalTime.classList.add('geolocation-local-time');
        geolocationImageWrap.classList.add('geolocation-image-wrap');
        geolocationImage.classList.add('geolocation-image');
        contentItemDate.classList.add('content-item-date');

        geolocationLatitude.appendChild(geolocationLatitudeH4);
        geolocationLongitude.appendChild(geolocationLongitudeH4);
        geolocationLocalTime.appendChild(geolocationLocalTimeH4);

        geolocationCordsWrap.appendChild(geolocationLatitude);
        geolocationCordsWrap.appendChild(geolocationLongitude);
        geolocationCordsWrap.appendChild(geolocationLocalTime);
        geolocationImageWrap.appendChild(geolocationImage);

        geolocationWrap.appendChild(geolocationCordsWrap);
        geolocationWrap.appendChild(geolocationImageWrap);
        contentText.appendChild(geolocationWrap);
        contentText.appendChild(contentItemDate)
        contentItem.appendChild(contentText);

        data && history ? this.contentWrap.insertBefore(contentItem, this.contentWrap.firstElementChild.nextSibling) : this.contentWrap.appendChild(contentItem);
    }
}

const messageBuilder = new MessageBuilder('.app-container');

export default messageBuilder