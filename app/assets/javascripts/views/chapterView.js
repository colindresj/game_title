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
  },
  validateGuess: function(e){
    var $input = $(e.currentTarget);

    // loop through the answers and check if current input val matches any
    // of those answers. If so, replace with a span and remove it from the answers,
    // then focus on the next question
    var answers = this.model.get('riddles');
    _.each(answers, function(answer){
      if ($input.val() === answer) {
        $input.fadeOut('fast', function(){
          var $answerSpan = $('<span>' + answer + '</span>');
          $(this).replaceWith($answerSpan);
          $answerSpan.fadeIn('fast');
        });
        answers.remove(answer);

        // wait for fadeOut to finish before focusing on the next input
        var _this = this;
        setTimeout(function() {
          _this.$el.find('.riddle:first').focus();
        }, 400);
       }

      // stop looping if there are no more anwers left to guess and set the chapter to completed
      if (answers.length === 0) {
        this.model.set({completed: true});
      }
    }, this);
  },
  solveAll: function(){
    var answers = this.model.get('riddles');
    _.each(answers, function(answer){
      var $input = this.$el.find('.riddle:first');
      $input.replaceWith('<span>' + answer + '</span>');
    }, this);
  }
});
