<template>
  <head>
    <link rel="stylesheet" href="../assets/main.css">
  </head>

  <header>
    <button class="header-button nav-button" @click="$router.go(-1)">
      <a>
        <img class="home-img" src="https://static.thenounproject.com/png/2137554-200.png" alt="HomeImg"><!--Inga fucking läkar i våran kod!!!! !-->
      </a>
    </button>
    <img class="logo-img" src="../assets/logo_icon.png" alt="LogoImg"> <!--Inga fucking läkar i våran kod!!!! !-->
    <button class="start-quiz nav-button" @click="startQuiz">
        Starta quiz
    </button>
  </header>


  <body>
  <section id="quiz-container">

    <div  v-if="previewImage">
      <img id="imageAdded" :src="previewImage"  alt="altImg"/>
    </div>

    <div id="question-img-wrapper" class="nav-button">
      <input ref="fileInput" type="file" accept="image/*" @input="pickFile" id="question-img">
    </div>

    <input
        class="question-area text-box"
        v-model="questions[questionNumber].q"
        placeholder="Question">


    <div id="answer-container" style="overflow-wrap: break-word" >
      <div v-bind:style="{ backgroundColor: text.correct ? '#adf7b6' : '#ffc09f' }"
           class="answer text-box"
           v-for="(text, i) in questions[questionNumber].a"
           v-bind:key="'answer' + i">
        <input
            v-model="questions[questionNumber].a[i].text"
            class="text-box"
            type="text"
            placeholder="Svar"
            @input="questions[questionNumber].a[i]=text"
            style="background-color: transparent; border: none; box-shadow: none; outline: none;">
        <input
            type="checkbox"
            v-model="text.correct"
        />
      </div>
      <div class="answer" >
        <button v-if="questions[questionNumber].a.length>1" class="add nav-button" @click="removeAnswer">
          <label style="margin: auto">
            -
          </label>
        </button>
        <button v-if="questions[questionNumber].a.length<6" class="add nav-button" @click="addAnswer">
          <label style="margin: auto">
            +
          </label>
        </button>
      </div>
    </div>

    <label class="text-box" style="width: 100%; height: 3em; place-items: center"> Choose the correct answer(s)</label>
    <div class="correct-answer-container">
      <div v-for="answer in questions[questionNumber].a" v-bind:key="answer" class="text-box">
        <input
            v-if="answer.text.length>0"
            type="checkbox"
            v-model="answer.correct"/>
      </div>
    </div>
  </section>

  <section id="side-table-wrapper">

    <div style="display: flex;">
      <input
          class="text-box"
          v-model="quizName"
          placeholder="Quiz Name">
      <button class="text-box" id="save-button">
        <img src="../assets/save_icon.png" alt="test" style="width: 110%" @click="test">
      </button>

    </div>

    <div v-for="(question, i) in questions" class="" style="display: flex; gap:10px;" v-bind:key="question">
      <button class="nav-button" style="font-size: 35px; width: 80% " :style="{ backgroundColor: i===questionNumber ? '#ffee93' : '#fcf5c7' }" @click="questionNumber = i">
        <label style="overflow-wrap:break-word" >Q{{i+1}} {{question.q}}</label>
      </button>
      <button class="nav-button" @click="removeQuestion(i)" style="width: 5rem; background-color: var(--p-red)">
        <img src="../assets/trash_can.png" alt="test" style="height:70%">
      </button>
    </div>
    <button class="nav-button" style="font-size: 35px; margin-top: 1rem;" @click="addQuestion">
      <label>Add question</label>
    </button>
  </section>
  </body>
  <footer>

  </footer>

</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");


class Question {
  constructor(question, answers = [{text:"", correct:false}], img = null) {
    this.q = question;
    this.a = answers
    this.img = img
  }
  getAnswers(){
    let a = [];
    for(let i = 0; i < this.a.length; i++){
      a.push(this.a[i].text);
    }
    return a;
  }
}

export default {
  name: 'CreateView',
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      quizName: "",
      questionNumber: 0,
      pollData: {},
      uiLabels: {},
      imageUrl: "",
      previewImage: null,
      imgText: "Lägg till bild",
      questions: [new Question("")]
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "pollData", data => this.pollData = data );
    socket.on( "participantsUpdate", p => this.pollData.participants = p );
    socket.on( "newID", p => this.pollId = p ); //Save the new game id
    socket.emit( "getUILabels", this.lang );
    socket.emit("generateNewID");//Ask the server for a game id
  },
  methods: {
    startQuiz: function (){
      if(this.pollId !== null){
        this.createPoll();
        this.saveQuiz();
        this.$router.push({
          name: "StartQuizView",
          params: {
            id: this.pollId,
          },
        });
      }
    },
    saveQuiz: function () {
      for(let i = 0;i<this.questions.length;i++) {
        socket.emit("addQuestion", {pollId: this.pollId, data: this.questions[i]})
      }
    },
    createPoll: function () {
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang, quizName: this.quizName })
      socket.emit("joinPoll", this.pollId);
    },
    /**startPoll: function () {
      socket.emit("startPoll", this.pollId)
    },*/
    addQuestion: function () {
      this.questions.push(new Question(""));
      this.questionNumber = this.questions.length-1;
      //socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers } )
    },
    removeQuestion: function (i) {
      if(i===this.questionNumber){
        this.questionNumber = 0;
      }
      this.questions.splice(i, 1);
      if(this.questions.length===0){
        this.addQuestion();
      }
      if(this.questionNumber>this.questions.length-1){
        this.questionNumber--;
      }
    },
    removeAnswer: function (){
      this.questions[this.questionNumber].a.pop();
    },
    addAnswer: function () {
      this.questions[this.questionNumber].a.push({text:"", correct: false});
      console.log(this.questions);
    },
    /**runQuestion: function () {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
    },*/
    pickFile () {
      let input = this.$refs.fileInput
      let file = input.files
      if (file && file[0]) {
        let reader = new FileReader
        reader.onload = e => {
          this.previewImage = e.target.result
          console.log(e.target.result)
        }
        reader.readAsDataURL(file[0])
        this.$emit('input', file[0])

      }
    },
    test: function (){
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
  width: 60%;
  height: 100vh;
  gap: 16px;
  margin: auto;
}

.correct-answer-container{
  display: flex;
  flex-direction: row;


}
.start-quiz {
  margin: 1rem 3rem;
  background-color: var(--p-green);
}

.question-area {
  width: calc(100% - 3px);
  height: 2em;
}

#answer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  width: 100%;
}

.answer{
  gap: 1rem;
  display: flex;
  flex: 1;
  min-height: 100px;
  min-width: calc(50% - 16px);
  max-width: 50%;

}

.add {
  flex: 1;
  display: flex;
  min-width: calc(50% - 16px);
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

footer{
  height: 100px;
}

header {
  height: 7em;
  background-color: var(--p-beige);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
  margin-bottom: 2em;
}

.header-button {
  position: absolute;
  left: 16px;
  top: 8px;
  outline: solid black 1px;
}

.home-img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  height: 50px;
  width: 50px;
}

.logo-img {
  height: 70px;
  margin: 0 auto;
  margin-top: 16px;
  padding-bottom: 1rem;
  padding-left: 20%;
}

body{
  display: flex;
}

#side-table-wrapper{
  width: 30%;
  height: 40rem;
  margin-right:1rem;
  border-radius: 1rem;
  padding: 1rem;
  font-size: 1rem;
  border: solid black 1px;
  background-color: var(--p-offWhite);
  overflow-y: scroll;
}

#side-table-wrapper input{
  width: 80%;
  height: 2em;
  margin-bottom: 1em;
  font-size: 20px;
}

#save-button{
  height: calc(3rem - 4px);
  width:3rem;
  margin-left:1rem;
}

#save-button:hover{
  background-color: var(--p-blue);
}


</style>