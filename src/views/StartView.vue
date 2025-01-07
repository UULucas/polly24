<template>
  <header>
    <div class="fix">
    <button class="nav-button" v-on:click="switchLanguage">
      <img :src="uiLabels.changeLanguage" alt="" class="lang-img">
    </button>
    </div>
  </header>

  <body>
  <div id="container">
    <button class="start-button nav-button" >
      <router-link to="/join/" class ="link-wrapper">
      {{ uiLabels.joinQuiz}}
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
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'StartView',
  components: {
    ResponsiveNav
  },
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
    changeColor: function(event){
      var color = 'yellow';
      event.target.style.backgroundColor = color;
    },
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
  margin-top: 1rem;
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
  background-color: var(--p-blue);
  height: 100%;
}
  
header {
  background-color: var(--p-blue);
  width: 100%;
  display: grid;
  grid-template-columns: 2em auto;
}

.logo img {
  height:2.5rem;
  vertical-align: bottom;
  margin-right: 0.5rem;
}

.fix {
  margin: 1rem;
}
</style>
