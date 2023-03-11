import '../messageBuilder/messageBuilder';
import MessageBuilder from '../messageBuilder/messageBuilder';

class FromInput {
    constructor(appTag) {
        this.mainContainer = document.querySelector(appTag);
        this.mainInput = this.mainContainer.querySelector('.main-input');
        this.builder = new MessageBuilder(appTag);
        this.serverUrl = 'ws://localhost:7070'
        this.wsServer = new WebSocket(this.serverUrl);

        this.inputAccept = this.inputAccept.bind(this);
        this.validateMainInput = this.validateMainInput.bind(this);
        this.openWs = this.openWs.bind(this);
        this.closeWs = this.closeWs.bind(this);
        this.messageWs = this.messageWs.bind(this);

        this.wsServer.addEventListener('open', this.openWs);
        this.wsServer.addEventListener('close', this.closeWs);
        this.wsServer.addEventListener('message', this.messageWs);
        this.mainInput.addEventListener('keydown', this.inputAccept);

    }
    openWs = (e) => {
        
    }
    closeWs = (e) => {

    }
    messageWs = (e) => {
        this.wsServer.send(e)
    }

    inputAccept = (e) => {
        const inputValue = e.target.value;
        const data = {}
        if (e.key === 'Enter') {
            const inputType = this.validateMainInput(inputValue);
            if (inputType === 'text' || inputType === 'url' || inputType === 'img') {
                data.type = inputType
                data.value = inputValue
                this.builder.createMessage(data);
                this.wsServer.send(JSON.stringify(data))
                this.mainInput.value = '';
            }
        }
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
}

export default FromInput