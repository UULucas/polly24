<template>
  <header>
    <div class="fix">
    <button class="nav-button" v-on:click="switchLanguage">
      <img :src="uiLabels.changeLanguage" alt="" class="lang-img">
    </button>
    </div>
  </header>

  <section>
  <div class="bubbles">
    <div class="bubble" v-for="n in 15" :key="n"></div>
  </div>
</section>

  <body>
  <div id="container">
    <button class="start-button nav-button" >
      <router-link to="/join/" class ="link-wrapper">
      {{ uiLabels.joinQuiz }}
      </router-link>
    </button>


    <button class="start-button nav-button">
      <router-link to="/create/" class ="link-wrapper">
      {{ uiLabels.createQuiz }}
      </router-link>
    </button>
  </div>
  </body>
</template>

<script>
import io from 'socket.io-client';
sessionStorage.setItem("dataServer", "localhost:3000");
//sessionStorage.setItem("dataServer","localhost:3000");
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'StartView',
  data: function () {
    return {
      uiLabels: {},
      newPollId: "",
      lang: localStorage.getItem( "lang") || "en",
      hideNav: true
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
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
  }
}
</script>
<style scoped>



#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.start-button {
  width: 44rem;
  height: 10rem;
}

body{
  height: 100%;
}

header {

  width: 100%;
  display: grid;
  grid-template-columns: 2em auto;
}

.fix {
  margin: 1rem;
}

@media (max-width: 768px) {
  .start-button {
    margin-top: 2rem;
    width: 24rem;
    height: 10rem;
}
}
</style>
