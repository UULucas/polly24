function sockets(io, socket, data) {
  
  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on('createPoll', function(d) {
    data.createPoll(d.pollId, d.lang, d.quizName)
    socket.emit('pollData', data.getPoll(d.pollId));
  });

  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, d.data);

    socket.emit('questionUpdate', data.activateQuestion(d.pollId));
  });

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId);
    //console.log("name test",data.polls[pollId].quizName);

    socket.emit('quizName', data.getQuizName(pollId));
    socket.emit('questionUpdate', data.activateQuestion(pollId))
    socket.emit('submittedAnswersUpdate', data.getSubmittedAnswers(pollId));
    socket.emit('currentQuestion', data.getQuestionNumber(pollId));


  });

  socket.on('participateInPoll', function(d) {
    data.participateInPoll(d.pollId, d.name, d.avatar, d.id);
    io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
  });
  socket.on('startPoll', function(pollId) {
    io.to(pollId).emit('startPoll');
  })
  socket.on('getParticipants', function(pollId) {
    io.to(pollId).emit('participantsUpdate', data.getParticipants(pollId));
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
  });

  socket.on('submitPlayerAnswer', function(d) {
    console.log("Player answer reseved: "+d.answer+" score: "+d.score)
    data.submitAnswer(d.pollId, d.answer); //så att vi kan använda hans taplar för den frågan :)
    data.submitPlayerAnswer(d.pollId, d.answer, d.playerId, d.score);
    io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
  });

  socket.on('generateNewID', function (){
    socket.emit('newID', data.generateGameId())
  });

  socket.on('updateTime', function(d) {
    data.setTime(d.pollId, d.time);
    //io.to(d.pollId).emit('timeUpdate', d.time)
  });

  socket.on('runQuestion', function(d) {
    //let question = data.activateQuestion(d.pollId, d.questionNumber);
    //io.to(d.pollId).emit('questionUpdate', question);
    //io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));

    if(data.pollExists(d.pollId)) {
      const poll = data.polls[d.pollId];
      let question = data.activateQuestion(d.pollId, d.questionNumber);

      io.to(d.pollId).emit('questionUpdate', question);
      io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
      //io.to(pollId).emit('currentQuestion', poll.currentQuestion);

      poll.timeLeft = question ? question.questionTime : 1;
      io.to(d.pollId).emit('timeUpdated', poll.timeLeft);
      if(poll.timer){
        clearInterval(poll.timer);
      }
      poll.timer = setInterval(() => {
        poll.timeLeft--;
        io.to(d.pollId).emit('timeUpdated', poll.timeLeft);
        //console.log("Time updated for",pollId,"new time:",poll.timeLeft);
        if (poll.timeLeft <= 0) {
          clearInterval(poll.timer); // Stoppa timern när tiden tar slut
        }
      }, 1000);
    }
  });

  //egengjort, kanske funkar, vi får se
  socket.on('nextQuestion', function(pollId) {
    if(data.pollExists(pollId)) {
      const nextQuestion = data.nextQuestion(pollId);
      const poll = data.polls[pollId];
      const question = data.activateQuestion(pollId,poll.currentQuestion);

      io.to(pollId).emit('questionUpdate', question);
      io.to(pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(pollId));
      io.to(pollId).emit('currentQuestion', nextQuestion);

      console.log("test")
      console.log(question);
      poll.timeLeft = question ? question.questionTime : 1;
      io.to(pollId).emit('timeUpdated', poll.timeLeft);
      if(poll.timer){
        clearInterval(poll.timer);
      }
      poll.timer = setInterval(() => {
        poll.timeLeft--;
        io.to(pollId).emit('timeUpdated', poll.timeLeft);
        //console.log("Time updated for",pollId,"new time:",poll.timeLeft);
        if (poll.timeLeft <= 0) {
          clearInterval(poll.timer); // Stoppa timern när tiden tar slut
        }
      }, 1000);
    }
  });

}

export { sockets };