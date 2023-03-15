import messageBuilder from '../messageBuilder/messageBuilder'

class lazyLoad {
    constructor(url) {
        this.contentColumn = document.querySelector('.content-column');
        this.serverUrl = url;
        this.bulder = messageBuilder
    }

    loadMessages() {
        const req = fetch('http://localhost:7070/messages/', {
            method: 'GET',
            eaders: {
                'Content-Type': 'application/json;charset=utf-8'
              },
        })
        .then((response) => {
            if (response.status === 200) return response.json();
        })
        .then((data) => {
            const allMsg = data.messages;
            allMsg.forEach((msgObj) => {
                if (msgObj.data.type === 'text') {
                    messageBuilder.createMessage(msgObj.data);
                }
                if (msgObj.data.type === 'audio/mpeg') {
                    const reader = new FileReader();
                    msgObj.data.value = msgObj.data.file;
                    messageBuilder.createMessage(msgObj.data);
                }

            })
        })
    }

    countMessages() {
        const messagesCount =  Array.from(document.querySelectorAll('.content-item')).length;
        return messagesCount;
    }

}

export default lazyLoad