@import 'src/assets/main.css'
<template>
  <div class="textbox">
<p>{{question.q}}</p>
</div>
<div class="answerbox link-wrapper">
<button class="rectangle nav-button" v-for="a in question.a" v-on:click="answer(a)" v-bind:key="a">
  {{ a }}
</button>
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
    } 
  }
}
</script>
<style>
.textbox{
font-size: 3vw;
padding:20px;
background-color: var(--p-blue);
border:5px solid black;
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
.rectangle {
  width: 20rem;
  height: 10rem;
}

</style>