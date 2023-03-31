import messageBuilder from '../messageBuilder/messageBuilder'
import pinnedMessage from '../pinnedMessage/pinnedMessage';
import sidebarCategory from '../sidebarCategory/sidebarCategory';

class LazyLoad {
    constructor(url) {
        this.contentColumn = document.querySelector('.content-column');
        this.serverUrl = url;
        this.bulder = messageBuilder;
        this.sidebarCategory = sidebarCategory;
        this.audioTypes = ['audio/ogg', 'audio/wav', 'audio/mp3', 'audio/mpeg'];
        this.videoTypes = ['video/mp4', 'video/ogg', 'video/webm'];
        this.imageTypes = ['image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
        this.counter = 0;
        this.hidenMessages = [];
        this.pinnedMessage = pinnedMessage;
        this.contentColumn.addEventListener('scroll', this.loadHistory);
        this.sidebarCategory.resetBtns.forEach((restBtn) => restBtn.addEventListener('click', this.loadMessages))
    }

    loadHistory = () => {
        this.oldHistory = undefined;
        if (this.contentColumn.scrollTop === 0) {
            const displayingMsg = Array.from(this.contentColumn.querySelectorAll('.content-item'));
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
            .then((response) =>  {
                if (response.status === 200) return response.json();
            })
            .then((data) => {
                if (data.history.length <= 10) {
                    data.history.forEach((item) => {
                        this.bulder.createMessage(item.data, item.data.id, true);
                    });
                }
            });
        }
    }

    loadMessages = (e)=> {

        if (e) {
            const displayingMsg = Array.from(this.contentColumn.querySelectorAll('.content-item'));
            const pinnedMssg = this.contentColumn.querySelector('.pinned-item')
            pinnedMssg ? pinnedMssg.remove():
            displayingMsg.forEach((item) => item.remove());
        }
        const req = fetch('http://localhost:7070/messages/last', {
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
            let msg;
            allMsg.forEach((msgObj) => {
                this.counter += 1;
                this.sidebarCategory.addCouuntValue(msgObj.data)
                if (this.imageTypes.includes(msgObj.data.type) || msgObj.data.type === 'text' || msgObj.data.type === 'url' && this.counter <= 10) {
                    console.log(msgObj.data.value)
                    msg = messageBuilder.createMessage(msgObj.data);
                }
                else if (this.audioTypes.includes(msgObj.data.type) || this.videoTypes.includes(msgObj.data.type) && this.counter <= 10) {
                    const reader = new FileReader();
                    msgObj.data.value = msgObj.data.file;
                    msg = messageBuilder.createMessage(msgObj.data, msgObj.data.id);
                }
                else if (!this.audioTypes.includes(msgObj.data.type) || !this.videoTypes.includes(msgObj.data.type) && this.counter <= 10) {
                    const reader = new FileReader();
                    msgObj.data.value = msgObj.data.file;
                    msg = messageBuilder.createMessage(msgObj.data, msgObj.data.id);
                }
                if (msgObj.data.pinned) {
                    this.pinnedMessage.createPinnedMessage(msg);
                }
            });
            setTimeout(() => {
                const dispMsg = Array.from(this.contentColumn.querySelectorAll('.content-item'));
                if (dispMsg.length > 0) dispMsg[dispMsg.length-1].scrollIntoView();
            }, 200);
        });
    }

    countMessages() {
        const messagesCount =  Array.from(document.querySelectorAll('.content-item')).length;
        return messagesCount;
    }

}
const lazyLoad = new LazyLoad('http://localhost:7070');

export default lazyLoad