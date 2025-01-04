<template>
  <div v-if="!answered" class="round-time-bar">
            <div>
            </div>
        </div>
  <div class="pollQuestion">
    <QuestionComponent v-bind:question="question" 
              v-on:answer="submitAnswer($event)"/>
    <hr>
  </div>
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
        timerValue : 15,
        img : null
      },
      pollId: "inactive poll",
      submittedAnswers: {},
      unstarted: false,
      answered : false
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    socket.on( "questionUpdate", q => this.question = q, this.reset() );
    socket.on( "submittedAnswersUpdate", answers => this.submittedAnswers = answers );
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on("timeUpdate", time => this.question.timerValue = time, this.setTimeLeft());
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
    this.countDownTime();
  },
  methods: {
    submitAnswer: function (answer) {
      console.log(answer)
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
      this.answered = true;
    },
    setTimeLeft: function () {
          document.documentElement.style.setProperty('--duration', this.question.timerValue);
          console.log(this.question.timerValue);
    },
    reset: function () {
      this.question.timerValue = 15;
      this.setTimeLeft();
      this.countDownTime();
      let element = document.getElementById('round-time-bar div');
      document.body.append(element);
    },
    countDownTime: function() {
      setTimeout(this.setZero, this.question.timerValue * 1000)
    },
    setZero: function() {
      this.question.timerValue = 0;
      console.log("out of time")
    }
}
}
</script>
<style>
.round-time-bar div {
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
</style>
