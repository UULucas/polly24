<template>
  <head>
    <link rel="stylesheet" href="../assets/main.css">
  </head>

  <div class="quiz-container">
    Poll link: 
    <input type="text" v-model="pollId">

    <button v-on:click="createPoll">
      Create poll
    </button>

    <div>
      <div>
      {{ uiLabels.question }}:
      <input type="text" v-model="question">
      </div>

      <div>
        Answers:
        <input v-for="(_, i) in answers" 
               v-model="answers[i]" 
               v-bind:key="'answer' + i">
        <button v-on:click="addAnswer">
          Add answer alternative
        </button>
      </div>

    </div>
    <button v-on:click="addQuestion">
      Add question
    </button>
    <input type="number" v-model="questionNumber">

    <button v-on:click="startPoll">
      Start poll
    </button>

    <button v-on:click="runQuestion">
      Run question
    </button>
    <router-link v-bind:to="'/result/' + pollId">Check result</router-link>
    Data: {{ pollData }}
  </div>


  <div id="quiz-container">
    <div id="header">

      <div class="quiz-name">
        Quiz namn
      </div>

      <div class="start-quiz">
        Starta quiz
      </div>

    </div>

    <div class="image-area">
      Lägg till bild
    </div>

    <div class="question-area">
      Lägg till fråga
    </div>

    <div id="answer-container">

      <div class="answer">
        SVAR
      </div>

      <div class="add">
        +
      </div>

    </div>
  </div>


</template>

<script>
import io from 'socket.io-client';
import CreateQuizSection from "@/components/CreateQuizSection.vue";
const socket = io("localhost:3000");

export default {
  name: 'CreateView',
  components: {CreateQuizSection},
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      pollData: {},
      uiLabels: {},
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "pollData", data => this.pollData = data );
    socket.on( "participantsUpdate", p => this.pollData.participants = p );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    createPoll: function () {
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
      socket.emit("joinPoll", this.pollId);
    },
    startPoll: function () {
      socket.emit("startPoll", this.pollId)
    },
    addQuestion: function () {
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers } )
    },
    addAnswer: function () {
      this.answers.push("");
    },
    runQuestion: function () {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
    }
  }
}
</script>
<style scoped>
#quiz-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100vh;
  gap: 16px;
}

#header {
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 80%;
}

.quiz-name,
.start-quiz {
  flex: 1;
  text-align: center;
  border: 1px solid #000;
  padding: 8px;
  background-color: #f5f5f5;
}

.image-area {
  width: 80%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;
  background-color: #f5f5f5;
}

.question-area {
  width: 80%;
  height: 3%;
  display: flex;
  text-align: center;
  justify-content: center;
  border: 1px solid #000;
  background-color: #f5f5f5;
}

#answer-container {
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 80%;
}

.answer,
.add {
  flex: 1;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;
  background-color: #f5f5f5;
}
</style>