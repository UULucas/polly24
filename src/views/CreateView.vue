<template>
  <head>
    <link rel="stylesheet" href="../assets/main.css">
  </head>

  <header>
    <div class="header">
      <router-link to="/" class= "nav-button">
        <a>
          <img class="home-img" src="../assets/home_icon.png" alt="HomeImg">
        </a>
      </router-link>
      <button class=" nav-button" v-on:click="switchLanguage">
        <img :src="uiLabels.changeLanguage" alt="" class="lang-img">
      </button>

    <button class="start-quiz nav-button" @click="startQuiz">
        Starta quiz
    </button>
    </div>
  </header>


  <body>
  <section id="quiz-container">

    <div  v-if="this.questions[this.questionNumber].img">
      <img id="imageAdded" :src="this.questions[this.questionNumber].img"  alt="altImg"/>
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
    <form action= "" class="text-box">
      <p>
        <label for="Time">Choose time of the question (seconds)</label>
        <select id="Time" v-model="questions[questionNumber].time">
          <option selected="selected">30</option>
          <option>20</option>
          <option>15</option>
          <option>10</option>
        </select>
      </p>
      <!--button v-on:click="setGameTime(setTime);" type="submit">
        <label> Start timer </label>
      </button!-->
      <br>
    </form>

    <!--label class="text-box" style="width: 100%; height: 3em; place-items: center"> Choose the correct answer(s)</label>
    <div class="correct-answer-container">
      <div v-for="answer in questions[questionNumber].a" v-bind:key="answer" class="text-box">
        <input
            v-if="answer.text.length>0"
            type="checkbox"
            v-model="answer.correct"/>
      </div>
    </div!-->
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
import imageCompression from 'browser-image-compression';
const socket = io("localhost:3000");


class Question {
  constructor(question, answers = [{text:"", correct:false}], img = null, time = 20) {
    this.q = question;
    this.a = answers;
    this.img = img;
    this.time = time;
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
      imgText: "Lägg till bild",
      questions: [new Question("")],
      previewImage: null,
      compressedImage: null,
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
    async pickFile() {
      const input = this.$refs.fileInput;
      const file = input.files[0];
      // Maximal filstorlek i Socket.IO är 1MB, vi sätter en gräns under det på 500kB
      const maxFileSize = 0.5 * 1024 * 1024;

      if (file && file.size > maxFileSize) {
        alert("The selected file is too large. Please choose a file smaller than 500 kB.");
        input.value = "";
        return;
      }

      if (file) {
        const options = {
          maxSizeMB: 0.0007,
          maxWidthOrHeight: 1200,
          useWebWorker: true,    // Ökar prestandan
        };
        const compressedFile = await imageCompression(file, options);

        const reader = new FileReader();
        reader.onload = (e) => {
          // Sätter Base64 resultatet questions listan
          this.questions[this.questionNumber].img = e.target.result;

          // Låter oss previewa bilden
          this.previewImage = e.target.result;

          // Debug-utskrifter om behövs
          console.log("Image added to question:", this.questions[this.questionNumber].img);
        };
        reader.readAsDataURL(compressedFile);
      }
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
  margin-left: 62%;
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

.header {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 1rem;
  gap: 1rem ;
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