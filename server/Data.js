'use strict';
import {readFileSync} from "fs";

// Store data in an object to keep the global namespace clean. In an actual implementation this would be interfacing a database...
function Data() {
  this.polls = {};
  this.polls['test'] = {
    lang: "en",
    //  constructor(question, answers = [{text:"", correct:false}]) {
    questions: [
      {q: "How old are you?", 
       a: [{text:"0-13", correct: false}, {text:"14-18",correct: false} , {text:"19-25", correct: true}, {text:"26-35", correct: false}, {text:"36-45", correct: false},{text: "45-", correct: false}]
      },
      {q: "How much do you enjoy coding?", 
       a: [{text:"1", correct : false}, {text:"2", correct : false}, {text:"3", correct : false}, {text:"4", correct : false}, {text:"5", correct : false}]
      }
    ],
    answers: [{"0-13": 4}, {name:"fredrik",}],
    currentQuestion: 0,
    participants: [{name: "tester", answers: [], avatar: "avatar"}]
  }
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

Data.prototype.pollExists = function (pollId) {
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
    poll.currentQuestion = 0;
    poll.quizName = quizName;
    poll.time = 0;
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

Data.prototype.participateInPoll = function(pollId, name, avatar) {
  console.log("participant will be added to", pollId, name);
  if (this.pollExists(pollId)) {
    this.polls[pollId].participants.push({name: name, answers: [], avatar: avatar});
  }
}

Data.prototype.getParticipants = function(pollId) {
  const poll = this.polls[pollId];
  console.log("participants requested for", pollId);
  if (this.pollExists(pollId)) {
    return this.polls[pollId].participants
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
Data.prototype.setTime = function(pollId, time) {
  if (this.pollExists(pollId)) {
    //console.log(time);
    const poll = this.polls[pollId];
    poll.time = time;
    //sjukt om det bara funkar såhär
  }
}
Data.prototype.getTime = function(pollId) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    return poll.time;
  }
  return {}
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

Data.prototype.saveToJson = function (pollId){
//shout out saveToJson, gotta be one of my favourite functions
}

export { Data };

