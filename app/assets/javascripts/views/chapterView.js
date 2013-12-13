App.Views.Chapter = Backbone.View.extend({
  template: JST['chapter'],
  events: {
    'keyup .riddle': 'validateGuess'
  },
  initialize: function(){
    $('#story').append(this.$el);
    this.model.riddleParse();
    this.$el.append(this.template(this.model.toJSON()));
    this.$el.find('.riddle').focus();
  },
  validateGuess: function(e){
   $input = $(e.currentTarget);
   var answer = this.model.get('riddle');
   if ($input.val() === answer) {
    this.$el.find('.riddle').replaceWith('<span>' + answer + '</span>');
    this.model.set({completed: true});
   }
  }
});
