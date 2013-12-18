App.Views.Chapter = Backbone.View.extend({
  tagName: 'article',
  events: {
    'keyup .riddle': 'validateGuess'
  },
  initialize: function(){
    $('#story').append(this.$el);

    this.$el.attr('id', 'chapter-' + this.model.id);
    this.template = JST['chapter' + this.model.id];

    // parse the chapter in order to properly remove the answers and replace
    // them with blank inputs, as well as set the models answers in a riddles array
    this.model.riddleParse();
    this.$el.hide();
    this.$el.append(this.template(this.model.toJSON())).addClass('delay-fade').show();

    // focus on the first riddle input for ease of use
    this.$el.find('.riddle:first').focus();

    // listen for when the model is asked to give its answer away or for a hint
    this.listenTo(this.model, 'giveAnswer', this.giveAnswer);
    this.listenTo(this.model, 'giveHint', this.giveHint);
  },
  fillAnswer: function($input, answers, answer, givePoints, correctGuess){

    var riddlesClone = this.model.get('riddlesClone');
    var solvedRiddles = JSON.parse(this.model.getProgress()) || {};
    var answerIndex = _.indexOf(riddlesClone, answer);

    // update the solved hash in storage
    solvedRiddles[answerIndex] = answer + ', ' + correctGuess;
    this.model.saveProgress(JSON.stringify(solvedRiddles));

    // remove the solved word from the answers bank
    // but leave it in the initial clone, which needs to always maintain the words from the start
    answers.remove(answer);

    // trigger a custom event to increase the points if needed
    if (givePoints) this.model.trigger('riddleSolved');

    // Paint the span green for correct, pink for with hint
    if (correctGuess) {
      $input.fadeOut('fast', function(){
        var $answerSpan = $('<span class="solved green-raw-highlight">' + answer + '</span>');
        $(this).replaceWith($answerSpan);
        $answerSpan.fadeIn('fast');
      });
    } else {
      $input.fadeOut('fast', function(){
        var $answerSpan = $('<span class="solved pink-raw-highlight">' + answer + '</span>');
        $(this).replaceWith($answerSpan);
        $answerSpan.fadeIn('fast');
      });
    }

    // reset the hintCounter for a new word
    this.model.set({'hintCounter': 0});

    // wait for fadeOut to finish before focusing on the next input
    var _this = this;
    setTimeout(function() {
      _this.$el.find('.riddle:first').focus();
    }, 400);
  },
  validateGuess: function(e){

    // grab the input either from the event target or the first input
    var solved = this.model.get('solved');
    var $input;
    if (e) {
      $input = $(e.currentTarget);
    } else {
      $input = $('.riddle:first');
    }

    // loop through the answers and check if current input val matches any
    // of those answers. If so, replace with a span and remove it from the answers,
    // then focus on the next question
    var answers = this.model.get('riddles');
    _.each(answers, function(answer){
      if ($input.val() === answer)this.fillAnswer($input, answers, answer, true, true);
    }, this);
    this.completeChapter();
  },
  solveAll: function(){
    var answers =  this.model.get('riddles');
    _.each(answers, function(answer){
      var $input = this.$el.find('.riddle:first');
      $input.replaceWith('<span class="solved green-raw-highlight">' + answer + '</span>');
    }, this);
  },
  solveSome: function(){
    var solved = JSON.parse(this.model.getProgress());
    if (solved) {
      var solvedPairs = _.pairs(solved);
      _.each(solvedPairs, function(solvedPair){
        var i = parseInt(solvedPair[0], 10) + 1;
        var answer = solvedPair[1].split(', ')[0];
        var $input = $('.riddle:nth-of-type(' + i + ')');
        var answers = this.model.get('riddles');
        if (solvedPair[1].split(', ')[1] === "true") {
          var correctGuess = true;
        } else {
          var correctGuess = false;
        }
        this.fillAnswer($input, answers, answer, false, correctGuess);
      }, this);
    }
  },
  giveAnswer: function(){
    var $input = $('.riddle:first');
    var answers = this.model.get('riddles');
    var givenAnswer = answers[0];

    this.fillAnswer($input, answers, givenAnswer, false, false);
    this.completeChapter();
  },
  giveHint: function(){
    var $input = $('.riddle:first');
    var answers = this.model.get('riddles');
    var hintIndex = this.model.get('hintCounter');

    // give the first non-given letter as the hint
    var givenHint = this.model.get('riddles')[0][hintIndex];

    // increase the hint index
    this.model.set({'hintCounter': ++hintIndex});

    // add the hint to the input field
    var originalValue = $input.val();
    $input.val(originalValue + givenHint);

    // run it through the validator in case it's finished
    this.validateGuess();
    $input.focus();
  },
  completeChapter: function(){
    var answers = this.model.get('riddlesClone');

    // grab the current answers from local storage or set it to an empty object
    // so we can call _.values on it below
    var savedAnswers = JSON.parse(this.model.getProgress()) || {};

    // set the chapter to completed if all solved
    if (answers.length === _.values(savedAnswers).length) {

      // start off the next chapter with no progress
      this.model.resetProgress();

      // save the raw html of the completed chapter for later appending
      var _this = this;
      setTimeout(function() {

        // grabbing a clone and wrapping it in a div so we can grab the whole container,
        // not just its inner HTML
        var chapterFinishedHTML = $('#chapter-' + _this.model.id).clone().wrapAll('<div/>').parent().html();
        localStorage.setItem('chapter' + _this.model.id, chapterFinishedHTML);
      }, 400);

      this.model.set({completed: true});
    } else {
      return false;
    }
  }
});
