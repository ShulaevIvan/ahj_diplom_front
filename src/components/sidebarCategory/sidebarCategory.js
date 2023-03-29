class SideBarCategory {
    constructor(appTag) {
        this.appContainer = document.querySelector(appTag);
        this.sidebarColumn = this.appContainer.querySelector('.sidebar-column');
        this.sidebarTextBlockWrap = this.sidebarColumn.querySelector('.sidebar-text-message-count-wrap');
        this.sidebarImageBlockWrap = this.sidebarColumn.querySelector('.sidebar-image-message-count-wrap');
        this.sidebarAudioBlockWrap = this.sidebarColumn.querySelector('.sidebar-audio-message-count-wrap');
        this.sidebarVideoBlockWrap = this.sidebarColumn.querySelector('.sidebar-video-message-count-wrap');
        this.sidebarFielsBlockWrap = this.sidebarColumn.querySelector('.sidebar-fiels-message-count-wrap');
        this.showBtns = Array.from(this.sidebarColumn.querySelectorAll('.show-messages-sidebar'))
        .forEach((btn) => btn.addEventListener('click', this.showMessagesEvent));
    }

    addCouuntValue(data) {
        console.log(data)
    }
    
    showMessagesEvent = (e) => {
        console.log(e)
    }
}
const sidebarCategory = new SideBarCategory('.app-container');

export default sidebarCategory