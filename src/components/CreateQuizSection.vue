<template>
  <h1>Fucking test</h1>
  <div class="modal-overlay" v-if="isModalOpen">
    <div class="modal">
      <button class="close-button" @click="closeModal">X</button>
      <div class="modal-content">
        <button class="action-button">Lägg till text</button>
        <div class="image-area">
        <button class="action-button" @click="addImage" :style="getButtonStyle()">Lägg till bild</button>
        </div>
      </div>
      <div class="modal-footer">
        <button class="circle-button" @click="undoAction">↩</button>
        <button class="circle-button" @click="cancelAction">✖</button>
        <button class="done-button" @click="completeAction">Klar</button>
      </div>
    </div>
  </div>

  <div>
    <CreateQuizSection></CreateQuizSection>
  </div>
</template>

<script>

export default {
  name: 'CreateQuizSection',
  props: {
    quiz: Object
  },
  data: function () {
    return {
      quizId:"",
      quizName:"",
      imageUrl: "",
    }
  },
  methods: {
    closeModal() {
      this.isModalOpen = false;
    },
    undoAction() {
      alert("Undo action triggered!");
    },
    cancelAction() {
      alert("Cancel action triggered!");
    },
    completeAction() {
      alert("Done action triggered!");
      this.isModalOpen = false;
    },
    addImage(){
      const url = prompt("Ange bildens URL");
      if (url) {
        this.imageUrl = url;
      }
    },
    getButtonStyle() {
      return {
        backgroundImage: this.imageUrl ? `url('${this.imageUrl}')` : "none",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        color: this.imageUrl ? "transparent" : "black"
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.image-area {
  width: 80%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;
  background-color: white;
}

.action-button {
  width: 100%;
  height: 100%;
  border: none;
  cursor: pointer;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: transparent; //test
}


</style>
