App.Views.Chapter = Backbone.View.extend({
  template: JST['chapter'],
  riddle: 'riddle',
  events: {
    'keyup .riddle': 'validateGuess'
  },
  initialize: function(){
    $('#story').append(this.$el);
    this.$el.append(this.template({}));
    this.$el.find('.riddle').focus();
    this.model = new App.Models.Chapter();
  },
  validateGuess: function(e){
   $input = $(e.currentTarget);
   var answer = this.riddle;
   if ($input.val() === answer) {
    this.$el.find('.riddle').replaceWith('<span>' + answer + '</span>');
    this.model.set({completed: true});
   }
  }
});
