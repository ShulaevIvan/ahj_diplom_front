import FromInput from '../components/formInput/formInput';

window.addEventListener('DOMContentLoaded', () => {
    const mainInput = new FromInput('.app-container');
    const url = 'ws://localhost:7070'
    // const ws = new WebSocket(url);

    // ws.addEventListener('open', (e) => {
    //     ws.send('from front open')
    // });

    // ws.addEventListener('error', (e) => {
    //     console.log(e)
    // });

    // ws.addEventListener('close', (e) => {
    // });

    // ws.addEventListener('message', (e) => {
    //     // console.log(e)
    //     // ws.send('from front open')
    // });

});