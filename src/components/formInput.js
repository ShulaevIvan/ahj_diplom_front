class FromInput {
    constructor(appTag) {
        this.mainContainer = document.querySelector(appTag);
        this.mainInput = this.mainContainer.querySelector('.main-input');
        this.inputAccept = this.inputAccept.bind(this);
        this.validateMainInput = this.validateMainInput.bind(this);
        this.mainInput.addEventListener('keydown', this.inputAccept);
    }

    inputAccept = (e) => {
        const inputValue = e.target.value;
        if (e.key === 'Enter') {
            console.log(this.validateMainInput(inputValue))
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