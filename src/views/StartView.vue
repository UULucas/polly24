<template>
  <header>
    <link rel="stylesheet" href="../assets/main.css">
    <div v-bind:class="['hamburger', {'close': !hideNav}]"
         v-on:click="toggleNav">
    </div>
    <div class="logo">
      <img src="/img/logo.png">
      Fortnite 2
      <img src="../assets/logo.svg">
    </div>
  </header>
  <body>
  <ResponsiveNav v-bind:hideNav="hideNav">
    <button v-on:click="switchLanguage">
      {{ uiLabels.changeLanguage }}
    </button>
    <router-link to="/create/">
      {{ uiLabels.createPoll }}
    </router-link>
    <a href="">
      {{ uiLabels.about }}
    </a>
    <a href="">FAQ</a>
  </ResponsiveNav>

  <!--h1>{{ uiLabels["sales-pitch"] }}</h1-->
  <!--h2>{{ uiLabels.subHeading }}</h2-->
  <!--label>
    Write poll id:
    <input type="text" v-model="newPollId">
  </label>
  <router-link v-bind:to="'/lobby/' + newPollId">
    {{ uiLabels.participatePoll }}
  </router-link-->

  <div id="container">
    <button class="rectangle nav-button" >
      <router-link to="/join/" class ="link-wrapper">
      {{ uiLabels.joinQuiz }}
      </router-link>
    </button>


    <button class="rectangle nav-button">
      <router-link to="/create/" class ="link-wrapper">
      {{ uiLabels.createQuiz }}
      </router-link>
    </button>

    <div id="pond">
      <button class="rectangle2 nav-button">
        {{ uiLabels.navigateQuiz }}</button>
      <button class="rectangle2 nav-button">
        {{ uiLabels.createAccount }}</button>
    </div>
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
    toggleNav: function () {
      this.hideNav = ! this.hideNav;
    }
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
  width: 100%; /* Ensure it stretches to the container width */

}

#pond {
  display: flex;
  justify-content: space-between; /* Spread items horizontally */
  align-items: center; /* Ensure vertical alignment */
  gap: 1rem; /* Space between the smaller buttons */
  width: 44rem; /* Match the width of the larger buttons */


}

.rectangle {
  width: 44rem;
  height: 10rem;
}

.rectangle2 {
  width: 22rem;
  height: 10rem;
}


body{
  background-color: var(--p-blue);
  height: 100%;
}

header {
  background-color: gray;
  width: 100%;
  display: grid;
  grid-template-columns: 2em auto;
}
.logo {
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 2.5rem;
  color: white;
  padding-top:0.2em;
}
.logo img {
  height:2.5rem;
  vertical-align: bottom;
  margin-right: 0.5rem;
}
.hamburger {
  color:white;
  width:1em;
  display: flex;
  align-items: center;
  justify-content: left;
  padding:0.5rem;
  top:0;
  left:0;
  height: 2rem;
  cursor: pointer;
  font-size: 1.5rem;
}

@media screen and (max-width:50em) {
  .logo {
    font-size: 5vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hamburger::before {
    content: "☰";
  }
  .close::before {
    content: "✕";
  }
  .hide {
    left:-12em;
  }
}
</style>
