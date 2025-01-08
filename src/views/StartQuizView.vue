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
             class="text-box">
          <div class="participants-name">
            {{participant.name}}
          </div>
          <img :src="participant.avatar"
               alt="miniavtr"
               style="
                 width: 4rem;
                 margin-left: 10rem;
                 height: 4rem;
                 border: none;
                 border-radius: 1rem;">
          <div class="participants-name">
            {{"Score: " + participant.score}}
          </div>
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

    <label v-if="gameStarted">{{uiLabels.timeLeft}}:{{timeLeft}}</label>
    <label v-if="gameStarted" class="text-box" style="font-size: 35px">{{uiLabels.currentQuestion}}: {{question.number+1}}</label>
    <div class="start-section">
      <div v-if="gameStarted&&!question.lastQuestion">
        <button class="start-button nav-button" @click="nextQuestion">{{uiLabels.nextQuestion}}</button>
      </div>

      <button v-if="!gameStarted" class="start-button nav-button" @click="startQuiz">
        {{ uiLabels.startGame }}</button>
      <button v-if="question.lastQuestion" class="start-button nav-button" @click="restartQuiz">Restart</button>
    </div>

  </div>

  </body>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

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
    socket.emit( "joinPoll", this.pollId );;
  },
  methods: {
    restartQuiz : function () {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: -1});
    },
    nextQuestion: function () { //Typ onödig
      console.log(this.question.lastQuestion);
      if(!this.question.lastQuestion){
        socket.emit("nextQuestion", this.pollId);
      }
    },
    startQuiz: function (){
      this.gameStarted = true;
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
  }
}
</script>
<style scoped>

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
  border:solid;
  border-radius: 8px;
  border-width: 1px;
  background-color: var(--p-offWhite);
}

.participants-section{
  border:solid;
  border-radius: 8px;
  border-width: 1px;
  width:51rem;
  height: 20rem;
  overflow-y: scroll;
}

.participants{
  width:48rem;
  height: 22rem;
  margin:auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.participants-name{
  width: 10rem;
  display:flex;
  align-items: center;
  padding:1rem;
  text-overflow: ellipsis;
}

.quiz-key{
  display: flex;
  align-items: center;
  height:6rem;
  width: 38rem;
  font-size: 4rem;
  border: 1px solid;
  margin-top: 0.2rem;
  align-self: flex-end;
}
.start-section{

}


.quiz-name-label {
  display: flex;
  justify-content: center;
  font-size: 2rem;
  margin: 0.4rem;
}
</style>