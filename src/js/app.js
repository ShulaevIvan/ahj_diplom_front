import FromInput from '../components/formInput';

window.addEventListener('DOMContentLoaded', () => {
    const mainInput = new FromInput();
    const url = 'ws://localhost:7070'
    const ws = new WebSocket(url);

    ws.addEventListener('open', (e) => {
        console.log('test2')
    });

    ws.addEventListener('error', (e) => {
        console.log(e)
    });

    ws.addEventListener('close', (e) => {
    });

    ws.addEventListener('message', (e) => {

    });

});