<template>
  <div class="round-time-bar" id="timer-bar">
            <div>
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
import {sockets} from "../../server/sockets";

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
    socket.on("timeUpdated", t => this.timeLeft = t);
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );

    socket.on('timeUpdated', t => console.log("test time:",t))
  },
  watch: {
    answerTime: {
      handler: function () {
        if(!this.answered){
          this.timeOutID=setTimeout(() => {
            this.answerTime++;
          }, 1000);
        }
      }
    }
  },
  methods: {
    loadQuestion: function (data){
      console.log("loaded question")
      this.question = data;
      this.questionComponent.methods.resetButtons(this.question.a);
      this.answered = false;
      this.startTimer();
      this.resetAnimation();
      //Om tiden är slut när man laddar sidan
      if(this.question.timeRemaining<=0){
        this.answered = true;
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
        console.log("time to answer: "+this.answerTime);
        const score = -1*maxScore*((this.answerTime-this.question.questionTime) / this.question.questionTime);
        return score||0;
      }
      return 0;
    },
    setTimeLeft: function () {
      document.documentElement.style.setProperty('--duration', (this.question.timeRemaining));
    },
    resetAnimation: function () {
      this.setTimeLeft();
      let element = document.getElementById('timer-bar');
      element.style.animation = 'none';
      element.offsetHeight; /* trigger reflow */
      element.style.animation = null;
    },
    startTimer: function (){
      this.countDownTime();
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
      console.log("out of time")
    },
}
}
</script>
<style>
#timer-bar {
  margin: auto;
  height: 10px;
  background: linear-gradient(to bottom, red, #900);
  animation: roundtime calc(var(--duration) * 1s) linear forwards;
  transform-origin: center;
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
