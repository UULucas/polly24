<template>
  <head>
    <link rel="stylesheet" href="../assets/main.css">
  </head>

  <body>
  <div id="main-container">
    <div class="row">
      <div >Quiz 1</div>
      <div >Nyckel</div>
    </div>

    <div>
      <div >Dela nyckel</div>
    </div>


    <div class="participants-section">
      <h2>Deltagare</h2>
      <ul class="participants">

      </ul>

    </div>
    <div class="start-section">
      <button class="start-button">Starta spel</button>
    </div>


  </div>


  </body>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'StartQuizView',

  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      pollData: {},
      uiLabels: {},
      imageUrl: "",
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "pollData", data => this.pollData = data );
    socket.on( "participantsUpdate", p => this.pollData.participants = p );
    socket.emit( "getUILabels", this.lang );
  },
}
</script>
<style scoped>

body{
  background-color: var(--p-blue);
}




</style>