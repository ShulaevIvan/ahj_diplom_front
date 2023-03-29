

class PinnedMessage {
    constructor(appTag) {
        this.appContainer = document.querySelector(appTag);
        this.pinnedWrap = this.appContainer.querySelector('.pinned-wrap');
        this.pinnedMessageId = undefined;
        this.pinnedItem = undefined;
    }

    addPinned  = (e) => {
        const pinnedMessages = document.querySelectorAll('.pinned-item');
        if (!e.target.classList.contains('download-btn') && pinnedMessages.length === 0) {
            this.pinnedItem = e.target.parentNode.closest('.content-item');
            this.pinnedItem.setAttribute('pinned', 'true');
            if (this.pinnedMessageId === undefined) {
                this.pinnedMessageId = this.pinnedItem.getAttribute('messageid');
                const sendData = {
                    id: this.pinnedMessageId
                }
                const req = fetch(`http://localhost:7070/messages/setpinned`, { 
                    method: 'POST',
                    body: JSON.stringify(sendData),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => response.json())
                .then((data) => {
                    this.createPinnedMessage(this.pinnedItem.cloneNode(true));
                    this.pinnedItem = undefined;
                });
            }
        } 
    }

    removePinned = (e) => {
        if (e.target.classList.contains('pinned-content')) {
            const pinnedId = e.target.parentNode.getAttribute('pinnedid');
            const sendData = {
                id: pinnedId,
            }
            fetch(`http://localhost:7070/messages/rmpinned`, { 
                    method: 'POST',
                    body: JSON.stringify(sendData),
                    headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    "Access-Control-Allow-Origin": "*",
                    
            },})
            .then((response) => response.json())
            .then((data) => {
                const pinnedWrap = e.target.parentNode.closest('.pinned-wrap');
                pinnedWrap.firstElementChild.querySelector('.pinned-link').removeEventListener('click', this.pinnedLinkEvent);
                pinnedWrap.firstElementChild.remove();
                pinnedWrap.classList.remove('pinned-show');
                this.pinnedMessageId = undefined;
                document.querySelectorAll('.content-item').forEach((item) => item.removeAttribute('pinned'));
            })
            
        }
        
    }

    createPinnedMessage(tag) {
        const id = tag.getAttribute('messageid');
        const content = tag.querySelector('.content-text-value');
        const date = tag.querySelector('.content-item-date');
        const video = content.querySelector('video');
        const audio = content.querySelector('audio');
        const img = content.querySelector('img');
    
        const pinnedWrap = document.querySelector('.pinned-wrap');
        const pinnedItem = document.createElement('div');
        const pinnedMedia = document.createElement('div');
        const pinnedContent = document.createElement('div');
        const pinnedDate = document.createElement('div');
        const pinnedLinkWrap = document.createElement('div');
        const pinnedLink = document.createElement('a');

        pinnedItem.classList.add('pinned-item');
        pinnedMedia.classList.add('pinned-media');
        pinnedContent.classList.add('pinned-content');
        pinnedLinkWrap.classList.add('pinned-link');
        pinnedLink.classList.add('pinned-link-item');
        pinnedDate.classList.add('pinned-date');
        pinnedItem.setAttribute('pinnedid', id);
        pinnedItem.setAttribute('pinned', true);

        pinnedLink.addEventListener('click', this.pinnedLinkEvent);

        pinnedLinkWrap.appendChild(pinnedLink);


        if (video || img) {
            pinnedMedia.appendChild(video.cloneNode(true))
        }
        else if (audio) {
            pinnedContent.style.width = 20 + '%'
            pinnedMedia.style.width = 50 + '%';
            pinnedMedia.appendChild(audio.cloneNode(true))
        }

        pinnedContent.textContent = content.textContent;
        pinnedDate.textContent = date.textContent;
        pinnedItem.appendChild(pinnedMedia);
        pinnedItem.appendChild(pinnedContent);
        pinnedItem.appendChild(pinnedDate);
        pinnedItem.appendChild(pinnedLinkWrap);
        pinnedWrap.appendChild(pinnedItem);
        pinnedLinkWrap.classList.add('pinned-show');
        this.pinnedWrap.addEventListener('click', this.removePinned);
    }

    pinnedLinkEvent = (e) => {
        const item = e.target.parentNode.closest('.pinned-item');
        if (!item.classList.contains('pinned-full')) {
            const pinnedContent = item.querySelector('.pinned-content');
            const pinnedMedia = item.querySelector('.pinned-media');
            item.classList.add('pinned-item-max');
            pinnedContent.classList.add('pinned-content-full');
            pinnedMedia.classList.add('pinned-media-full'); 
            item.classList.add('pinned-full');
        }
        else {
            const pinnedContent = item.querySelector('.pinned-content');
            const pinnedMedia = item.querySelector('.pinned-media');
            item.classList.remove('pinned-item-max');
            pinnedContent.classList.remove('pinned-content-full');
            pinnedMedia.classList.remove('pinned-media-full'); 
            item.classList.remove('pinned-full')

        }  
    }
}

const pinnedMessage = new PinnedMessage('.app-container');

export default pinnedMessage;