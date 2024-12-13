<template>
  <h1>Fucking test</h1>
  <div class="modal-overlay" v-if="isModalOpen">
    <div class="modal">
      <button class="close-button" @click="closeModal">X</button>
      <div class="modal-content">
        <button class="action-button">Lägg till text</button>
        <button class="action-button">Lägg till bild</button>
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

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
