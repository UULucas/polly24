<template>
  <div id="joinScreen">
      <div class="joinWrapper">
      <h3>Game ID: </h3>{{pollId}}
      <h1>Welcome to the game!</h1>
      <p>{{ userName }}</p>
      <img :src="avatar" alt="miniavtr" class="mini-avatar">
      <h4>Participants: </h4>
      <ul>
        <li v-for="participant in participants" :key="participant">
          {{ participant }}
        </li>
      </ul>
      <p>Waiting for host to start game</p>
      <div class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
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
      avatar: "",
      pollId: "inactive poll",
      uiLabels: {},
      joined: false,
      lang: localStorage.getItem("lang") || "en",
      participants: []
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.userName = this.$route.params.userName || ""; 
    this.avatar = this.$route.params.avatar || ""; 
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "participantsUpdate", p => this.participants = p );
    socket.on( "startPoll", () => this.$router.push("/poll/" + this.pollId) );
    socket.emit( "joinPoll", this.pollId );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    
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

.spinner {
  margin: 100px auto 0;
  width: 70px;
  text-align: center;
}

.spinner > div {
  width: 18px;
  height: 18px;
  background-color: #333;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% { 
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% { 
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
}

</style>