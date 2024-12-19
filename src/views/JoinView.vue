<template>
    <div id="joinScreen">
      <div v-if="!joined">

        <input
            class="idTextBox text-box"
            type="text"
            maxlength="30"
            placeholder="Enter Game ID"
            v-model="pollId"><br>

        <button class="idButton nav-button" v-on:click="participateInPoll">
          JOIN!
        </button>

      </div>

      <div v-if="joined">
        <div id="nameAvatarWrapper">
          <input
              class="idTextBox text-box"
              type="text"
              maxlength="30"
              placeholder="Enter your name"
              v-model="userName"><br>




          <div>
            <label for="avatarChoice">Choose an avatar:</label>
          </div>
        <img :src="avatar" alt="avatar" class="avatar-preview"><br>
        <p>Choose avatar: lägg in knapp för att ta bild med kamera och ladda upp</p>






          <button class="idButton nav-button" v-on:click="submitNameAndAvatar">
          Join game!
        </button>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  import io from 'socket.io-client';
  const socket = io("localhost:3000");
  
  export default {
    name: 'JoinView',
    data: function () {
      return {
        pollId: "",
        userName: "",
        joined: false,
        avatar: "https://i.pinimg.com/474x/25/6b/9d/256b9d21d02a82e9d60deded024e4fe9.jpg",



      }
    },
    created: function () {
    this.pollId = this.$route.params.id;
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "participantsUpdate", p => this.participants = p );
    socket.on( "startPoll", () => this.$router.push("/poll/" + this.pollId) );
    socket.emit( "joinPoll", this.pollId );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    participateInPoll: function () {
      if (!this.pollId) {
        alert("Enter your name!");
        return;
      }
      socket.emit( "participateInPoll", {pollId: this.pollId} );
      this.joined = true;
    },
    submitNameAndAvatar: function() {
      if (!this.userName) {
        alert("You have to choose a name!");
        return;
      }
      socket.emit("submitNameAndAvatar", {
        userName: this.userName,
        avatar: this.avatar,
      });

      // Redirect to /lobby/:id
      this.$router.push(`/lobby/${this.pollId}`);
    },
  },
};
  </script>

<style>



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

#nameAvatarWrapper {
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



.avatar-preview {
  width: 100px;
  height: 100px
}


</style>