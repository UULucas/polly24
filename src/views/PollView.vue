<template>
  <div v-if="!answered" class="round-time-bar" id="timer-bar">
            <div>
            </div>

  </div>
  <body style="display: grid; margin-top: 1rem">
    <label style="font-size: 50px; color:red">{{timeLeft}}</label>
    {{question.questionTime}}
    <div class="pollQuestion">
      <QuestionComponent v-bind:question="question"
                         v-bind:timeLeft="timeLeft"
                         v-on:answer="submitAnswer($event)"/>
      <hr>
    </div>
  </body>
</template>

<script>
// @ is an alias to /src
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

      timeLeft: 0,
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    socket.on( "questionUpdate", q => this.loadQuestion(q))
    socket.on( "submittedAnswersUpdate", answers => this.submittedAnswers = answers );
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
  },
  watch: {
    timeLeft: {
      handler(){
        if(this.timeLeft>0){
          this.timeOutID=setTimeout(() => {
            this.timeLeft--;
          }, 1000);
        }
      },
      immediate: true,
    }
  },
  methods: {
    loadQuestion: function (data){
      console.log("loaded question")
      this.question = data;
      this.startTimer();
      this.resetAnimation();
    },
    submitAnswer: function (answer) {
      console.log(answer)
      //läg till poäng och sånt skit
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
      this.answered = true;
    },
    setTimeLeft: function () {
      document.documentElement.style.setProperty('--duration', this.timeLeft);
      console.log(this.question.timeRemaining);
    },
    resetAnimation: function () {
      this.setTimeLeft();
      let element = document.getElementById('timer-bar');
      element.style.animation = 'none';
      element.offsetHeight; /* trigger reflow */
      element.style.animation = null;
    },
    countDownTime: function() {
      setTimeout(this.setZero, this.question.timerValue * 1000)
    },
    setZero: function() {
      this.question.time = 0;
      console.log("out of time")
    },
    startTimer: function (){
      clearTimeout(this.timeOutID);
      this.timeLeft = this.question.timeRemaining;
    }
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
