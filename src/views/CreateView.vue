<template>
  <head>
    <link rel="stylesheet" href="../assets/main.css">
  </head>

  <!--div class="quiz-container">
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
  </div!-->






  <body>

  <section id="quiz-container">
    <div id="header">

      <input
          class="quiz-name text-box"
          placeholder="Quiz name"
          v-model="quizName">


      <button class="start-quiz nav-button">

        <router-link to="/startquiz/" class ="link-wrapper">
         Starta quiz
        </router-link>
      </button>


    </div>

    <div  v-if="previewImage">
      <img id="imageAdded" :src="previewImage"  alt="altImg"/>
    </div>

    <div id="question-img-wrapper" class="nav-button">
      <input ref="fileInput" type="file" accept="image/*" @input="pickFile" id="question-img">
    </div>

    <input
        class="question-area text-box"
        v-model="question"
        placeholder="Question">



    <div id="answer-container">

      <input
          v-for="(_, i) in answers"
          v-model="answers[i]"
          v-bind:key="'answer' + i"
          class="answer text-box"
          type="text"
          placeholder="Svar">

      <button class="add nav-button" @click="addAnswer">
        +
      </button>

    </div>
  </section>
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
      quizName: "",
      question: "",
      answers: [""],
      questionNumber: 0,
      pollData: {},
      uiLabels: {},
      imageUrl: "",
      previewImage: null,
      imgText: "Lägg till bild",
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
    pickFile () {
      let input = this.$refs.fileInput
      let file = input.files
      if (file && file[0]) {
        let reader = new FileReader
        reader.onload = e => {
          this.previewImage = e.target.result
        }
        reader.readAsDataURL(file[0])
        this.$emit('input', file[0])
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
  width: 80%;
  height: 100vh;
  gap: 16px;
  margin: auto;
}

#header {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 100%;
}

.quiz-name {
  flex: 1;
  display: flex;
}


.start-quiz {
  flex: 1;
  padding: 8px;
}

.question-area {
  width: calc(100% - 3px);
  height: 2em;
}

#answer-container {
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 100%;
}

.answer{
  flex: 1;
  height: 100px;

}

.add {
  flex: 1;
  display: flex;

}

body{
  background-color: var(--p-blue);
}


input::file-selector-button {
  font-weight: bold;
  padding: 0.5em;
  border: thin solid grey;
  border-radius: 3px;

}

#question-img-wrapper{
  display: flex;
  text-align: center;
  width: 100%;
  padding: 1rem 0;
  align-items: center;
  justify-content: center;
}

#question-img{
  font-size: 20px;
  margin: auto;
}


#imageAdded{
  height: 500px;
}

</style>