import messageBuilder from '../messageBuilder/messageBuilder';

class SideBarCategory {
    constructor(appTag) {
        this.appContainer = document.querySelector(appTag);
        this.sidebarColumn = this.appContainer.querySelector('.sidebar-column');
        this.sidebarTextBlockWrap = this.sidebarColumn.querySelector('.sidebar-text-message-count-wrap');
        this.sidebarImageBlockWrap = this.sidebarColumn.querySelector('.sidebar-image-message-count-wrap');
        this.sidebarAudioBlockWrap = this.sidebarColumn.querySelector('.sidebar-audio-message-count-wrap');
        this.sidebarVideoBlockWrap = this.sidebarColumn.querySelector('.sidebar-video-message-count-wrap');
        this.sidebarFielsBlockWrap = this.sidebarColumn.querySelector('.sidebar-fiels-message-count-wrap');
        this.resetBtns = this.sidebarColumn.querySelectorAll('.sidebar-reset-filter');
        this.serverUrl = 'http://localhost:7070/';
        this.builder = messageBuilder;
        this.audioTypes = ['audio/ogg', 'audio/wav', 'audio/mp3', 'audio/mpeg'];
        this.videoTypes = ['video/mp4', 'video/ogg', 'video/webm'];
        this.imageTypes = ['image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];

        this.showBtns = Array.from(this.sidebarColumn.querySelectorAll('.show-messages-sidebar'))
        .forEach((btn) => btn.addEventListener('click', this.showMessagesEvent));

        this.resetBtns = Array.from(this.sidebarColumn.querySelectorAll('.sidebar-reset-filter'))
    }

    addCouuntValue(data) {
        console.log(data)
        const messageType = data.type;
        let counterTag;
        if (messageType === 'text') {
            counterTag = 'text';
        }
        else if (this.imageTypes.includes(messageType)) {
            counterTag = 'image';
        }
        else if (this.audioTypes.includes(messageType)) {
            counterTag = 'audio';
        }
        else if (this.videoTypes.includes(messageType)) {
            counterTag = 'video';
        }
        else {
            counterTag = 'fiels'
        }
        counterTag = this.sidebarColumn.querySelector(`.sidebar-${counterTag}-message-count`);
        this.getCounterValue(messageType, counterTag);
    }

    getCounterValue(type, tag) {

        const counterType = type;
        console.log(`${this.serverUrl}messages/counter?type=${type}`)

        fetch(`${this.serverUrl}messages/counter?type=${type}`, { method: 'GET', headers: {
            "Content-Type": "application/json",
        }})
        .then((response) => response.json())
        .then((data => {
            tag.textContent = data.counter;
        }));
    }
    
    showMessagesEvent = (e) => {
        const linktype = e.target.getAttribute('linktype');
        fetch(`${this.serverUrl}messages/types?type=${linktype}`, { method: 'GET', headers: {
            "Content-Type": "application/json",
        }})
        .then((response) => response.json())
        .then((data => {
            document.querySelectorAll('.content-item').forEach((item) => item.remove());
            data.messages.forEach((msg) =>  {
                this.builder.createMessage(msg.data, msg.id);
            });  
        }));
    }

}
const sidebarCategory = new SideBarCategory('.app-container');

export default sidebarCategory