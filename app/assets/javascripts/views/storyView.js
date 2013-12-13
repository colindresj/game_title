App.Views.Story = Backbone.View.extend({
  el: '#story',
  events: {
    'click #start': 'startGame'
  },
  template: JST['story'],
  initialize: function(){
    this.$el.append(this.template());
    this.modelCounter = 0;
    this.listenTo(this.collection, 'change:completed', this.addOne);
  },
  startGame: function(){
    this.addOne();
  },
  addOne: function(){
    this.modelCounter++;
    var currentChapter = this.collection.get(this.modelCounter);
    if (currentChapter){
      var chapterView = new App.Views.Chapter({ model: currentChapter });
    } else {
      this.finishGame();
    }
  },
  finishGame: function(){
    alert('Game over.');
  }
});
