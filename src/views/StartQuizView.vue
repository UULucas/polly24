<template>
  <head>
    <link rel="stylesheet" href="../assets/main.css">
  </head>

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
        <label class="quiz-key text-box">
          {{pollId}}
        </label>

      </div>

        <div class="share-key">
          <button class="share-key-button nav-button">
            Dela nyckel
          </button>
        </div>
    </div>

    <div class="participants-section">
      <h2>Deltagare</h2>

        <div class="participants"> <!--  Denna diven är till för att ha våra participants i så vi kan
                                          nog bara sätta en array här i med dom som går med spelet-->
          <div v-for="participant in pollData.participants" v-bind:key="player"  class="text-box" >
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

    <label class="text-box" style="font-size: 35px">Current question: {{questionNumber+1}}</label>
    <div class="start-section">
      <button class="start-button nav-button" @click="previousQuestion">Previous question</button>
      <button class="start-button nav-button" @click="nextQuestion">Next question</button>
      <button class="start-button nav-button" @click="startQuiz">
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
      questionNumber: 0,
      pollData: {},
      uiLabels: {},
      imageUrl: "",
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "pollData", data => this.pollData = data );
    socket.on( "participantsUpdate", p => this.pollData.participants = p );
    socket.emit( "getUILabels", this.lang );
    socket.emit("createPoll", {pollId: this.pollId})
    socket.emit( "joinPoll", this.pollId );

  },
  methods: {
    previousQuestion: function () {
      if(this.questionNumber>0){
        this.questionNumber--;
        socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber});
      }
    },
    nextQuestion: function () {
      this.questionNumber++;
      console.log(this.questionNumber);
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber});

    },
    startQuiz: function (){
      socket.emit("startPoll", this.pollId)
    },

  }
}
</script>
<style scoped>

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
  height:6rem;
  width: 38rem;
  font-size: 4rem;
}
.start-section{

}

</style>