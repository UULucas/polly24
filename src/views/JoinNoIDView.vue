<template>
  <head>
    <link rel="stylesheet" href="../assets/main.css">
  </head>

  <header>
    <div class="header">
      <router-link to="/" class="header-button nav-button">
        <a>
          <img class="home-img" src="../assets/home_icon.png" alt="HomeImg">
        </a>
      </router-link>
    </div>
  </header>

  <div id="joinScreen">
    <input
          class="idTextBox text-box"
          type="text"
          maxlength="30"
          placeholder="Enter Game ID"
          v-model="pollId"><br>

      <button class="idButton nav-button" v-on:click="checkID">
        JOIN!
      </button>

  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'JoinNoIDView',
  data: function () {
    return {
      pollId: "",
    }
  },
  created: function () {
    console.log("no id view")
    socket.on( "uiLabels", labels => this.uiLabels = labels );
  },
  methods: {
    checkID(){
      //console.log(this.pollId);
      if (!this.pollId) {
        alert("Enter a game id!");
        return;
      }
      else{
        this.$router.push({
          name: "JoinView",
          params: {
            id: this.pollId,
          },
        });
      }
    },
  },
}
</script>

<style scoped>

#joinScreen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex-direction: column;
  width: 80%;
  margin:auto;
  gap:1rem;
}

.idTextBox{
  width: 25rem;
  height: 5rem;
  font-size: 3rem;
}

.idButton {
  width:25rem;
}


canvas {
  cursor: crosshair;
  border: 0.2rem solid black;
  border-radius: 1rem;
}

video {
  border-radius: 1rem;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
}

.header-button {
  position: absolute;
  left: 16px;
  top: 8px;
}

.home-img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  height: 50px;
  width: 50px;
}
</style>