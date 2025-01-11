<template>
  <head>
    <link rel="stylesheet" href="../assets/main.css">
  </head>

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


  <body>
  <div id="main-container">
    <div class="head-container">

      <div class="name-and-key">

        <div class="quiz-name">
          <label class="quiz-name-label">
            {{quizName}}
          </label>

        </div>

        <label class="quiz-key text-box" id="pollId">
          {{pollId}}
        </label>

      </div>

      <div class="share-key">
        <button @click="copyText" class="share-key-button nav-button">
          {{uiLabels.shareKey}}
        </button>
      </div>
    </div>

    <div class="participants-section">
      <h2>{{uiLabels.participants}}</h2>

      <div class="participants"> <!--  Denna diven är till för att ha våra participants i så vi kan
                                          nog bara sätta en array här i med dom som går med spelet-->
        <div v-for="participant in participants"
             :key="participant.id"
             class="text-box-participant">
             <img :src="participant.avatar"
               alt="miniavtr"
               style="
                 width: 3rem;
                 height: 3rem;
                 border: none;
                 border-radius: 1rem;
                 position: relative;
                 margin-top: 0.25rem;">
             <div class="participants-name">
            {{participant.name}}
          </div>
          <div class="participants-name">
            {{"Score: " + participant.score}}
          </div>
          <button id="kickButton" @click="kickPlayer(participant.id)">
            <img id="kickImage" src="https://www.freeiconspng.com/thumbs/x-png/x-png-15.png" alt="kickImg">
          </button>
          <img v-if="participant.answers.length===this.currentQuestion+1&&this.gameStarted"
               src="../assets/pngegg.png"
               alt="Checkmark"
               style="
                 width: 4rem;
                 margin-left: 10rem;
                 height: 4rem;
                 border: none;
                 border-radius: 1rem;">
        </div>

      </div>
    </div>

    <div v-if="gameStarted" class="text-box time-display">
      <label v-if="timeLeft>0">{{uiLabels.timeLeft}}:{{timeLeft}}<br>{{uiLabels.currentQuestion}}: {{question.number+1}}</label>
      <label v-else>{{uiLabels.showingResult}}</label>
    </div>
    <div class="start-section">
      <div v-if="gameStarted&&!question.lastQuestion">
        <button class="start-button nav-button" @click="nextQuestion">{{uiLabels.nextQuestion}}</button>
      </div>

      <button v-if="!gameStarted&&!question.lastQuestion" class="start-button nav-button" @click="startQuiz">
        {{ uiLabels.startGame }}</button>
      <button v-if="question.lastQuestion" class="start-button nav-button" @click="restartQuiz">{{uiLabels.restartQuiz}}</button>
    </div>

  </div>

  </body>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'StartQuizView',

  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      answers: ["", ""], //Användäns inte
      participants: [],
      question:{number:-69,lastQuestion:false},
      uiLabels: {},
      gameStarted: false,
      timeLeft: 0,
      quizName: "Untitled quiz",

    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "participantsUpdate", p => this.participants = p);
    socket.on("timeUpdated", t => this.timeLeft = t);
    socket.on("currentQuestion", q => this.loadQuestion(q));
    socket.on("quizName", name => this.quizName = name);
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
    socket.emit("getParticipants", this.pollId);
  },
  methods: {
    restartQuiz : function () {
      let c = confirm(this.uiLabels.confirmRestart);
      if(c){
        socket.emit("restartQuiz", this.pollId);
      }
    },
    nextQuestion: function () {
      console.log(this.question.lastQuestion);
      if(!this.question.lastQuestion){
        socket.emit("nextQuestion", this.pollId);
      }
    },
    startQuiz: function (){
      socket.emit("startPoll", this.pollId);
      this.nextQuestion();
    },
    copyText: function () {
      var copyText = document.getElementById("pollId").innerText;
      navigator.clipboard.writeText(copyText); //kod tagen från W3
      alert(this.uiLabels.copiedTextAlert + copyText);
    },
    loadQuestion: function (newQuestion){
      this.question = newQuestion;
      this.gameStarted = this.question.number > -1;
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
    //kicka spelare, inte fått den att funka, blev massa fel när jag ändrade i sockets.js, så tog bort den delen
    kickPlayer(participantId) {
      const confirmKick = confirm(this.uiLabels.confirmKick || "Are you sure you want to kick this player?");
      if (confirmKick) {
        socket.emit("kickPlayer", { pollId: this.pollId, participantId })
        this.participants = this.participants.filter(participant => participant.id !== participantId);
      }
    }
  }
}
</script>
<style scoped>
.time-display{
  font-size: 35px;
  padding-right: 1rem;
  padding-left: 1rem;
}
.time-display:hover{
  transform: none;
  transition: none;
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

#main-container{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
  flex-direction: column;
  width: 80%;
  margin:auto;
  gap:1rem;
}

.head-container{
  display: flex;
  gap:1rem;
}

.name-and-key{
  gap:1rem;
}


.share-key-button{
  height: 96.4%;
  width: 12rem;
}

.quiz-name{
  height:3rem;
  border-radius: 8px;
  background-color: var(--p-offWhite);
}

.participants-section{
  overflow-y: scroll;
  border: none;
  border-radius: 10px;
  padding: 20px;
  background-color: #a0ca92;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: opacity 0.5s ease-in-out;
}

.participants{
  width:48rem;
  height: 22rem;
  margin:auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}


.text-box-participant {
  display: grid;
  grid-template-columns: 3rem 1fr auto auto;
  align-items: center;
  gap: 1rem;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: "Inter", sans-serif;
}

.participants-name{
  font-size: large;
  font-weight: 600;
  box-shadow: inset 0px -5px 0px #e0be36;
  margin-top: 1rem;
  height: 0.5rem;
  display:flex;
  align-items: center;
  padding:1rem;
  text-overflow: ellipsis;
}
.quiz-key{
  display: flex;
  align-items: center;
  height:6.1rem;
  width: 38rem;
  font-size: 4rem;
  margin-top: 0.2rem;
  align-self: flex-end;
}

.quiz-key:hover{
  transition: none;
  transform: none;
}
.start-section{

}


.quiz-name-label {
  display: flex;
  justify-content: center;
  font-size: 2rem;
  padding-top: 0.3rem;
}

#kickImage {
  height: 1rem;
  width: 1rem;
}

#kickButton {
  border: none;
  border-radius: 3px;
  height: 1.5rem;
  width: 1.5rem;
  cursor: pointer;
  background-color: cadetblue;
}



</style>