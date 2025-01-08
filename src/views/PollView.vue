<template>
  <div class="round-time-bar" id="timer-bar-container">
            <div id="timer-bar">
            </div>

  </div>
  <body style="display: grid; margin-top: 1rem">
    <ResultComponent v-if="displayResultScreen" v-bind:question="question"></ResultComponent>

    <div v-else class="pollQuestion">
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
import ResultComponent from "@/components/ResultComponent.vue";
import io from 'socket.io-client';

const socket = io("localhost:3000");

export default {
  name: 'PollView',
  components: {
    QuestionComponent,
    ResultComponent,
  },
  data: function () {
    return {
      question: {
        q: "",
        a: [],
        img : null
      },
      pollId: "inactive poll",
      //submittedAnswers: {},
      unstarted: false,
      answered : false,
      playerId: "",

      timeLeft: 0,
      answerTime:-1,
      questionComponent: ref(QuestionComponent),
      displayResultScreen: false,
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.playerId = this.$route.params.playerId;
    socket.on( "questionUpdate", q => this.loadQuestion(q));
    //socket.on( "submittedAnswersUpdate", answers => this.submittedAnswers = answers );'
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on("timeUpdated", t => this.updateTimeLeft(t));
    socket.on("toLobby", t => this.toLobby(t));
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
  },
  methods: {
    toLobby () {
      this.$router.push({
        name: "LobbyView",
        params: {
          id: this.pollId,
          playerId: this.playerId,
        },
      });
    },
    loadQuestion: function (data){
      console.log("loaded question")
      this.question = data;
      this.questionComponent.methods.resetButtons(this.question.a);
      this.answered = false;
      this.displayResultScreen = false;
    },
    updateTimeLeft: function(timeLeft){
      this.timeLeft = timeLeft;
      this.updateAnimation();
      if(timeLeft <= 0){
        this.answered = true; //Gör så att man inte kan svara
        this.questionComponent.methods.disableButtons(this.question.a); //Stänger av knapparna
        this.displayResultScreen = true; //Visa resultatet
        console.log("out of time")
      }
    },
    submitAnswer: function (answer) {
      if(!this.answered){
        console.log(this.playerId)
        console.log("testtest")
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
      let time = this.timeLeft;
      if(time !== this.question.questionTime){ //För att den ska gå hela vägen ut till kanten och även in i mitten
        time--;
      }
      if(this.timeLeft>0) {
        const percentageWidth = ((time) / (this.question.questionTime)) * 100; //Räkna ut bärden
        element.style.width = `${percentageWidth}%`;
      }
      else{
        element.style.width = `0%`;
      }
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

  transition: width 1s linear; /* Mjuk animation vid varje steg */;
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
