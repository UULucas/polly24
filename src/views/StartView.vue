<template>
  <header>
    <div v-bind:class="['hamburger', {'close': !hideNav}]"
         v-on:click="toggleNav">
    </div>
    <div class="logo">
      <img src="/img/logo.png">
      Polly polling tool
      <img src="../assets/logo.svg">
    </div>
  </header>
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
    <button v-on:onclick="changeColor(this)" class="rectangle">Gå med i quiz</button>
    <button class="rectangle">Skapa quiz</button>

    <div id="pond">
      <button class="rectangle2">Bläddra bland quiz</button>
      <button class="rectangle2">Skapa konto</button>
    </div>
  </div>
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
      uiLabels: {
        changeLanguage: "Change language",
        createPoll: "Create Poll",
        about: "About Poll",
      },
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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  #pond {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .rectangle {
    width: calc(320px + 320px + 20px + 20px + 20px - 3px);
    height: 150px;
    background-color: #808080;
    margin: 0;
    cursor: pointer;
    font-family: "Inter", sans-serif;
    font-weight: 600;
    font-size: 50px;
  }

  .rectangle2 {
    flex: 1;
    width: 340px;
    height: 150px;
    background-color: #808080;
    padding: 10px;
    display: inline-block;
    margin: 0;
    cursor: pointer;
    font-family: "Inter", sans-serif;
    font-weight: 600;
    font-size: 25px;
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
