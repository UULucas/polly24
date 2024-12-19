<template>
    <div id="joinScreen">
      <div v-if="!joined">
        <div><label for="idTextBox">Enter Game ID:</label></div>
        <input id="idTextBox" type="text" maxlength="30" v-model="pollId"><br>
        <button id="idButton" v-on:click="participateInPoll">
          JOIN!
        </button>
      </div>
      <div v-if="joined">
        <div class="nameAvatarWrapper">
        <div><label for="idTextBox">Enter your name:</label></div>
        <input id="idTextBox" type="text" maxlength="30" v-model="userName"><br>
        <div><label for="avatarChoice">Choose an avatar:</label></div>
        <img :src="avatar" alt="avatar" class="avatar-preview"><br>
        <p>Choose avatar: lägg in knapp för att ta bild med kamera och ladda upp</p>
        <button id="idButton" v-on:click="submitNameAndAvatar">
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
      socket.emit( "participateInPoll", {pollId: this.pollId} );
      this.joined = true;
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

      // Redirect to /lobby/:id
      this.$router.push(`/lobby/${this.pollId}`);
    },
  },
};
  </script>

<style>

html, body {
  height: 100%;
  margin: 0;
  background-color: var(--p-blue);
}

#joinScreen {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: auto;
  height: 100vh;
}


label {
  font-size: 30px;
  font-weight: bold;
  display: block;
  margin-bottom: 10px;

}

input[type="text"] {
  height: 40px;
  width: 300px;
  padding: 10px;
  font-size: 40px;
  text-align: center;
}

#idButton {
  margin: 10px;
  height: 80px;
  width: 150px;
  font-size: 30px;
  background-color: var(--p-yellow);
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 5px;

}

#idButton:hover {
  transform: scale(1.1);
}

.avatar-preview {
  width: 100px;
  height: 100px
}


</style>