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






  <body>
  <div id="quiz-container">
    <div id="header">

      <input
          class="quiz-name text-box"
          :value="text"
          type="text"
          placeholder="Quiz name"
          @input="event => text = event.target.value">


      <button class="start-quiz nav-button">
        Starta quiz
      </button>


    </div>

    <div class="image-area">
      <button class="action-button" @click="addImage" :style="getButtonStyle()">Lägg till bild</button>
    </div>


    <input
        class="question-area text-box"
        :value="text"
        type="text"
        placeholder="Question"
        @input="event => text = event.target.value">



    <div id="answer-container">

      <input
          class="answer text-box"
          :value="text"
          type="text"
          placeholder="Svar"
          @input="event => text = event.target.value">

      <button class="add nav-button">
        +
      </button>

    </div>
  </div>
  </body>

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
      imageUrl: "",
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
    },
    addImage(){
      const url = prompt("Ange bildens URL")
      if (url) {
        this.imageUrl = url;
      }
    },
    getButtonStyle (){
      return {
        backgroundImage: this.imageUrl ? `url('${this.imageUrl}')` : "none",
        backgroundSize: "cover",
        backgroundPositionRepeat: "no-repeat",
        backgroundPosition: "center",
        color: this.imageUrl ? "transparent" : "black"
      }
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
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 80%;
}

.quiz-name {
  flex: 1;
  display: flex;
}


.start-quiz {
  flex: 1;
  padding: 8px;
}

.image-area {
  width: 80%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;
  background-color: white;
}

.action-button {
  width: 100%;
  height: 100%;
  border: none;
  cursor: pointer;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: transparent;
}

.question-area {
  width: 80%;
  height: 3%;
}



#answer-container {
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 80%;
}

.answer{
  flex: 1;
  height: 100px;

}


.add {
  flex: 1; 
  height: 100px;
  display: flex;

}

body{
  background-color: var(--p-blue);
}
</style>