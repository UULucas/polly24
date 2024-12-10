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
<<<<<<< Updated upstream
  </router-link-->

  <div id="container">
    <button class="rectangle">Gå med i quiz</button>
    <button class="rectangle">Skapa quiz</button>

    <div id="pond">
      <button class="rectangle2">Bläddra bland quiz</button>
      <button class="rectangle2">Skapa konto</button>
    </div>
  </div>
=======
  <p> ass</p>

  <div class="wrapper">
    <div class="box a">
      <button class="startButton a"> Gå med i Quiz </button>
    </div>
    <div class="box b">
      <button class="startButton b"> Skapa ett Quiz </button>
    </div>
    <div class="box c">
      <button class="startButton c"> Bläddra </button>
    </div>
    <div class="box d">
      <button class="startButton d"> Skapa  </button>
    </div>
  </div>

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

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
    text-align: center;
    padding: 20px;
    background-color: gold;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 50px;
    font-family: "Inter", sans-serif;
    font-weight: 400;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .rectangle2 {
    width: 22rem;
    height: 10rem;
    text-align: center;
    padding: 20px;
    background-color: gold;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 50px;
    font-family: "Inter", sans-serif;
    font-weight: 400;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  .rectangle:hover,
  .rectangle2:hover{
  transform: scale(1.03);
    background-color: darkgoldenrod;
    transition: transform 0.2s;
  }


=======
.wrapper {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 100px 100px 100px;
  background-color: #fff;
  color: #444;
}

.box {
  background-color: #444;
  color: #fff;
  border-radius: 5px;
  padding: 20px;
  font-size: 150%;
}

.a {
  grid-column: 1 / span 2;
}
.b {
  grid-column: 1 ;
  grid-row: 2 / span 2;
}
.c {
  grid-column: 1 ;
  grid-row: 3 / span 2;
}
.d {
  grid-column: 2 ;
  grid-row: 3 /span 2;
}
>>>>>>> Stashed changes


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
