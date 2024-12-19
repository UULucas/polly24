<template>
    <div id="joinScreen">
      <div v-if="!joined">
        <div><label for="idTextBox">Enter the Game ID:</label></div>
        <input id="idTextBox" type="text" maxlength="30" v-model="pollId"><br>
        <button id="idButton" v-on:click="participateInPoll">
          JOIN!
        </button>
      </div>
      <div v-if="joined">
        <div><label for="idTextBox">Enter your name:</label></div>
        <input id="idTextBox" type="text" maxlength="30" v-model="userName"><br>
        <div><label for="avatarChoice">Choose an avatar:</label></div>
        <p>Här läggs avatar osv in</p> 
        <button id="idButton" v-on:click="submitNameAndAvatar">
          Join game!
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import io from 'socket.io-client';
  const socket = io("localhost:3000");
  
  export default {
    name: 'LobbyView',
    data: function () {
      return {
        pollId: "",
        userName: "",



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
            alert("You have to choose a name my g!");
            return
        }
        socket.emit("submitNameAndAvatar", {userName: this.userName, avatar: this.avatar})
        this.participants.push(this.userName);

    }
  }
}