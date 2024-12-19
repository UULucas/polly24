<template>
  <div id="joinScreen">
      <div class="joinWrapper">
      <h3>Game ID: </h3>{{pollId}}
      <h1>Welcome to the game {{ userName }}!</h1>
      <h4>Participants: </h4>
      <ul>
        <li v-for="participant in participants" :key="participant">
          {{ participant }}
        </li>
      </ul>
      <p>Waiting for host to start game...</p>
      {{ participants }}
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
      userName: "",
      pollId: "inactive poll",
      uiLabels: {},
      joined: false,
      lang: localStorage.getItem("lang") || "en",
      participants: []
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
      if (!this.userName) {
        alert("Enter your name!");
        return;
      }
      socket.emit( "participateInPoll", {pollId: this.pollId, name: this.userName} );
      this.participants.push(this.userName);
      this.joined = true;
    }
  }
}
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

#participateButton {
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

#participateButton:hover {
  transform: scale(1.1);
}

.joinWrapper {
  height: 500px;
  width: 500px;
  border: 2px solid #000; 
  border-radius: 10px; 
  padding: 20px; 
  background-color: #ffffff; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);  
  margin: 20px auto; 
  text-align: center; 
}

</style>