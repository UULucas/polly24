  <template>
  <section>
    <div class="bubbles">
      <div class="bubble" v-for="n in 15" :key="n"></div>
    </div>
  </section>

  <div id="qResultScreen" v-if="showQResultScreen">
    <div class="resultWrapper">
      <h2>{{ uiLabels.correctAnswer }}</h2>
      <div v-for="answer in question.a.filter(item => item.correct)" v-bind:key="answer">
        <div class="answer-div">
        <label class="answer-label">{{answer.text}}</label>
        </div>
      </div>
      <br>
      <h3>{{ uiLabels.everyonesAnswer }}</h3>
      <BarsComponent v-bind:labels="question.a" v-bind:data="submittedAnswers"/>

    </div>

  </div>


  <div v-if="!showQResultScreen">
    <div v-if="!currentQuestion.lastQuestion" class="resultWrapper">
      <h2>{{ uiLabels.leaderBoard }}</h2>
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
    <h3>{{uiLabels.waitMessage}}</h3>
        <div class="spinner">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>
    </div>

    <div v-else>
      <div class="resultWrapper">
        <h2>{{ uiLabels.winnerMessage }}</h2>
        <h1>{{getWinner()}}</h1>
        <h3>{{ uiLabels.finalLeaderboard }}</h3>
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
      <div id="home-button-container">
        <router-link to="/" class="header-button nav-button">
          <img class="home-img" src="../assets/home_icon.png" alt="HomeImg">
      </router-link>
      </div>
      </div>
    </div>
  </div>


  <span v-for="participant in participant" v-bind:key="participant">{{participant.name}}</span>
</template>

<script>
// @ is an alias to /src
import BarsComponent from '@/components/BarsComponent.vue';

export default {
  name: 'ResultComponent',
  components: {
    BarsComponent
  },
  props: {
    question: Object,
    currentQuestion: Object,
    quizDone: Boolean,
    uiLabels: Object,
    submittedAnswers: Object,
    participants: Object,
  },
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      showQResultScreen: true,
      countdown: 5,
    }
  },
  created: function () {
    this.startTimer();
  },
  methods: {
    getWinner: function (){
      if(this.participants.length > 0){
        return this.participants[0].name;
      }
      else return "";

    },
    startTimer: function() {
      setTimeout(() => {
        this.showQResultScreen = false;
      }, 10000);
    },
  },
}
</script>
<style scoped>

.home-img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  height: 50px;
  width: 50px;
}

.resultWrapper {
  height: auto;
  width: 70vh;
  border: none;
  border-radius: 10px;
  padding: 20px;
  background-color: white;
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
  font-size: large;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  height: 18rem;
  overflow-y: scroll;
  overflow-x: hidden;
}

.participants-name{
  width: 9rem;
  box-shadow: inset 0px -5px 0px #e0be36;
  margin-top: 1rem;
  height: 0.5rem;
  display:flex;
  align-items: center;
  padding:1rem;
  text-overflow: ellipsis;
}

.participants-score {
  width: 8rem;
  box-shadow: inset 0px -5px 0px 0px #e0be36;
  margin-top: 1rem;
  height: 0.5rem;
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
  box-shadow: inset 0px 11px 5px -8px var(--p-offWhite), inset 0 -11px 5px -8px var(--p-offWhite);
  border-bottom: 1px var(--p-offWhite) solid;

}

.container {
  display: flex;
  align-items: flex-end;
  padding-bottom: 0.5rem;
  margin-left: 4rem;
}

.nav-label {
  text-align: center;
  padding: 5px;
  background-color: #e0be36;
  box-shadow: inset 0px -5px 0px #e0be36;
  border-radius: 0px;
  font-size: 20px;
  font-family: "Inter", sans-serif;
  font-weight: 400;
}

.answer-div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 15rem;
  height: 3rem;
  margin: 1rem auto;
  background-color: var(--p-cadetBlue);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.answer-label{
  font-size: 1rem;
  font-family: "Inter", sans-serif;
  color: black;
}

h1 {
  color: gold;
}

#home-button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .resultWrapper {
    width: 22rem;
    height: auto;
  }

  .participants-name {
    font-size: 14px;
  }

  .participant-list {
    height: 22rem;
  }

}
</style>
