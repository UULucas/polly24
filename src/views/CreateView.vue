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
      {{ uiLabels.startQuizButton }}
    </button>
    </div>
  </header>


  <body>
  <section id="quiz-container">

    <div  v-if="this.questions[this.questionNumber].img">
      <img id="imageAdded" :src="this.questions[this.questionNumber].img"  alt="altImg"/>
    </div>

    <div id="question-img-wrapper" class="img-button-div">
      <input ref="fileInput" type="file" accept="image/*" @input="pickFile" id="question-img" style="display: none;">
      <button @click="$refs.fileInput.click()" class="upload-button">
        {{ uiLabels.uploadImage }}
      </button>
      <div v-if="questions[questionNumber].fileName" class="file-name-display">
        <div class="question-filename">
        <p>{{ questions[questionNumber].fileName }}</p>
        </div>
      </div>
    </div>

    <input
        class="question-area text-box"
        maxlength="140"
        v-model="questions[questionNumber].q"
        :placeholder="uiLabels.questionPlaceholder">


    <div id="answer-container" style="overflow-wrap: break-word" >
      <div v-bind:style="{ backgroundColor: text.correct ? '#adf7b6' : '#fcf5c7' }"
           class="answer text-box"
           v-for="(text, i) in questions[questionNumber].a"
           v-bind:key="'answer' + i">
        <input
            v-model="questions[questionNumber].a[i].text"
            class="text-box answer-box"
            type="text"
            :placeholder="uiLabels.answerPlaceholder"
            maxlength="45"
            @input="questions[questionNumber].a[i]=text"
            style="background-color: transparent; border: none; box-shadow: none; outline: none;">

        <div class="checkbox-container">

          <input
                id="'checkbox-correct-' + i"
                type="checkbox"
                v-model="text.correct"
          />
          <label :for="'checkbox-correct-' + i">&nbsp; </label>

        </div>

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
        <label class="choose-time-label" for="Time">{{ uiLabels.chooseQuestionTime }}</label>
        <select class="time-selector" id="Time" v-model="questions[questionNumber].questionTime">

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
          :placeholder="uiLabels.quizName"
          maxlength="23">
      <button class="text-box" id="save-button">
        <img src="../assets/save_icon.png" alt="test" style="width: 110%" @click="test">
      </button>

    </div>

    <div v-for="(question, i) in questions" class="" style="display: flex; gap:10px;" v-bind:key="question">
      <button class="nav-button" style="font-size: 35px; width: 80% " :style="{ backgroundColor: i===questionNumber ? '#ffee93' : '#fcf5c7' }" @click="questionNumber = i">
        <textarea disabled class="text-area-question" :value="`Q${i + 1}: ${question.q}`"></textarea>
      </button>
      <button class="nav-button" @click="removeQuestion(i)" style="width: 5rem; background-color: var(--p-red)">
        <img src="../assets/trash_can.png" alt="test" style="height:70%">
      </button>
    </div>
    <button class="nav-button" style="font-size: 35px; margin-top: 1rem;" @click="addQuestion">
      <label>{{ uiLabels.addQuestionQuiz }}</label>
    </button>
  </section>
  </body>
</template>

<script>
import io from 'socket.io-client';
import imageCompression from 'browser-image-compression';
const socket = io("localhost:3000");


class Question {
  constructor(question, answers = [{text:"", correct:false}], img = null, time = 20, fileName = "") {
    this.q = question;
    this.a = answers;
    this.img = img;
    this.questionTime = time;
    this.timeRemaining = time;
    // nytest
    this.fileName = fileName;
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
      quizName: "Untitled quiz",
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
      const input = this.$refs.fileInput;
      input.value = "";
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
        alert(this.uiLabels.fileTooBigAlert);
        input.value = "";
        return;
      }

      if (file) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          useWebWorker: true,    // Ökar prestandan
        };
        const compressedFile = await imageCompression(file, options);

        const reader = new FileReader();
        reader.onload = (e) => {
          // Sätter Base64 resultatet questions listan
          this.questions[this.questionNumber].img = e.target.result;
          this.questions[this.questionNumber].fileName = file.name;
          // Låter oss previewa bilden
          this.previewImage = e.target.result;
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
  height: 80vh;
  gap: 16px;
  margin: auto;
  margin-top: 1rem;
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



.answer-box{
  display: flex;
  width: 70%;
}

.checkbox-container{
  display:flex;
  align-items: center;
}

.text-area-question{
  border: none;
  background-color: transparent;
  width: 100%;
  height: 100%;
  resize: none;
  font-family: "Inter",sans-serif;
  cursor: pointer;
  color: black;
  pointer-events: none;
  text-align: center;
  vertical-align: middle;
}



[type="checkbox"]{
  position: relative;
 opacity: 0;
  transform:scale(3);
  z-index: 2;
  left: 1.6rem;
  cursor:pointer;
}

[type="checkbox"] + label{
  position: relative;
  padding-left: 1rem;
  
  display: inline-block;
  color:#666;
  line-height: 2rem;
  z-index: 1;
}

[type="checkbox"] + label::before{
  content:"";
  position: absolute;
  left:0;
  top:0;
  width: 2rem;
  height: 2rem;
  outline: 2px solid #aaa;
  background: var(--p-offWhite);
  background-size: contain;
  background-size:108%;
  border-radius: 8px;
  z-index: 1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

}

[type="checkbox"]:checked + label::before{
  content:"";
  position: absolute;
  left:0;
  top:0;
  width: 2rem;
  height: 2rem;
  outline: 3px solid #008000;
  background: var(--p-offWhite);
  border-radius: 8px;
  z-index: 1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

}
[type="checkbox"]:checked + label::after{
  content:"";
  position: absolute;
  left:0;
  top:0;
  width: 2rem;
  height: 2rem;
  outline: 3px solid #008000;
  background-image: url("../assets/pngegg.png");
  background-size: contain;
  border-radius: 8px;
  z-index: 1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

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
.header {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 1rem;
  gap: 1rem ;
  height: 5rem;
  margin-top: 1rem;
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
  overflow-y: scroll;
}


#side-table-wrapper{
  width: 30%;
  height: 75vh;
  margin-right:1rem;
  border-radius: 1rem;
  padding: 1rem;
  font-size: 1rem;
  background-color: var(--p-offWhite);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
  position: sticky;
  top:16px;
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

.file-name-display {
  font-size: 14px;
  color: #555;
}

.upload-button {
  background-color: var(--p-blue);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
}

.question-filename {
  margin-left: 1rem;
  font-size: 16px;
}

.img-button-div {
  text-align: center;
  padding: 20px;
  background-color: var(--p-beige);
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 50px;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.time-selector {
  margin-left: 1rem;
  margin-right: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 0.5em 1.2em;
  font-size: 1.3rem;
  background: var(--p-beige);
  border-radius: 8px;
}
.time-selector:hover {
  background: var(--p-yellow);
}




.choose-time-label {
  margin-left: 1rem;

}
</style>