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

        <div class="quiz-name"> <!--  här ska quizens namn stå, som vi får hämta från där man skapar eller nått-->
          {{pollData.quizName}}
        </div>

        <!--input
            class="quiz-key text-box"
            :value="text"
            type="text"
            placeholder="Quiz key"
            @input="event => text = event.target.value"!-->
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
        <div v-for="participant in pollData.participants" :key="participant.id"  class="text-box" >
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
        </div>

      </div>
    </div>

    <!--form action= "" onsubmit="event.preventDefault();">
      <p>
        <label for="Time">Choose time of the question (seconds)</label>
        <select id="Time" v-model="setTime">
          <option selected="selected">30</option>
          <option>20</option>
          <option>15</option>
          <option>10</option>
        </select>
      </p>
      <button v-on:click="setGameTime(setTime);" type="submit">
        <label> Start timer </label>
      </button>
      <br>
    </form!-->
    <label v-if="gameStarted">{{uiLabels.timeLeft}}:{{timeLeft}}</label>
    <label v-if="gameStarted" class="text-box" style="font-size: 35px">{{uiLabels.currentQuestion}}: {{pollData.currentQuestion+1}}</label>
    <div class="start-section">
      <div v-if="gameStarted">
        <button class="start-button nav-button" @click="previousQuestion">{{uiLabels.prevQuestion}}</button>
        <button class="start-button nav-button" @click="nextQuestion">{{uiLabels.nextQuestion}}</button>
      </div>

      <button v-if="!gameStarted" class="start-button nav-button" @click="startQuiz">
        Starta spel</button>
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
      question: "",
      answers: ["", ""],
      pollData: {currentQuestion: 0},
      uiLabels: {},
      imageUrl: "",
      gameStarted: false,
      //setTime: 0,
      timeLeft: 0,
      timeOutID: null,

    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "pollData", data => this.loadQuiz(data) );
    socket.on( "participantsUpdate", p => this.pollData.participants = p );
    socket.emit( "getUILabels", this.lang );
    socket.emit("createPoll", {pollId: this.pollId}) //Hämtar all data redan
    socket.emit( "joinPoll", this.pollId );
    socket.emit("loadQuiz", this.pollId);
  },
  watch: {
    timeLeft: {
      handler(time){
        if(time>0){
          this.timeOutID=setTimeout(() => {
            this.timeLeft--;
          }, 1000);
        }
      },
      immediate: true,
    }
  },
  methods: {
    runQuestion: function (questionNumber) {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: questionNumber});
    },
    previousQuestion: function () {
      if(this.pollData.currentQuestion>0){
        this.pollData.currentQuestion--;
        this.runQuestion(this.pollData.currentQuestion);
        this.setGameTime();
      }
    },
    nextQuestion: function () {
      if(this.pollData.currentQuestion<this.pollData.questions.length-1){
        this.pollData.currentQuestion++;
        this.runQuestion(this.pollData.currentQuestion);
        this.setGameTime();
      }
    },
    startQuiz: function (){
      this.gameStarted = true;
      this.pollData.currentQuestion = 0;
      socket.emit("startPoll", this.pollId);
      this.runQuestion(this.pollData.currentQuestion);
      this.setGameTime();
    },
    copyText: function () {
      var copyText = document.getElementById("pollId").innerText;
      navigator.clipboard.writeText(copyText); //kod tagen från W3
      alert("Copied the text: " + copyText);
    },
    setGameTime: function (){
      if(this.timeLeft!==this.pollData.questions[this.pollData.currentQuestion].time){
        clearTimeout(this.timeOutID);
        this.timeLeft = this.pollData.questions[this.pollData.currentQuestion].time;
      }
    },
    loadQuiz: function (data){
      this.pollData = data;
      this.gameStarted = data.currentQuestion > -1;
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
  height: 100vh;
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
  height: 96%;
  width: 12rem;
}

.quiz-name{
  height:3rem;
  border:solid;
  border-radius: 8px;
  border-width: 1px;
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
}
.start-section{

}


</style>