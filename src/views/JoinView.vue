<template>
  <header>
    <router-link to="/" class= "nav-button">
      <a>
        <img class="home-img" src="../assets/home_icon.png" alt="HomeImg">
      </a>
    </router-link>
    <button class=" nav-button" v-on:click="switchLanguage">
      <img :src="uiLabels.changeLanguage" alt="" class="lang-img">
    </button>
  </header>

  <section>
  <div class="bubbles">
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
    <div class="bubble"></div>
  </div>
</section>

    <div id="joinScreen">
        <div id="nameAvatarWrapper">
          <input
              class="idTextBox text-box"
              type="text"
              maxlength="4"
              :placeholder= "uiLabels.gameIDPlaceholder"
              v-model="pollId">
          <input
              class="idTextBox text-box"
              type="text"
              maxlength="14"
              :placeholder= "uiLabels.namePlaceholder"
              v-model="userName"><br>
        <div><label for="avatarChoice">{{}}</label></div>
        <img :src="avatar" alt="avatar" class="avatar-preview"><br>
        <button @click="resetAvatar()" class="delete-button">
        <h3> {{uiLabels.resetAvatar}} </h3>
        </button>

        <div class="avatarButtonWrapper">
        <button class="nav-button" @click="openDrawModal" style="background-color: var(--p-cadetBlue); border:0px;">
          <img class="home-img" src="https://www.freeiconspng.com/uploads/paint-brush-icon-10.png" alt="Draw avatar" name="draw">
        </button>

        <div v-if="isDrawModalOpen" class="modal" @click.self="closeModal">

          <div class="drawModal-content">
            <span class="closeModal" @click="closeModal">&times;</span>

            <div id="toolbar">

            <div class="toolbar-item">
              <label for="strokeColor">{{ uiLabels.canvasColor }}</label>
              <input id="strokeColor" name="strokeColor" type="color">
            </div>

            <div class="toolbar-item">
              <label for="lineWidth">{{ uiLabels.canvasWidth }}</label>
              <input id="lineWidth" name="lineWidth" type="number" value="5">
            </div>

            <div class="toolbar-item">
              <button id="undo" @click="undoLastStroke">{{ uiLabels.canvasUndo }}</button>
            </div>

            <div class="toolbar-item">
              <button id="clear" @click="clearCanvas">{{ uiLabels.canvasClear }}</button>
            </div>

            </div>
            <canvas ref="drawingCanvas" width="400" height="400"></canvas><br>
            <button id="submitDrawingButton" @click="submitDrawing">Submit avatar</button>
          </div>
        </div>

        <button class="nav-button" @click="openCamModal" style="background-color: var(--p-cadetBlue); border:0px;">
          <img class="home-img" src="https://www.freeiconspng.com/uploads/camera-icon-21.png" alt="Take photo" name="photo">
        </button>

        <div v-if="isCamModalOpen" class="modal" @click.self="closeModal">
          <div class="camModal-content">
            <h2>{{ uiLabels.photo }}</h2>
            <span class="closeModal" @click="closeModal">&times;</span>
            <video ref="camVideo" autoplay playsinline width="400" height="400"></video><br>
            <button id="submitPhotoButton" @click="submitPhoto">{{ uiLabels.submitPhoto }}</button>

          </div>
        </div>
        <button class="nav-button" @click="uploadAvatar" style="background-color: var(--p-cadetBlue); border:0px;">
          <img class="home-img" src="https://www.freeiconspng.com/thumbs/upload-icon/upload-icon-22.png" alt="Upload avatar" name="upload">
        </button>
        <input type="file" ref="fileInput" accept="image/*" style="display: none;" @change="handleFileUpload">
        <canvas ref="uploadCanvas" style="display:none;"></canvas>
        </div>

        <button class="idButton nav-button" v-on:click="submitNameAndAvatar">
          {{ uiLabels.joinButton }}
        </button>
    </div>
  </div>
  </template>

  <script>
  import io from 'socket.io-client';

  const socket = io(sessionStorage.getItem("dataServer"));

  export default {
    name: 'JoinView',
    data: function () {
      return {
        uiLabels:{},
        pollId: "",
        userName: "",
        avatar: "https://i.pinimg.com/474x/25/6b/9d/256b9d21d02a82e9d60deded024e4fe9.jpg",
        isDrawModalOpen: false,
        isCamModalOpen: false,
        camStream: null,
        lang: localStorage.getItem("lang") || "en",
        strokes: [],
        currentStroke: null,

      }
    },
    created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    participateInPoll: function () {
      socket.emit('doesQuizExist', this.pollId, (response) => {

        if(response===true){
          this.generatePlayerId();

          socket.emit( "participateInPoll", {
            pollId: this.pollId,
            name: this.userName,
            avatar: this.avatar,
            id:this.playerId,
          } );

          this.$router.push({
            name: "LobbyView",
            params: {
              id: this.pollId,
              playerId: this.playerId,
            },
          });
        }
        else{
          alert(this.uiLabels.noExistingQuiz);
        }
      });
    },
    generatePlayerId: function (){
      const now = new Date().getTime(); // Hämta aktuell tid i millisekunder
      const random = Math.random().toString(36).substring(2); // Generera en slumpmässig sträng
      this.playerId = btoa(`${now}-${random}`); // Kombinera tid och slumpsträng och Base64-koda
      console.log(this.playerId);
    },
    submitNameAndAvatar: function() {
      if (!this.pollId) {
        alert(this.uiLabels.gameIdAlert);
        return;
      }
      if (!this.userName) {
        alert(this.uiLabels.nameAlert);
        return;
      }

      this.participateInPoll()
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

      const getEventPosition = (e) => {
        const rect = canvas.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) {
          return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top,
          };
        } else if (e.changedTouches && e.changedTouches.length > 0) {
          return {
            x: e.changedTouches[0].clientX - rect.left,
            y: e.changedTouches[0].clientY - rect.top,
          };
        }
        return {
          x: e.offsetX,
          y: e.offsetY,
        };
    };

      const startDrawing = (e) => {
        e.preventDefault();
        drawing = true;
        updateBrush();
        const {x, y} = getEventPosition(e);
        this.currentStroke = {
          color: ctx.strokeStyle,
          width: ctx.lineWidth,
          path: [{ x, y }],
        };
        ctx.beginPath();
        ctx.moveTo(x, y);
      };

      const draw = (e) => {
        if (!drawing) return;
        e.preventDefault();
        const {x, y} = getEventPosition(e);
        ctx.lineTo(x, y);
        ctx.stroke();
        this.currentStroke.path.push({x, y});
      };

      const stopDrawing = () => {
        if (!drawing) return;
        drawing = false;
        ctx.closePath();
        if (this.currentStroke) {
          this.strokes.push(this.currentStroke);
          this.currentStroke = null;
        }
      };

      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseleave', stopDrawing);

      canvas.addEventListener('touchstart', startDrawing);
      canvas.addEventListener('touchmove', draw);
      canvas.addEventListener('touchend', stopDrawing);
      canvas.addEventListener('touchcancel', stopDrawing);

    },

    undoLastStroke: function() {
      if (this.strokes.length === 0) return;

      this.strokes.pop();

      const canvas = this.$refs.drawingCanvas;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      this.strokes.forEach((stroke) => {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.beginPath();
        stroke.path.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y); 
        } else {
          ctx.lineTo(point.x, point.y); 
        }
      });
      ctx.stroke();
      ctx.closePath();
    });

    },
    
    clearCanvas: function() {
      const canvas = this.$refs.drawingCanvas;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = "white";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillRe(0, 0, canvas.width, canvas.height);
      this.strokes = [];
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
        this.isCamModalOpen = false;
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

    uploadAvatar() {
      this.$refs.fileInput.click();
    },
    resetAvatar() {
      this.avatar = "https://i.pinimg.com/474x/25/6b/9d/256b9d21d02a82e9d60deded024e4fe9.jpg"

      const input = this.$refs.fileInput;
      input.value = "";
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      const maxFileSize = 6.8 * 1024 * 1024;

      if (file && file.size > maxFileSize) {
        alert("The selected file is too large. Try another file.");
        this.$refs.fileInput.value = "";
        return;
      }

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = this.$refs.uploadCanvas;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            this.avatar = canvas.toDataURL("image/png");
            console.log("Avatar updated successfully:", this.avatar);
          };
          img.src = e.target.result;
        }
        reader.readAsDataURL(file);
      }

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
},
  }
  </script>

<style scoped>

#joinScreen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-direction: column;
  width: 80%;
  margin:auto;
  gap:1rem;
  z-index: 1;
}

#nameAvatarWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-direction: column;
  width: 80%;
  margin:auto;
  gap:0.5rem;
}

.avatarButtonWrapper {
  display: flex;
  align-items: center;
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
}

#toolbar button {
  border: none;
  border-radius: 4px;
  color: white;
  padding: 0.5rem;
  background-color: var(--p-red);
  font-weight: 400;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
}

#toolbar button:hover {
  transform: scale(1.03);
  transition: transform 0.2s;
  cursor: pointer;
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
  margin-bottom: 1rem;
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
  flex-direction: column;
}

#submitDrawingButton {
  align-self: center;
  margin-top: auto;
  padding: 0.5rem 2rem;
  font-size: 1rem;
  margin-top: 0.5rem;
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

header {
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

.nav-button {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
.delete-button{
  border-radius: 1rem;
  border: none;
  width: 9rem;
  height: auto;
  background-color: var(--p-red);
}

.delete-button:hover {
  cursor:pointer;
  transform: scale(1.03);
  transition: transform 0.2s;
}

#firstJoinBox {
  margin: auto;
}

@media (max-width: 768px) {
  .idTextBox {
    width: 22rem;
    font-size: 30px;
    margin-top: 1rem;
  }

  .idButton {
    width: 22rem;
    margin-bottom: 1rem;
    margin-top: 0.5rem;
  }

  .drawModal-content {
    width: 90%;
    height: 75%;
  }

  #toolbar {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }

  #nameAvatarWrapper {
    gap: 0.2rem;
  }

  .delete-button {
    margin-bottom: 0.4rem;
  }
}
</style>