const socket = io();
const textarea = document.getElementById('send-box');
const msgInput = document.getElementById('msginput');
const msgContainer = document.querySelector(".container")
const sound = new Audio('/ting.mp3')

const append = (msg, pos) => {
    const msgElement = document.createElement('div');
    msgElement.innerText = msg;
    msgElement.classList.add('msg');
    msgElement.classList.add(pos);
    msgContainer.append(msgElement);
}

let username = prompt("Enter your name to join");
socket.emit('new-user', username);

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'center')
})

socket.on('newmsg', data => {
    sound.play();
    append(`${data.name}: ${data.msg}`, 'left')
})

socket.on('left', name => {
    append(`${name} left the chat`, 'center')
})

textarea.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = msgInput.value;
    if (msg) {append(`You: ${msg}`, 'right');
    socket.emit('send', msg);
    msgInput.value = '';}
})