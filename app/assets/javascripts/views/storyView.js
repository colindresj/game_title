App.Views.Story = Backbone.View.extend({
  el: '#story',
  events: {
    'click #start': 'startGame'
  },
  template: JST['story'],
  initialize: function(){
    this.$el.append(this.template());
    this.listenTo(this.collection, 'change', this.addOne);
  },
  startGame: function(){
    this.addOne();
  },
  addOne: function(){
    var chapterView = new App.Views.Chapter();
    this.collection.add(chapterView.model);
  }
});
