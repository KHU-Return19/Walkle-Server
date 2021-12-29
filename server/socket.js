// const { ChattingRoom } = require('../models/Chatting/ChattingRoom');
// const { ChattingRoomContents } = require('../models/Chatting/ChattingRoomContents');
// const { ChattingRoomMember } = require('../models/Chatting/ChattingRoomMember');

module.exports = function (io,arr) {
    io.on('connection', (socket, name) => {
        socket.on('register_name', name => {
            arr[name] = socket.id;
            console.log(name + "의 id값은" + arr[name])
        });
        //송신자,수신자,내용을 전달받는다.
        socket.on('chat_message', (sender, taker, content) => {
            console.log(arr[sender] + '가' + arr[taker] + "에게" + content + "라고 했다.");
            io.to(arr[taker]).emit('chat_message', sender, content);
        })
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}