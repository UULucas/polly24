@import 'src/assets/main.css'
<template>
  <div class="textbox">
<p>{{question.q}}</p>
</div>
<div class="answerbox link-wrapper">
<button id = "answer-buttons" class="answer-button" v-for="(a, index) in question.a" :key="index" :ref="'a-' + index" v-on:click="answer(a.text); changeColor(index, a.correct); disableButtons(question.a)">
  {{ a.text }}
</button>
</div>
<div v-if="question.timerValue === 0">
  {{ resetButtons(question.a) }}
</div>
</template>
<script>
export default {
  name: 'QuestionComponent',
  props: {
    question: Object
  },
  emits: ["answer"],
  methods: {
    answer: function (answer) {
      this.$emit("answer", answer);
      console.log(answer)
    },
    disableButtons: function (len) {
      for (let i = 0; i < len.length; i++) {
        const targetDiv = this.$refs['a-' + i][0]; // Access the ref
        targetDiv.disabled = true;
      }
      const button = document.getElementsByClassName("answer-button");
      // Disable the button
      button.disabled = true;
    },
    resetButtons: function (len) {
      for (let i = 0; i < len.length; i++) {
        const targetDiv = this.$refs['a-' + i][0]; // Access the ref
        targetDiv.disabled = !targetDiv.disabled;
        targetDiv.style.backgroundColor = 'var(--p-beige)';
      }
    },

    changeColor: function (i, correct){
      const targetDiv = this.$refs['a-' + i][0]; // Access the ref
      targetDiv.disabled = true;
      if (targetDiv) {
        if(correct){
          targetDiv.style.backgroundColor = 'var(--p-green)';
        }
        else{
          targetDiv.style.backgroundColor = 'var(--p-red)';
        }

        targetDiv.style.border = '5px solid #ddd';

        //add if statement to change to red green depending on right/wrong answer
        //targetDiv.style.backgroundColor = 'var(--p-red)'; 
      }
      
      //const element = document.getElementById('answer-buttons');
      //element.classList.remove("answer-button"); // Remove mystyle class from DIV
      //element.classList.add("textbox"); // Add newone class to DIV
    }
 } 
  }

</script>
<style>
.textbox{
padding:20px;
background-color: white;
border: 1px solid #ddd;
border-radius: 8px;
font-size: 30px;
font-family: "Inter", sans-serif;
font-weight: 400;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
display:inline-block;
width:auto;
height:auto;
}

.answerbox {
  margin-top: 1rem;
  display: grid;
  grid-template-areas: "a b" "c d" "e f";
  align-items: center;
  gap: 1rem;
  
}

.answer-button {
  text-align: center;
  padding: 20px;
  background-color: var(--p-beige);
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 50px;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 20rem;
  height: 10rem;

}

.answer-button:hover {
  transform: scale(1.03);
  background-color: var(--p-yellow);
  transition: transform 0.2s;
  cursor: pointer;
}
.answer-button.green{
  background-color: var(--p-green);
}
/* answerbox shake effect for blue shell cope
.answerbox:hover{
  animation: shake 0.4s;
  animation-iteration-count: infinite;
}
@keyframes shake {
  0% { transform: translate(4px, 4px) rotate(0deg); }
  10% { transform: translate(-4px, -3px) rotate(-1deg); }
  20% { transform: translate(-6px, 0px) rotate(-2deg); }
  30% { transform: translate(9px, 6px) rotate(-3deg); }
  40% { transform: translate(3px, -3px) rotate(-2deg); }
  50% { transform: translate(-5px, 10px) rotate(-1deg); }
  60% { transform: translate(-8px, 4px) rotate(0deg); }
  70% { transform: translate(9px, 3px) rotate(1deg); }
  80% { transform: translate(-5px, -5px) rotate(2deg); }
  90% { transform: translate(2px, 4px) rotate(3deg); }
  100% { transform: translate(5px, -10px) rotate(2deg); }
}
  */

</style>