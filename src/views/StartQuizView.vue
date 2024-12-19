<template>
  <head>
    <link rel="stylesheet" href="../assets/main.css">
  </head>

  <body>
  <div id="main-container">

    <div class="head-container">
      <div class="name-and-key">

        <div class="item">
          Quiz 1
        </div>

        <input
            class="quiz-key text-box"
            :value="text"
            type="text"
            placeholder="Quiz key"
            @input="event => text = event.target.value">

      </div>

        <div class="share-key">
          <button class="share-key-button nav-button">
            Dela nyckel
          </button>
        </div>
    </div>

    <div class="participants-section">
      <h2>Deltagare</h2>
      <ul class="participants">
      </ul>
    </div>

    <div class="start-section">
      <button class="start-button nav-button">
        Starta spel</button>
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

#main-container{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex-direction: column;
  width: 80%;
  margin:auto;
  gap:1rem;
}

.head-container{
  display: flex;
  gap:1rem;
}

.name-and-key{
  gap:1rem;
}


.share-key-button{
  height: 96%;
  width: 12rem;
}

.item{
  height:3rem;
  border:solid;
  border-radius: 8px;
  border-width: 1px;
}

.quiz-key{
  height:6rem;
  width: 38rem;
  font-size: 4rem;
}
.start-section{
  margin-left: 30rem;
}





</style>