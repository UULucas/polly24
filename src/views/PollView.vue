<template>
  <div v-if="!answered" class="round-time-bar" id="timer-bar">
            <div>
            </div>

  </div>
  <body style="display: grid; margin-top: 1rem">
    <label style="font-size: 50px; color:red">{{timeLeft}}</label>
    <div class="pollQuestion">
      <QuestionComponent v-bind:question="question"
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
        time : 15,
        img : null
      },
      pollId: "inactive poll",
      submittedAnswers: {},
      unstarted: false,
      answered : false,


      timeLeft: 0,
      timeOutID: null,
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    socket.on( "questionUpdate", q => this.loadQuestion(q));//this.question = q, this.reset(), this.startTimer());
    socket.on( "submittedAnswersUpdate", answers => this.submittedAnswers = answers );
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    //socket.on("timeUpdate", time => this.question.timerValue = time, this.setTimeLeft());
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
    //this.countDownTime();
  },
  watch: {
    timeLeft: {
      handler(time){
        if(time>0){
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
      this.question = data;
      this.startTimer(data.time)
      console.log("time on timer: "+this.question.time)
      this.reset();
    },
    submitAnswer: function (answer) {
      console.log(answer)
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
      this.answered = true;
    },
    setTimeLeft: function () {
          document.documentElement.style.setProperty('--duration', this.question.time);
          console.log(this.question.time);
    },
    reset: function () {
      //this.question.timerValue = 15;
      this.setTimeLeft();
      //this.countDownTime();
      let element = document.getElementById('timer-bar');
      element.style.animation = 'none';
      element.offsetHeight; /* trigger reflow */
      element.style.animation = null;
      //document.body.append(element);
    },
    countDownTime: function() {
      setTimeout(this.setZero, this.question.timerValue * 1000)
    },
    setZero: function() {
      this.question.timerValue = 0;
      console.log("out of time")
    },
    startTimer: function (timer = this.question.time){
      if(this.timeLeft!==timer){
        clearTimeout(this.timeOutID);
        this.timeLeft = timer;
      }
    }
}
}
</script>
<style>
#timer-bar {
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
