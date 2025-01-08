<template>
  <div id="qResultScreen" v-if="showQResultScreen">
    <div class="resultWrapper">
      <h2>The correct answer was:</h2>
      <div v-for="answer in question.a.filter(item => item.correct)" v-bind:key="answer">
        {{answer.text}}
      </div>
      <br>
      <h3>Here is what everyone answered: </h3>
      <BarsComponent v-bind:labels="question.a" v-bind:data="submittedAnswers"/>

    </div>

  </div>

  <div id="leaderboardScreen" v-if="!showQResultScreen">
    <div class="resultWrapper">
      <h2>Current Leaderboard</h2>

      <div class="container">
      <div class="name-box nav-label">name</div>
      <div class="score-box nav-label">score</div>
      </div>

      <div class="participant-list">
        <div v-for="participant in participants" :key="participant" class="text-box-participant">
          <div class="participants-name">{{participant.name}}</div>
          <div class="participants-score">{{ participant.score }}</div>
          <img :src="participant.avatar"
               style="
                  height: 4rem;
                  width: 4rem;
                  padding: 0.25rem"
               alt="miniavatar"
               class="mini-avatar">
        </div>
    </div>
  </div>
  </div>

  <div v-if="powerUp">
    <div class="powerUpWrapper">
      <h2>You have received a PowerUp!</h2>
      <p>Choose one:</p>
      <div id="powerupButtonWrapper">
        <button class="nav-button" @click="selfPowerUp">Powerup yourself</button>
        <button class="nav-button" @click="oneDowngrade">Fuck the leader/one person</button>
        <button class="nav-button" @click="manyDowngrade">Fuck everyone</button>
      </div>
    </div>

  </div>

  <div v-if="nextQuestionNormal">
    <div class="resultWrapper">
      <h2>Next question starts in:</h2>
      <p>{{ countdown }}</p>
    </div>
  </div>

  <div v-if="nextQuestionCursed">
    <div class="resultWrapper">
      <h2>userName has given you have downgrade:</h2>
      <p>downgradeName</p>
      <p>Description of downgradeName</p>
      <h2>Next question starts in: </h2>
      <p>{{ countdown }}</p>
    </div>

  </div>


  <span v-for="participant in participant" v-bind:key="participant">{{participant.name}}</span>
</template>

<script>
// @ is an alias to /src
import BarsComponent from '@/components/BarsComponent.vue';
import io from 'socket.io-client';

const socket = io("localhost:3000");

export default {
  name: 'ResultComponent',
  components: {
    BarsComponent
  },
  props: {
    question: Object,
  },
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      //question: "",
      submittedAnswers: {},
      participants: [],
      showQResultScreen: true,
      uiLabels: {},
      nextQuestionNormal: false,
      nextQuestionCursed: false,
      countdown: 5,
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    socket.on("uiLabels", labels => this.uiLabels = labels);
    socket.on("submittedAnswersUpdate", update => this.submittedAnswers = update);
    //socket.on("questionUpdate", update => this.question = update);
    socket.on( "participantsUpdate", p => this.participants = p.sort((a, b) => b.score - a.score));
    socket.emit("getUILabels", this.lang);
    socket.emit("joinPoll", this.pollId);
    socket.emit("getParticipants", this.pollId);
    this.startTimer();
  },
  methods: {
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
    startTimer: function() {
      setTimeout(() => {
        this.showQResultScreen = false;
      }, 10000);
    },

    startCountdown: function() {
      this.countdown = 5;
      const interval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(interval);
          this.goToNextQuestion;
        }
      }, 1000);
    },

    goToNextQuestion: function() {
      this.$router.push();
    },


  },
  watch: {
    nextQuestionNormal: function(newVal) {
      if (newVal) {
        this.startCountdown();
      }
    },
    nextQuestionCursed: function(newVal) {
      if (newVal) {
        this.startCountdown();
      }
    },
  },
}
</script>
<style scoped>
header {
  display: flex;
  align-items: center;
  padding-top: 1rem;
  position: relative;
  padding-left: 1rem;
  gap: 1rem ;
}

.home-img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  height: 50px;
  width: 50px;
}

.resultWrapper {
  height: 80vh;
  width: 70vh;
  border: none;
  border-radius: 10px;
  padding: 20px;
  background-color: #a0ca92;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  text-align: center;
  transition: opacity 0.5s ease-in-out;

}

#resultScreen {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: auto;
  height: 100vh;
}


.participant-list{
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  height: 30rem;
  overflow-y: scroll;
  overflow-x: hidden;
}

.participants-name{
  width: 10rem;
  display:flex;
  align-items: center;
  padding:1rem;
  text-overflow: ellipsis;
}

.participants-score {
  width: 10rem;
  display:flex;
  align-items: center;
  padding:1rem;
  text-overflow: ellipsis;
}

.mini-avatar{
  width: 7rem;
  height: 7rem;
  border: none;
  border-radius: 1rem;
}

.text-box-participant {
  display: flex;
  text-align: center;
  justify-content: space-around;
  background-color: transparent;
  border-radius: 0;
  font-family: "Inter", sans-serif;
  margin-right: 1rem;
  box-shadow: inset 0px 11px 5px -8px #75b09c, inset 0 -11px 5px -8px #75b09c;
  border-bottom: 1px #d8f793 solid;

}

.score-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 28%;
}

.name-box {
  display: flex;
  align-items: center;
}

.container {
  display: flex;
  align-items: flex-end;
  padding-bottom: 0.5rem;
}

.nav-label {
  text-align: center;
  padding: 5px;
  background-color: e0be36;
  box-shadow: inset 0px -3px 0px #e0be36;
  border-radius: 0px;
  font-size: 20px;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  //box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
