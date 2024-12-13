<template>

    <div id="quiz-container">
      <div id="header">
        <div class="quiz-name">
          Quiz namn
        </div>

        <div class="start-quiz">
          Starta quiz
        </div>
      </div>

      <div class="image-area">
        Lägg till bild
      </div>

      <div class="question-area">
        Lägg till fråga
      </div>

      <div id="answer-container">

        <div class="answer">
          SVAR
        </div>

        <div class="add">
          +
        </div>

      </div>
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
    saveQuiz: function () {

    },
    createQuizId: function (){

    }

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#quiz-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100vh;
  gap: 16px;
}

#header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 8px;
}

.quiz-name,
.start-quiz {
  flex: 1;
  text-align: center;
  border: 1px solid #000;
  padding: 8px;
  background-color: #f5f5f5;
}

.image-area {
  width: 80%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;
  background-color: #f5f5f5;
}

.question-area {
  width: 80%;
  padding: 16px;
  text-align: center;
  border: 1px solid #000;
  background-color: #f5f5f5;
}

#answer-container {
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 80%;
}

.answer,
.add {
  flex: 1;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;
  background-color: #f5f5f5;
}
</style>
