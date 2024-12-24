<template>
        <form action= "" onsubmit="event.preventDefault();" v-if="unstarted">
                <p>
                    <label for="Time">Choose time (seconds)  </label>
                    <select id="Time" v-model="timerValue">
                        <option selected="selected">30</option>
                        <option>20</option>
                        <option>15</option> 
                        <option>10</option>
                    </select>
                </p>
                <button v-on:click="setTimeLeft(); unstarted = !unstarted" type="submit">
                    <label> Start timer </label>
                    </button>
        </form>
        <div v-else class="round-time-bar">
            <div>
            </div>
        </div>
            
                
    <div class="pollQuestion">
      <QuestionComponent v-bind:question="question"/>
      <hr>
    </div>
    <div class="pollAnswerWrapper">
      <div>
        {{ submittedAnswers }}
      </div>
    </div>

  </template>
  
  <script>
  // @ is an alias to /src
  import QuestionComponent from '@/components/QuestionComponent.vue';
  import io from 'socket.io-client';
  const socket = io("localhost:3000");



  
  export default {
    name: 'PollHostView',
    components: {
      QuestionComponent
    },
    data: function () {
      return {
        question: {
          q: "",
          a: []
        },
        pollId: "inactive poll",
        submittedAnswers: {},
        timerValue : "",
        unstarted: true

      }
    },
    created: function () {
      this.pollId = this.$route.params.id;
      socket.on( "questionUpdate", q => this.question = q );
      socket.on( "submittedAnswersUpdate", answers => this.submittedAnswers = answers );
      socket.on( "uiLabels", labels => this.uiLabels = labels );
      socket.emit( "getUILabels", this.lang );
      socket.emit( "joinPoll", this.pollId );
    },
    methods: {
        submitAnswer: function (answer) {
            socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
        },
        setTimeLeft: function () {
            document.documentElement.style.setProperty('--duration', this.timerValue);
            console.log(this.timerValue)
            socket.emit("timeLeft", {pollId: this.pollId, time: this.timerValue})
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