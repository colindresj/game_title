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

    // grab a new chapter model based of an id set in the yml file
    // use the above counter to grab chapters sequentially
    var currentChapter = this.collection.get(this.modelCounter);

    // if there are still chapters left, create a new view and pass in the
    // chapter as that views model and a template matched by id
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
