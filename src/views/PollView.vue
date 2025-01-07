<template>
  <div class="round-time-bar" id="timer-bar-container">
            <div id="timer-bar">
            </div>

  </div>
  <body style="display: grid; margin-top: 1rem">
    <!--label style="font-size: 50px; color:red">{{timeLeft}}</label!-->
    <div class="pollQuestion">
      <QuestionComponent ref="questionComponent"
                         v-bind:question="question"
                         v-bind:timeLeft="timeLeft"
                         v-on:answer="submitAnswer($event)"/>
      <hr>
    </div>
  </body>
</template>

<script>
// @ is an alias to /src
import { ref } from 'vue';
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';

const socket = io("localhost:3000");

export default {
  name: 'PollView',
  components: {
    QuestionComponent
  },
  data: function () {
    return {
      question: {
        q: "",
        a: [],
        img : null
      },
      pollId: "inactive poll",
      submittedAnswers: {},
      unstarted: false,
      answered : false,
      playerId: "",

      timeLeft: 0,
      answerTime:-1,
      questionComponent: ref(QuestionComponent),
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.playerId = this.$route.params.playerId;
    socket.on( "questionUpdate", q => this.loadQuestion(q))
    socket.on( "submittedAnswersUpdate", answers => this.submittedAnswers = answers );
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on("timeUpdated", t => this.updateTimeLeft(t));
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );

    //socket.on('timeUpdated', t => console.log("test time:",t))
  },
  /**watch: {
    answerTime: {
      handler: function () {
        if(!this.answered){
          this.timeOutID=setTimeout(() => {
            this.answerTime++;
          }, 1000);
        }
      }
    }
  },*/
  methods: {
    loadQuestion: function (data){
      console.log("loaded question")
      this.question = data;
      this.questionComponent.methods.resetButtons(this.question.a);
      this.answered = false;

      //Om tiden är slut när man laddar sidan
      /*if(this.question.timeRemaining<=0){
        this.answered = true;
      }*/
    },
    updateTimeLeft: function(timeLeft){
      console.log("updateTimeLeft");
      this.timeLeft = timeLeft;
      this.updateAnimation();
      if(timeLeft <= 0){
        this.answered = true; //Gör så att man inte kan svara
        this.questionComponent.methods.disableButtons(this.question.a); //Stänger av knapparna
        console.log("out of time")
      }
    },
    submitAnswer: function (answer) {
      if(!this.answered){
        console.log(this.playerId)
        console.log("testtest")
        //läg till poäng och sånt skit
        const score = this.calculateScore(answer);
        console.log("answer sent: "+answer.correct+" score: "+score);
        socket.emit("submitPlayerAnswer", {pollId: this.pollId, playerId: this.playerId, answer: answer.text, score:score})
        this.answered = true;
      }
    },
    calculateScore: function (answer) {
      if(answer.correct){
        const maxScore = 1000;
        console.log("time to answer: "+this.timeLeft);
        const score = maxScore*(this.timeLeft / this.question.questionTime);
        return score||0;
      }
      return 0;
    },
    updateAnimation: function () {
      let element = document.getElementById("timer-bar");
      if(this.timeLeft>0) {
        const percentageWidth = (this.timeLeft / this.question.questionTime) * 100; //Räkna ut bärden
        element.style.width = `${percentageWidth}%`;
      }
      else{
        element.style.width = `0%`;
      }
    },

    resetAnimation: function () {
      console.log("animation time: ",this.timeLeft)
      document.documentElement.style.setProperty('--duration', (this.timeLeft)); //Återställ tiden på animationen
      let element = document.getElementById('timer-bar');
      element.style.animation = 'none';
      element.offsetHeight; //Starta om den
      element.style.animation = null;
    },
    startTimer: function (){
      //this.countDownTime();
      clearTimeout(this.timeOutID);
      this.timeLeft = this.question.timeRemaining;
      this.answerTime = this.question.questionTime-this.question.timeRemaining;
    },
    countDownTime: function() {
      setTimeout(this.setZero, this.question.timeRemaining * 1000)
    },
    setZero: function() {
      this.timeLeft = 0;
      this.answered = true;
      this.questionComponent.methods.disableButtons(this.question.a);
      console.log("out of time");
    },
}
}
</script>
<style>
#timer-bar {
  margin: auto;
  height: 10px;
  background: linear-gradient(to bottom, red, #900);
  /*animation: roundtime calc(var(--duration) * 1s) linear forwards;*/
  transform-origin: center;

  transition: width 0.2s ease; /* Mjuk animation vid varje steg */;
}
#timer-bar-container{
  width: 100%;
  height: 10px;
  position: relative;
  overflow: hidden;
}
@keyframes roundtime {
  to {
    transform: scaleX(0);
  }
}

.pollQuestion {
  display: inline-block;
  justify-content: center;
  align-items: center;
}
</style>
