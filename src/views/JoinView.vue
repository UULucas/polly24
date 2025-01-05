<template>
  <header>
    <div class="header">
      <router-link to="/" class= "nav-button">
        <a>
          <img class="home-img" src="../assets/home_icon.png" alt="HomeImg">
        </a>
      </router-link>
      <button class=" nav-button" v-on:click="switchLanguage">
        <img :src="uiLabels.changeLanguage" alt="" class="lang-img">
      </button>
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

        <button class="idButton nav-button" v-on:click="checkID">
          {{ uiLabels.joinButton }}
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
            <span class="closeModal" @click="closeModal">&times;</span>
            
            <div id="toolbar">

            <div class="toolbar-item">
              <label for="strokeColor">Color</label>
              <input id="strokeColor" name="strokeColor" type="color">
            </div>
            
            <div class="toolbar-item"> 
              <label for="bgColor">Background color</label>
              <input id="bgColor" name="bgColor" type="color" value="white">
            </div> 

            <div class="toolbar-item"> 
              <label for="lineWidth">Width</label>
              <input id="lineWidth" name="lineWidth" type="number" value="5">
            </div> 

            <div class="toolbar-item">
              <button id="undo" @click="undoLastStroke">Undo</button>
            </div>

            <div class="toolbar-item"> 
              <button id="clear" @click="clearCanvas">Clear</button>
            </div> 

            </div>
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
          {{ uiLabels.joinButton }}
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
        uiLabels:{},
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
    socket.emit( "joinPoll", this.pollId );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    participateInPoll: function () {
      socket.emit( "participateInPoll", {
        pollId: this.pollId,
        name: this.userName,
        avatar: this.avatar,
      } );
    },
    checkID(){
      if (!this.pollId) {
        alert("Enter your Game ID!");
        return;
      }
      else{
        this.joined = true;
      }
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

      const updateBrush = () => {
        const colorInput = document.getElementById('strokeColor');
        const widthInput = document.getElementById('lineWidth');
        ctx.strokeStyle = colorInput.value;
        ctx.lineWidth = widthInput.value; 
      };

      const colorInput = document.getElementById('strokeColor');
      const widthInput = document.getElementById('lineWidth');

      colorInput.addEventListener('input', updateBrush);
      widthInput.addEventListener('input', updateBrush);

      canvas.addEventListener('mousedown', (e) => {
        drawing = true;
        updateBrush();
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

    clearCanvas: function() {
      const canvas = this.$refs.drawingCanvas;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = "white";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillRe(0, 0, canvas.width, canvas.height);
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

    switchLanguage: function() {
      if (this.lang === "en") {
        this.lang = "sv"
      }
      else {
        this.lang = "en"
      }
      localStorage.setItem( "lang", this.lang );
      socket.emit( "getUILabels", this.lang );
    },


    submitNameAndAvatar: function() {
      if (!this.userName) {
        alert("You have to choose a name!");
        return;
      }
      /*socket.emit("submitNameAndAvatar", {
        userName: this.userName,
        avatar: this.avatar,
      });*/
      this.participateInPoll()

      /*console.log({
    id: this.pollId,
    userName: this.userName,
    avatar: this.avatar,
    });*/

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

<style scoped>

#joinScreen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70vh;
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

#toolbar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  width: auto;
  background-color: var(--p-blue);
  align-items: center;
  margin-top: 2rem;
  border: none;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

#toolbar * {
  margin-bottom: 0.2rem;
}

#toolbar input {
  width: 3rem;
  height: 2rem;
}

#toolbar button {
  border: none;
  border-radius: 4px;
  color: white;
}

#toolbar label {
  font-size: 0.8rem;
  padding-top: 5px;
}

.toolbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

#submitDrawingButton {
  align-self: center; 
  margin-top: auto; 
  padding: 0.5rem 2rem;
  font-size: 1rem;
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
  border: 0.1rem solid black;
}

video {
  border-radius: 1rem;
}

.header {
  display: flex;
  align-items: center;
  padding-top: 1rem;
  position: relative;
  padding-left: 1rem;
  gap: 1rem ;
}

.home-img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  height: 50px;
  width: 50px;
}
</style>