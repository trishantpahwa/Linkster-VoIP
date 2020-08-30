const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer(undefined, {
    host: 'peer-server-js.herokuapp.com',
    port: '443',
    secure: true
});

const peers = { };

const myVideo = document.createElement('video');
myVideo.muted = true;

navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(function(stream) {
    addVideoStream(myVideo, stream);
    myPeer.on('call', function(call) {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', function(userVideoStream) {
            addVideoStream(video, userVideoStream);
        });
    });
    socket.on('user-connected', function(userId) {
        connectToNewUser(userId, stream);
    });
});

socket.on('user-disconnected', function(userId) {
    console.log(userId);
    if(peers[userId]) peers[userId].close();
});

myPeer.on('open', function(id) {
    socket.emit('join-room', ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', function(userVideoStream) {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', function() {
        video.remove();
    });
    peers[userId] = call;
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}