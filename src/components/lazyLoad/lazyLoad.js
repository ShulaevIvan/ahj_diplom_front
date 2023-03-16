import messageBuilder from '../messageBuilder/messageBuilder'

class lazyLoad {
    constructor(url) {
        this.contentColumn = document.querySelector('.content-column');
        this.serverUrl = url;
        this.bulder = messageBuilder
        this.audioTypes = ['audio/ogg', 'audio/wav', 'audio/mp3', 'audio/mpeg'];
        this.videoTypes = ['video/mp4', 'video/ogg', 'video/webm'];
        this.imageTypes = ['image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
        this.counter = 0;
        this.contentColumn.addEventListener('scroll', this.loadTenMsg)
    }

    loadTenMsg = (e) => {
        if (this.contentColumn.scrollTop === 0) {
            const first = Array.from(this.contentColumn.querySelectorAll('.content-item'))[0];
            console.log(first)
        }
    }

    loadMessages() {
        const req = fetch('http://localhost:7070/messages/last', {
            method: 'GET',
            eaders: {
                'Content-Type': 'application/json;charset=utf-8'
              },
        })
        .then((response) => {
            if (response.status === 200) return response.json();
        })
        .then((data) => {
            const sorted = data.messages.sort((a, b) => a.date - b.date);
            const allMessages = Array.from(this.contentColumn.querySelectorAll('.content-item'));
            console.log(allMessages)
            if (sorted.length > 10) {
                console.log('test')
            }
            const allMsg = data.messages;
            allMsg.forEach((msgObj) => {
                if (this.imageTypes.includes(msgObj.data.type) || msgObj.data.type === 'text') {
                    messageBuilder.createMessage(msgObj.data);
                }
                else if (this.audioTypes.includes(msgObj.data.type) || this.videoTypes.includes(msgObj.data.type)) {
                    const reader = new FileReader();
                    msgObj.data.value = msgObj.data.file;
                    messageBuilder.createMessage(msgObj.data);
                }
                this.counter += 1;
            });

            allMsg.length >= 1 ? this.contentColumn.lastChild.scrollIntoView() : this.contentColumn.scrollIntoView();
        })
    }

    countMessages() {
        const messagesCount =  Array.from(document.querySelectorAll('.content-item')).length;
        return messagesCount;
    }

}

export default lazyLoad