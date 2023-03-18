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
        this.contentColumn.addEventListener('scroll', this.loadHistory);
    }

    loadHistory = (e) => {
        if (this.contentColumn.scrollTop === 0) {
            const displayingMsg = Array.from(this.contentColumn.querySelectorAll('.content-item'));
            const first = displayingMsg[0];
            const displayingIds = [];

            if (displayingMsg.length < 10) return;

            displayingMsg.forEach((msg) => {
                displayingIds.push(Number(msg.getAttribute('messageid')))
            });
            fetch('http://localhost:7070/messages/actual', {
                method: 'POST',
                body: JSON.stringify(displayingIds), 
                headers: {
                'Content-Type': 'application/json;charset=utf-8',
                },
            });
            fetch('http://localhost:7070/messages/loadhistory', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
            })
            .then((response) => response.json())
            .then((data) => {
                data.history.forEach((item) => {
                    this.bulder.createMessage(item.data, item.data.id, true);
                })
            })


            console.log(displayingMsg.length)
        }
    }

    loadMessages() {
        const req = fetch('http://localhost:7070/messages/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
        })
        .then((response) => {
            if (response.status === 200) return response.json();
        })
        .then((data) => {
            const allMsg = data.messages;
            allMsg.forEach((msgObj) => {
                this.counter += 1;
                console.log(msgObj.data)

                if (this.imageTypes.includes(msgObj.data.type) || msgObj.data.type === 'text' && this.counter <= 10) {
                    messageBuilder.createMessage(msgObj.data);
                }
                else if (this.audioTypes.includes(msgObj.data.type) || this.videoTypes.includes(msgObj.data.type) && this.counter <= 10) {
                    const reader = new FileReader();
                    msgObj.data.value = msgObj.data.file;
                    messageBuilder.createMessage(msgObj.data, msgObj.data.id );
                }
            });

            if (allMsg.length >= 1)  this.contentColumn.lastChild.scrollIntoView();
        })
    }

    countMessages() {
        const messagesCount =  Array.from(document.querySelectorAll('.content-item')).length;
        return messagesCount;
    }

}

export default lazyLoad