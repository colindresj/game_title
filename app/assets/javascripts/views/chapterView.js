App.Views.Chapter = Backbone.View.extend({
  el: '#story',
  model: new App.Models.Chapter(),
  template: JST['chapter'],
  events: {
    'keyup .riddle': 'validateGuess'
  },
  completed: false,
  initialize: function(){
    this.$el.append(this.template({}));
    this.listenTo(this.model, 'change', this.completeChapter);
  },
  validateGuess: function(e){
   $input = $(e.currentTarget);
    this.model.completed = true;
   var answer = this.model.get('riddle');
   if ($input.val() === answer) {
    var solution = '<span>' + answer + '</span>';
    this.$el.find('.riddle').replaceWith(solution);
   }
  },
  completeChapter: function(){
    alert('complete');
  }
});
