<template>
  <header>
    <router-link to="/" class = "nav-button">
        <img class="home-img" src="../assets/home_icon.png" alt="HomeImg">
    </router-link>
    <button class=" nav-button" v-on:click="switchLanguage">
      <img :src="uiLabels.changeLanguage" alt="" class="lang-img">
    </button>
  </header>

  <div id="qResultScreen" v-if="showQResultScreen">
    <div class="resultWrapper">
      <h2>The correct answer was:</h2>
      <h3>{{ correctAnswer }}</h3>
      <br>
      <h3>Here is what everyone answered: </h3>
      <p>staplar</p>

    </div>

  </div>
  
  <div id="leaderboardScreen" v-if="!showQResultScreen">
    <div class="resultWrapper">
      <h2>Current Leaderboard: </h2>
      <ul>
        <li>Avatar - Player 1</li>
        <li>Avatar - Player 2</li>
        <li>Avatar - Player 3</li>
        <li>Avatar - Looooooser</li>
      </ul>
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

  <div>
    lang: {{ lang }}
    {{ question.q }}
  </div>
  <BarsComponent v-bind:labels="question.a" v-bind:data="submittedAnswers"/>

  <span>{{ submittedAnswers }}</span>
  <span>{{participants}}</span>
</template>

<script>
// @ is an alias to /src
import BarsComponent from '@/components/BarsComponent.vue';
import io from 'socket.io-client';

const socket = io("localhost:3000");

export default {
  name: 'ResultView',
  components: {
    BarsComponent
  },
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      question: "",
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
    socket.on("questionUpdate", update => this.question = update);
    socket.on( "participantsUpdate", p => this.participants = p );
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
      this.$router.push()
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
  height: 90%;
  width: 500px;
  border: none; 
  border-radius: 10px; 
  padding: 20px; 
  background-color: #ffffff; 
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



</style>
