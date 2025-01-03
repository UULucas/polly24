<template>
  <div v-if="unstarted">

  </div>
  <div v-else class="round-time-bar">
            <div>
            </div>
        </div>
  <div class="pollQuestion">
    <QuestionComponent v-bind:question="question" 
              v-on:answer="submitAnswer($event)"/>
    <hr>
  </div>
  <div v-if="timerValue=0" > 
    {{ disableButtonsInChild() }}
  </div>

  <!--div class="pollAnswerWrapper">
=======
=======
>>>>>>> Stashed changes
  <div v-if="timerValue=0" > 
    {{ disableButtonsInChild() }}
  </div>
  <div class="pollAnswerWrapper">
>>>>>>> Stashed changes
    <div v-for="answer in question[1]">
    </div>
  </div!-->
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
    socket.on("timeUpdate", time => this.timerValue = time, this.setTimeLeft());
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
  },
  methods: {
    submitAnswer: function (answer) {
      console.log(answer)
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
    },
    disableButtonsInChild: function() {
				const childComponent = 
				this.$refs.QuestionComponent;
				if (childComponent) {
					childComponent.disableButtons(question.a);
				} else {
					console.error
					('Child component reference is undefined.');
				}
			},
      setTimeLeft: function () {
            document.documentElement.style.setProperty('--duration', this.timerValue);
            console.log(this.timerValue);
            this.unstarted = false;
            this.countDownTime();
      },
      countDownTime: function() {
        setTimeout(this.timerValue * 1000);
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
