App.Views.Story = Backbone.View.extend({
  el: '#story',
  events: {
    'click #start': 'startGame'
  },
  template: JST['story'],
  initialize: function(){
    this.$el.append(this.template());
    this.listenTo(this.collection, 'change', this.startGame);
  },
  startGame: function(){
    this.addOne();
  },
  addOne: function(){
    var chapter = new App.Views.Chapter();
  }
});
