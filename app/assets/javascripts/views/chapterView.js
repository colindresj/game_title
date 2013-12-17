App.Views.Chapter = Backbone.View.extend({
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
    this.$el.append(this.template(this.model.toJSON()));

    // focus on the first riddle input for ease of use
    this.$el.find('.riddle:first').focus();

    // listen for when the model is asked to give its answer away or for a hint
    this.listenTo(this.model, 'giveAnswer', this.giveAnswer);
    this.listenTo(this.model, 'giveHint', this.giveHint);
  },
  fillAnswer: function($input, answers, answer, givePoints){
    $input.fadeOut('fast', function(){
      var $answerSpan = $('<span class="solved pink-raw-highlight">' + answer + '</span>');
      $(this).replaceWith($answerSpan);
      $answerSpan.fadeIn('fast');
    });
    answers.remove(answer);

    // trigger a custom event to increase the points if needed
    if (givePoints) this.model.trigger('riddleSolved');

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
      if ($input.val() === answer)this.fillAnswer($input, answers, answer, true);
    }, this);
    this.completeChapter();
  },
  solveAll: function(){
    var answers =  this.model.get('riddles');
    _.each(answers, function(answer){
      var $input = this.$el.find('.riddle:first');
      $input.replaceWith('<span class="solved pink-raw-highlight">' + answer + '</span>');
    }, this);
  },
  giveAnswer: function(){
    var $input = $('.riddle:first');
    var answers = this.model.get('riddles');
    var givenAnswer = this.model.get('riddles')[0];
    this.fillAnswer($input, answers, givenAnswer, false);
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
    var answers = this.model.get('riddles');

    // set the chapter to completed if no more answers
    if (answers.length === 0) {
      this.model.set({completed: true});
    } else {
      return false;
    }
  }
});
