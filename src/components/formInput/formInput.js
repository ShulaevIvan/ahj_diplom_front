import '../messageBuilder/messageBuilder';
import messageBuilder from '../messageBuilder/messageBuilder';
import sidebarCategory from '../sidebarCategory/sidebarCategory';
import geolocation from '../sendGeolocation/sendGeolocation';

class FromInput {
    constructor(appTag) {
        this.mainContainer = document.querySelector(appTag);
        this.contentColumn = this.mainContainer.querySelector('.content-column');
        this.mainInput = this.mainContainer.querySelector('.main-input');
        this.fileInput = this.mainContainer.querySelector('.hidden-upload-btn');
        this.geolocation = geolocation;
        this.builder = messageBuilder;
        this.sidebar = sidebarCategory;
        this.lastMessageId = undefined;
        this.serverUrl = 'ws://localhost:7070'
        this.wsServer = new WebSocket(this.serverUrl);

        this.inputAccept = this.inputAccept.bind(this);
        this.validateMainInput = this.validateMainInput.bind(this);
        this.getBase64 = this.getBase64.bind(this);
        this.openWs = this.openWs.bind(this);
        this.closeWs = this.closeWs.bind(this);
        this.messageWs = this.messageWs.bind(this);
        this.fileLoad = this.fileLoad.bind(this);
        this.dropEvent = this.dropEvent.bind(this);

        this.wsServer.addEventListener('open', this.openWs);
        this.wsServer.addEventListener('close', this.closeWs);
        this.wsServer.addEventListener('message', this.messageWs);
        this.mainInput.addEventListener('keydown', this.inputAccept);
        this.fileInput.addEventListener('change', this.fileLoad);
        this.contentColumn.addEventListener('dragover', this.dragEvent);
        this.contentColumn.addEventListener('drop',  this.dropEvent);
        this.geolocation.geolocationBtn.addEventListener('click', this.geolocation.sendGeolocation);

    }
    openWs = (e) => {
        
    }
    closeWs = (e) => {

    }
    messageWs = (e) => {
        // this.lastMessageId = e.data;
    }
        

    inputAccept = (e) => {
        const inputValue = e.target.value;
        const checkCommand = /^@chaos:/g
        if (inputValue.match(checkCommand)) return;

        if (e.key === 'Enter' && inputValue !== '' && inputValue.trim() !== '') {
            fetch('http://localhost:7070/messages/lastid', { method: 'GET'})
            .then((response) => response.json())
            .then((data) => {
                this.lastMessageId = data.lastId;
                const inputType = this.validateMainInput(inputValue);
                const lastItem = this.contentColumn.lastChild;
                data.id = this.lastMessageId,
                data.type = inputType;
                data.name = inputValue;
                data.value = inputValue;
                data.date = new Date().getTime();
                this.builder.createMessage(data);
                this.wsServer.send(JSON.stringify(data));
                sidebarCategory.addCouuntValue(data);

                this.mainInput.value = '';
                if (lastItem.lastChild) lastItem.scrollIntoView(true);
            });
        }
    }

    fileLoad = (e) => {
        const file = e.srcElement.files[0];
        if (!file) return
        fetch('http://localhost:7070/messages/lastid', { method: 'GET'})
        .then((response) => response.json())
        .then((dataId) => {
            e.preventDefault();
            this.lastMessageId = dataId.lastId
            const url = URL.createObjectURL(file);
            this.getBase64(file, url);
        });
    }

    getBase64 = (file, url) => {
        const id = this.lastMessageId
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const lastItem = this.contentColumn.lastChild;
            const data = {
                id: id,
                type: file.type,
                name: file.name,
                value: url,
                file: reader.result,
                date: new Date().getTime()
            }
            this.builder.createMessage(data)
            this.wsServer.send(JSON.stringify(data));
            sidebarCategory.addCouuntValue(data);
            if (lastItem.lastChild) lastItem.scrollIntoView(true);
        };
        reader.onerror = (error) => {
          console.log('Error: ', error);
        };
     }
     

    validateMainInput = (inputData) => {
        const catchUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
        const catchImg = /([/|.|\w|\s|-])*\.(?:jpg|gif|png|svg|gif)/;

        if (catchUrl.test(inputData)) {
            return 'url'
        }
        else if (catchImg.test(inputData)) {
            return 'img'
        }
        else if (!catchImg.test(inputData) && !catchUrl.test(inputData)) {
            return 'text'
        }
    }

    dragEvent = (e) => {
        e.preventDefault();
    }
    dropEvent = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        files.forEach((file) => {
            fetch('http://localhost:7070/messages/lastid', { method: 'GET'})
            .then((response) => { if (response.status === 200) return response.json() })
            .then((data) => {
                this.lastMessageId = data.lastId;
                const url = URL.createObjectURL(file);
                this.getBase64(file, url)
            });
            
        });
    }


}

export default FromInput