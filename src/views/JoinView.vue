

<template>
  <header>
    <div class="header">
      <router-link to="/" class="header-button nav-button">
        <a>
          <img class="home-img" src="https://static.thenounproject.com/png/2137554-200.png" alt="HomeImg">
        </a>
      </router-link>
    </div>
  </header>

    <div id="joinScreen">
      <div v-if="!joined">

        <input
            class="idTextBox text-box"
            type="text"
            maxlength="30"
            placeholder="Enter Game ID"
            v-model="pollId"><br>

        <button class="idButton nav-button" v-on:click="participateInPoll">
          JOIN!
        </button>

      </div>

      <div v-if="joined">
        <div id="nameAvatarWrapper">
          <input
              class="idTextBox text-box"
              type="text"
              maxlength="30"
              placeholder="Enter your name"
              v-model="userName"><br>

        <div><label for="avatarChoice">Choose an avatar:</label></div>
        <img :src="avatar" alt="avatar" class="avatar-preview"><br>

        <button id="drawButton" @click="openDrawModal">Draw avatar</button>

        <div v-if="isDrawModalOpen" class="modal" @click.self="closeModal">

          <div class="drawModal-content">
            <h2>Draw your avatar!</h2>
            <span class="closeModal" @click="closeModal">&times;</span>
            <canvas ref="drawingCanvas" width="500" height="500"></canvas><br>
            <button id="submitDrawingButton" @click="submitDrawing">Submit avatar</button>
          </div>
        </div>

        <button id="camButton" @click="openCamModal">Take photo</button>

        <div v-if="isCamModalOpen" class="modal" @click.self="closeModal">
          <div class="camModal-content">
            <h2>Take a photo!</h2>
            <span class="closeModal" @click="closeModal">&times;</span>
            <video ref="camVideo" autoplay playsinline width="400" height="400"></video><br>
            <button id="submitPhotoButton" @click="submitPhoto">Submit photo</button>

          </div>
        </div>


        <button class="idButton nav-button" v-on:click="submitNameAndAvatar">
          Join game!
        </button>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  import io from 'socket.io-client';
  const socket = io("localhost:3000");
  
  export default {
    name: 'JoinView',
    data: function () {
      return {
        pollId: "",
        userName: "",
        joined: false,
        avatar: "https://i.pinimg.com/474x/25/6b/9d/256b9d21d02a82e9d60deded024e4fe9.jpg",
        isDrawModalOpen: false,
        isCamModalOpen: false,
        camStream: null,

      }
    },
    created: function () {
    this.pollId = this.$route.params.id;
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "participantsUpdate", p => this.participants = p );
    socket.on( "startPoll", () => this.$router.push("/poll/" + this.pollId) );
    socket.emit( "joinPoll", this.pollId );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    participateInPoll: function () {
      if (!this.pollId) {
        alert("Enter your name!");
        return;
      }
      socket.emit( "participateInPoll", {pollId: this.pollId, name: this.userName} );
      this.joined = true;
    },

    openDrawModal: function() {
      this.isDrawModalOpen = true;
      this.$nextTick(() => {
        this.openCanvas()});
    },

    openCamModal: function() {
      this.isCamModalOpen = true;
      this.$nextTick(() => {
        this.startCam()});

    },

    closeModal: function() {
      this.isDrawModalOpen = false;
      this.isCamModalOpen = false;
      this.stopCam();

    },

    openCanvas: function() {
      const canvas = this.$refs.drawingCanvas;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      let drawing = false;

      canvas.addEventListener('mousedown', (e) => {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
      });

      canvas.addEventListener('mousemove', (e) => {
        if (drawing) {
          ctx.lineTo(e.offsetX, e.offsetY);
          ctx.stroke();
        }
      });

      canvas.addEventListener('mouseup', () => {
        drawing = false;
        ctx.closePath();
      });

    },

    submitDrawing: function() {
      const canvas = this.$refs.drawingCanvas;
      const drawAvatar = canvas.toDataURL("image/png");
      this.avatar = drawAvatar;
      this.closeModal();

    },

    startCam: function() {
      const video = this.$refs.camVideo;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
        video.srcObject = stream;
        this.camStream = stream;

        })
        .catch((err) => {
          console.error("Error accessing camera", err);
        });
      } else {
        alert("Camera not supported in this browser")
      }
    },

    stopCam: function() {
      if (this.camStream) {
      this.camStream.getTracks().forEach((track) => track.stop());
      this.camStream = null; 
      }
    },

    submitPhoto: function() {
      const video = this.$refs.camVideo;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      this.avatar = canvas.toDataURL("image/png");
      this.closeModal();

    },

    submitNameAndAvatar: function() {
      if (!this.userName) {
        alert("You have to choose a name!");
        return;
      }
      socket.emit("submitNameAndAvatar", {
        userName: this.userName,
        avatar: this.avatar,
      });

      console.log({
    id: this.pollId,
    userName: this.userName,
    avatar: this.avatar,
    });

      this.$router.push({
      name: "LobbyView",
      params: {
        id: this.pollId,
        userName: this.userName,
        avatar: this.avatar,
      },
    });
  },
},
  }
  </script>

<style>

#joinScreen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex-direction: column;
  width: 80%;
  margin:auto;
  gap:1rem;
}

#nameAvatarWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex-direction: column;
  width: 80%;
  margin:auto;
  gap:1rem;
}

.idTextBox{
  width: 25rem;
  height: 5rem;
  font-size: 3rem;
}

.idButton {
  width:25rem;
}

.avatar-preview {
  width: 7rem;
  height: 7rem;
  border: none;
  border-radius: 1rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.drawModal-content {
  background: white;
  padding: 1.25rem;
  border-radius: 1rem;
  text-align: center;
  position: relative;
}

.camModal-content {
  background: white;
  padding: 1.25rem;
  border-radius: 1rem;
  text-align: center;
  position: relative;
}

.closeModal {
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  font-size: 24px;
}

canvas {
  cursor: crosshair;
  border: 0.2rem solid black;
  border-radius: 1rem;
}

video {
  border-radius: 1rem;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
}

.header-button {
  position: absolute;
  left: 16px;
  top: 8px;
}

.home-img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  height: 50px;
  width: 50px;
}
</style>