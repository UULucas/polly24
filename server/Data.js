'use strict';
import {readFileSync} from "fs";

// Store data in an object to keep the global namespace clean. In an actual implementation this would be interfacing a database...
function Data() {
  this.polls = {};
  this.polls['test'] = {
    lang: "en",

    questions: [
      {q: "How old are you?",
       a: [{text:"0-13", correct: false}, {text:"14-18",correct: false} , {text:"19-25", correct: true}, {text:"26-35", correct: false}, {text:"36-45", correct: false},{text: "45-", correct: false}], img: null, questionTime: 20, fileName:""},
      {q:"LongquestionLongquestionLongquestionLongquestionLongquestionLongquestionLongquestionLongquestionLongquestionLongquestionLongquestionLongquestionLongquestionLongquestionLongquestionLongquestionLongquestionLongquestionLongquestion",
      a:[{text:"rätt", correct: true}], img: null, questionTime: 30, fileName:""},
      {q: "Question Picture and boxes",
        a:[{text:"rätt", correct: true},{text:"A", correct: false},{text:"A", correct: false},{text:"A", correct: false},{text:"A", correct: false}], img:"../assets/pngegg.png", questionTime: 30, fileName:""},
      {q: "Is the asnwer long?",
        a:[{text:"LonganswerLonganswerLonganswerLonganswerLonganswerLonganswerLonganswerLonganswerLonganswerLonganswerLonganswer", correct: true}], img: null, questionTime: 30, fileName:""},
      {q: "",
        a:[{text:"A", correct: false}], img: null, questionTime: 30, fileName:""},
      {q: "LongquestionLongquestionLongquestionLongquestionLongquestion",
        a:[{text:"LonganswerLonganswerLonganswerLonganswerLonganswerLonganswer", correct: false},{text:"LonganswerLonganswerLonganswerLonganswerLonganswerLonganswer", correct: false},{text:"LonganswerLonganswerLonganswerLonganswerLonganswerLonganswer", correct: false},{text:"LonganswerLonganswerLonganswerLonganswerLonganswerLonganswer", correct: false},{text:"LonganswerLonganswerLonganswerLonganswerLonganswerLonganswer", correct: false},{text:"LonganswerLonganswerLonganswerLonganswerLonganswerLonganswer", correct: false}], img: null, questionTime: 100000000, fileName:""}
    ],

    answers: [],
    currentQuestion: -1,
    participants: [{name: "tester", answers: [], avatar: null, score: 0, id:"test"}],
    timer: null,
    timeLeft: 0,
    quizName: "test quiz",
  }
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

Data.prototype.pollExists = function (pollId) {
  console.log(this.polls);
  return typeof this.polls[pollId] !== "undefined"

}

Data.prototype.getUILabels = function (lang) {
  //check if lang is valid before trying to load the dictionary file
  if (!["en", "sv"].some( el => el === lang))
    lang = "en";
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}

Data.prototype.createPoll = function(pollId, lang="en", quizName) {
  if (!this.pollExists(pollId)) {
    let poll = {};
    poll.lang = lang;
    poll.questions = [];
    poll.answers = [];
    poll.participants = [];
    poll.currentQuestion = -1;
    poll.quizName = quizName;
    poll.timer = null;
    poll.timeLeft=0;
    this.polls[pollId] = poll;
    console.log("poll created", pollId, poll);
  }
  return this.polls[pollId];
}

Data.prototype.getPoll = function(pollId) {
  if (this.pollExists(pollId)) {
    return this.polls[pollId];
  }
  return {};
}

Data.prototype.participateInPoll = function(pollId, name, avatar, id) {
  console.log("participant will be added to", pollId, "name: ",name," id: " ,id);
  if (this.pollExists(pollId)) {
    this.polls[pollId].participants.push({name: name, answers: [], avatar: avatar, score: 0, id:id});
  }
}

Data.prototype.getParticipants = function(pollId) {
  const poll = this.polls[pollId];
  console.log("participants requested for", pollId);
  if (this.pollExists(pollId)) {
    return this.polls[pollId].participants;
  }
  return [];
}

Data.prototype.addQuestion = function(pollId, q) {
  if (this.pollExists(pollId)) {
    this.polls[pollId].questions.push(q);
  }
}

Data.prototype.activateQuestion = function(pollId, qId = null) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    if (qId !== null) {
      poll.currentQuestion = qId;
    }
    return poll.questions[poll.currentQuestion];
  }
  return {}
}

Data.prototype.getSubmittedAnswers = function(pollId) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    const answers = poll.answers[poll.currentQuestion];
    if (typeof poll.questions[poll.currentQuestion] !== 'undefined') {
      return answers;
    }
  }
  return {}
}

Data.prototype.submitAnswer = function(pollId, answer) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    let answers = poll.answers[poll.currentQuestion];
    // create answers object if no answers have yet been submitted
    if (typeof answers !== 'object') {
      answers = {};
      answers[answer] = 1;
      poll.answers.push(answers);
    }
    // create answer property if that specific answer has not yet been submitted
    else if (typeof answers[answer] === 'undefined') {
      answers[answer] = 1;
    }
    // if the property already exists, increase the number
    else
      answers[answer] += 1
    console.log("answers looks like ", answers, typeof answers);
  }
}

Data.prototype.submitPlayerAnswer = function(pollId, answer, playerId, score) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    const players = poll.participants;
    const inGame = players.find(obj => obj.id === playerId);
    if(inGame) {
      //Lägg bara till svaret om man inte har svarat tidigare på den frågan
      if(inGame.answers[poll.currentQuestion]===undefined){
        inGame.answers.push(answer);
        if(inGame.score === undefined){
          inGame.score = score;
        }
        else{
          inGame.score += score;
        }
      }
    }
    else{
      console.log("No player found with name: "+playerId)
    }
  }
}

Data.prototype.getTimeLeft = function(pollId) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    return poll.timeLeft;
  }
  return 0;
}

Data.prototype.nextQuestion = function(pollId) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    if(poll.currentQuestion<(poll.questions.length-1)){
      poll.currentQuestion++;
    }
  }
  return this.getQuestionNumber(pollId);
}

Data.prototype.getQuestionNumber = function(pollId) {
  if(this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    let lastQuestion = true;
    if(poll.currentQuestion<(poll.questions.length-1)){
      lastQuestion = false;
    }
    return {number:poll.currentQuestion, lastQuestion: lastQuestion};
  }
  return {number: -1, lastQuestion: false};
}

Data.prototype.generateGameId= function(){
  if(this.polls.length>1000){ //In case we have 1000 quizes we can not generate new once
    return null;
  }
  let newId = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  while (newId in this.polls){
    newId = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  }
  return newId;
}

Data.prototype.getQuizName= function(pollId){
  if(this.pollExists(pollId)) {
    return this.polls[pollId].quizName;
  }
  return "Untitled Quiz";
}

Data.prototype.restartQuiz = function (pollId){
  if(this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    poll.currentQuestion = -1;
    poll.answers = [];
    poll.timeLeft = 0;
    clearInterval(poll.timer);
    poll.timer = null;
    for(let i = 0; i < poll.participants.length; i++){
      poll.participants[i].answers = [];
      poll.participants[i].score = 0;
    }
  }
}

Data.prototype.havePlayerAnswered = function (pollId, playerId){
  if(this.pollExists(pollId)){
    const poll = this.polls[pollId];
    const inGame = poll.participants.find(obj => obj.id === playerId);
    if(inGame) {
      //Lägg bara till svaret om man inte har svarat tidigare på den frågan
      if(inGame.answers[poll.currentQuestion]===undefined){
        return false;
      }
    }
    else{
      console.log("No player found with name: "+playerId)
    }
    return true;
  }
}

Data.prototype.kickPlayer = function(pollId, playerId){
  if(this.pollExists(pollId)){
    const poll = this.polls[pollId];
    poll.participants = poll.participants.filter(obj => obj.id !== playerId);
  }
}

export { Data };

