@import 'src/assets/main.css'
<template>
<div v-if="question.img != null" class="imgContainer">
  <img :src="question.img" class="image">
</div>
<p></p>
<div class="textbox">
 <!-- <p>{{question.q}}</p> -->
  <textarea disabled class="text-area-question" :value="` ${question.q}`"></textarea>
</div>
<div class="answerbox">
<button class="answer-button"
        v-for="(a, index) in question.a"
        :key="index"
        :ref="'a-' + index"
        :id="'a-'+ index"
        v-on:click="answer(a); changeColor(index, a.correct); disableButtons(question.a)"> <!-- försök att föra in en textarea i knappen, åter igen på samma sätt som i create !-->
  <!--{{ a.text }}!-->
   <textarea disabled
             class="text-area-answer"
             :value="` ${ a.text }`"
             :id="'a-text-'+index"></textarea>
</button>
</div>
<!--div v-if="timeLeft < 1">
  {{ resetButtons(question.a) }}
</div!-->

</template>
<script>

export default {
  name: 'QuestionComponent',
  props: {
    question: Object,
    timeLeft: Number,
  },
  emits: ["answer"],
  methods: {
    answer: function (answer) {
      this.$emit("answer", answer);
      //console.log(answer)
    },
    disableButtons: function (len) {
      console.log("disableButtons");
      for (let i = 0; i < len.length; i++) {
        //const targetDiv = this.$refs['a-' + i][0]; // Access the ref
        const targetDiv = document.getElementById('a-' + i);// Access the ref
        targetDiv.disabled = true;
        const targetText = document.getElementById('a-text-'+i)
        targetText.style.color = "darkgray";

        targetDiv.setAttribute('disabled', true);
      }
      /**const button = document.getElementsByClassName("answer-button");
      // Disable the button
      button.disabled = true;*/
    },
    resetButtons: function (len) {
      for (let i = 0; i < len.length; i++) {
        const targetDiv = document.getElementById('a-' + i); // Access the ref
        if(targetDiv){
          const targetText = document.getElementById('a-text-'+i)
          targetText.style.color = "black";
          if(targetDiv.hasAttribute('disabled')){
            console.log("button reset")
            targetDiv.disabled = false;
            targetDiv.style.backgroundColor = 'var(--p-beige)';
          }
        }
      }
    },

    changeColor: function (i, correct){
      const targetDiv = document.getElementById('a-' + i); // Access the ref
      targetDiv.disabled = true;
      if (targetDiv) {
        if(correct){
          targetDiv.style.backgroundColor = 'var(--p-green)';
        }
        else{
          targetDiv.style.backgroundColor = 'var(--p-red)';
        }

        //Tog bort border
        //targetDiv.style.border = '5px solid #ddd';

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

.imgContainer{
display: flex;
align-items: center;
justify-content: center;
margin: auto;
padding:5px;
background-color: white;
border: 1px solid #ddd;
border-radius: 8px;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width:40vw;
  height:30vw;
}

.image {
   width: 90%;
   height: auto;
}
.answerbox {
  padding-top: 1rem;
  justify-content: center;
  display: grid;
  grid-template-areas: "a b" "c d" "e f";
  align-items: center;
  gap: 1rem;
}

.text-area-question{
  border: none;
  background-color: transparent;
  width: 100%;
  height: 100%;
  resize: none;
  font-family: "Inter",sans-serif;
  text-align: center;
  vertical-align: middle;
  color: black;
  font-size: 2vw;
}

.text-area-answer{
  border: none;
  background-color: transparent;
  width: 100%;
  height: 100%;
  resize: none;
  font-family: "Inter",sans-serif;
  cursor: pointer;
  color: black;
  pointer-events: none;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  font-size: 1.5vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

.textbox{
  padding-left:0.5rem;
  padding-right: 0.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display:inline-block;
  width:40vw;
  height:auto;
  padding-bottom: 0.5vw;
  padding-top: 0.5vw;
}

.answer-button:disabled{
  cursor: auto;
  pointer-events: all !important;
}

.answer-button:hover:disabled{
  transform: none !important;
  cursor: auto;
  pointer-events: all !important;
  background-color: var(--p-beige);
}

.answer-button {
  padding-bottom: 0.5vw;
  padding-top: 0.5vw;
  padding-left:0.5rem;
  padding-right: 0.5rem;
  text-align: center;
  background-color: var(--p-beige);
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 20vw;
  height: 10vw;
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
/*answerbox shake effect for blue shell cope */
.blueshellAnswerBox:hover{
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

@media (max-width: 768px) {
  .imgContainer {
    height: auto;
    width: 24rem;
  }

  .answerbox {
    
  }

  .textbox {
    width: 24rem;
    height: auto;
  }

  .answer-button {
    width: 12rem;
    height: auto;
  }

  .text-area-answer {
    font-size: 30px;
    color: black;
  }

  .text-area-question {
    font-size: 40px;
  }


}


</style>