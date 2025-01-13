<template>
  <head>
    <link rel="stylesheet" href="../assets/main.css">
  </head>

  <header>
      <router-link to="/" class="header-button nav-button">
          <img class="home-img" src="../assets/home_icon.png" alt="HomeImg">
      </router-link>
      <button class= " nav-button" v-on:click="switchLanguage">
        <img :src="uiLabels.changeLanguage" alt="" class="lang-img">
      </button>

  </header>

  <section>
  <div class="bubbles">
    <div class="bubble" v-for="n in 15" :key="n"></div>
  </div>
</section>

  <div id="joinScreen">
      <div class="joinWrapper">
      <div class="textbox">
      <h1>{{uiLabels.welcomeGreeting}}</h1>
      <h3>{{uiLabels.gameId}}: {{pollId}} </h3>
      </div><br>
      <img :src="getAvater()" alt="miniavtr" class="mini-avatar">

        <h3>{{uiLabels.waitMessage}}</h3>

        <div class="spinner">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>

        <h2>{{ uiLabels.participants }}: </h2>
        <div class="participant-list">
          <div v-for="participant in participants" :key="participant" class="participant-box">
            <h4 class="participants-name">{{participant.name}}</h4>
            <img :src="participant.avatar"
                 style="
                  height: 40px;
                  width: 40px;"
                 alt="miniavatar"
                 class="mini-avatar">
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';

const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'LobbyView',
  data: function () {
    return {
      pollId: "inactive poll",
      playerId: "",
      uiLabels: {},
      joined: false,
      lang: localStorage.getItem("lang") || "en",
      participants: [],
    }
  },
  created: function () {
    this.pollId = this.$route.params.id; //Hämtas fårn webbadressen
    this.playerId = this.$route.params.playerId || "";
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "participantsUpdate", p => this.participants = p );
    socket.on( "startPoll", () => this.$router.push("/poll/" + this.pollId + "/"+this.playerId+"/") );
    socket.emit( "joinPoll", this.pollId );
    socket.emit( "getUILabels", this.lang );
    socket.emit("getParticipants", this.pollId);

    socket.on("playerKicked", kicked => {
      if(kicked===this.playerId){
        alert(this.uiLabels.kickedMessage);
        setTimeout(() => {
          window.location.href = '/';
          this.socket.removeAllListeners();
        },3000);
      }
    });

  },
  methods: {
    getAvater: function (){
      let player = this.participants.find(obj => obj.id === this.playerId);
      return player? player.avatar : "";
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
    }
  }
</script>
<style scoped>


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
  margin-bottom: 8rem;
  height: auto;
}

.joinWrapper {
  height: 80vh;
  width: 40em;
  border: none; 
  border-radius: 8px;
  background-color: var(--p-offWhite);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.spinner {
  margin: 10px auto 0;
  width: 70px;
  text-align: center;
}

.spinner > div {
  width: 15px;
  height: 15px;
  background-color: #000000;

  border-radius: 100%;
  display: inline-block;
  animation: bouncedelay 1.8s infinite ease-in-out both;
}

.spinner .bounce1 {
  animation-delay: -0.40s;
}

.spinner .bounce2 {
  animation-delay: -0.20s;
}

@keyframes bouncedelay {
  0%, 80%, 100% { 
    transform: scale(0);
  } 40% { 
    transform: scale(1.0);
  }
}

header {
  display: flex;
  align-items: center;
  padding-top: 1rem;
  padding-left: 1rem;
  gap: 1rem ;
}

.header-button {
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  height: 50px;
  width: 50px;
}

.mini-avatar{
  width: 7rem;
  height: 7rem;
  border: none;
  border-radius: 1rem;
  margin-top: 0.5rem;
}

.participant-list{
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  justify-content: center;
  width: 100%;
  height: 10rem;
  padding-top:10px;
  overflow-y: scroll;
  overflow-x: hidden;
  border-radius: 1rem;
  gap: 5px;
  background-color: white;
}


.participants-name{
  width: 6rem;
  display:flex;
  align-items: left;
  padding:8px;
  text-overflow: ellipsis;
}

.participant-box {
  height: 4rem;
  align-items: center;
  gap: 3px;
  width: 12rem;
  display: flex;
  text-align: center;
  justify-content: center;
  border: 1px solid #ddd;
  background-color: var(--p-offWhite);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-family: "Inter", sans-serif;
}
.textbox{
  padding-left:0.5rem;
  padding-right: 0.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display:inline-block;
  width:30vw;
  height:10vw;
}

@media (max-width: 768px) {
  .textbox {
    width: 20rem;
    height: 10rem;
  }

  .joinWrapper {
    margin-top: 1rem;
    width: 95%;
    height: auto;
  }

  .participant-box {
    width: 10rem;
    margin-left: 1rem;
  }

}

</style>