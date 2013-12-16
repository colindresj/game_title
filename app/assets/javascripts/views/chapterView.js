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

    // listen for when the model is asked to give it's answer away
    this.listenTo(this.model, 'giveAnswer', this.giveAnswer);
  },
  fillAnswer: function($input, answers, answer){
    $input.fadeOut('fast', function(){
      var $answerSpan = $('<span class="solved pink-raw-highlight">' + answer + '</span>');
      $(this).replaceWith($answerSpan);
      $answerSpan.fadeIn('fast');
    });
    answers.remove(answer);

    // trigger a custom event to increase the points
    this.model.trigger('riddleSolved');

    // wait for fadeOut to finish before focusing on the next input
    var _this = this;
    setTimeout(function() {
      _this.$el.find('.riddle:first').focus();
    }, 400);
  },
  validateGuess: function(e){
    var $input = $(e.currentTarget);
    var solved = this.model.get('solved');

    // loop through the answers and check if current input val matches any
    // of those answers. If so, replace with a span and remove it from the answers,
    // then focus on the next question
    var answers = this.model.get('riddles');
    _.each(answers, function(answer){
      if ($input.val() === answer) {
        this.fillAnswer($input, answers, answer);
      }
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
    this.fillAnswer($input, answers, givenAnswer);
    this.completeChapter();
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
