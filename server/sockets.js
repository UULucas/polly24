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
    socket.emit('questionUpdate', data.activateQuestion(pollId))
    socket.emit('submittedAnswersUpdate', data.getSubmittedAnswers(pollId));
  });

  socket.on('participateInPoll', function(d) {
    data.participateInPoll(d.pollId, d.name, d.avatar);
    io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
  });
  socket.on('startPoll', function(pollId) {
    io.to(pollId).emit('startPoll');
  })
  socket.on('getParticipants', function(pollId) {
    io.to(pollId).emit('participantsUpdate', data.getParticipants(pollId));
  });
  socket.on('runQuestion', function(d) {
    let question = data.activateQuestion(d.pollId, d.questionNumber);
    io.to(d.pollId).emit('questionUpdate', question);
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
  });

  socket.on('generateNewID', function (){
    socket.emit('newID', data.generateGameId())
  });

  socket.on('timeLeft', function(d) {
    data.setTime(d.pollId, d.time);
    io.to(d.pollId).emit('timeUpdate', data.getTime(d.pollId))
  });

  socket.on('getCurrentQuestion', function(pollId) {
    socket.emit('currentQuestion', data.getCurrentQuestion(pollId));
  });

  socket.on('isGameRunning', function (pollId){
    socket.emit('gameRunning', data.isGameRunning(pollId))
  });


}

export { sockets };