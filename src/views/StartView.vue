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
  <h1>{{ uiLabels["sales-pitch"] }}</h1>
  <h2>{{ uiLabels.subHeading }}</h2>
  <label>
    Write poll id:
    <input type="text" v-model="newPollId">
  </label>
  <router-link v-bind:to="'/lobby/' + newPollId">
    {{ uiLabels.participatePoll }}
  </router-link>
  <div class="rectangle"></div>
  <div class="rectangle"></div>

  <div class="grid-container-element">
    <div class="grid-child-element purple">Grid Column 1</div>
    <div class="grid-child-element green">Grid Column 2</div>
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
    toggleNav: function () {
      this.hideNav = ! this.hideNav;
    }
  }
}
</script>
<style scoped>
  .grid-container-element {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    border: 1px solid black;
    width: 50%;
  }
  .grid-child-element {
    margin: 10%;
    border: 1px solid red;
  }

  .rectangle {
    width: 200px;
    height: 100px;
    background-color: #808080;
    margin: 20px auto;
  }

  .grid-container {
    display: flex;
    width: 50%;
  }

  .smallRectangle1 {
    flex: 1;
    background-color: #808080;
    margin: 10px;
  }
  .smallRectangle2 {
    background-color: #808080;
    margin-right: 20px;
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
