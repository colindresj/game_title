App.Views.Chapter = Backbone.View.extend({
  template: JST['chapter'],
  events: {
    'keyup .riddle': 'validateGuess'
  },
  initialize: function(){
    $('#story').append(this.$el);

    // parse the chapter in order to properly remove the answers and replace
    // them with blank inputs, as well as set the models answers in a riddles array
    this.model.riddleParse();
    this.$el.append(this.template(this.model.toJSON()));

    // focus on the first riddle input for ease of use
    this.$el.find('.riddle:first').focus();
  },
  validateGuess: function(e){
    $input = $(e.currentTarget);

    // loop through the answers and check if current input val matches any
    // of those answers. If so, replace with a span and remove it from the answers,
    // then focus on the next question
    var answers = this.model.get('riddles');
    // underscore _each
    _.each(answers, function(answer){
      if ($input.val() === answer) {
        $input.replaceWith('<span>' + answer + '</span>');
        answers.splice(answer, 1);
        this.$el.find('.riddle:first').focus();
       }

      // stop looping if there are no more anwers left to guess and set the chapter to completed
      if (answers.length === 0) {
        this.model.set({completed: true});
      }
    }, this);
  }
});
