App.Views.Story = Backbone.View.extend({
  el: '#story',
  events: {
    'click #start': 'startGame'
  },
  template: JST['story'],
  initialize: function(){

    // checking local storage for a current chapter and if so setting the counter to it
    var currentChapter = this.collection.getProgress();
    if (currentChapter) {
      this.modelCounter = parseInt(currentChapter, 10);
      this.listenTo(this.collection, 'sync', this.addAllCompleted);
    } else {
      this.$el.append(this.template());
      this.modelCounter = 1;
    }

    // add a new chapter whenever one is completed
    this.listenTo(this.collection, 'change:completed', this.addOne);

    // add points to score when an answer is solved
    this.listenTo(this.collection, 'riddleSolved', this.pointsBump);
  },
  startGame: function(){
    this.points = 0;
    this.addOne();
  },
  addOne: function(){

    // grab a new chapter model based of an id set in the yml file
    // use the counter to grab chapters sequentially
    var currentChapter = this.collection.get(this.modelCounter);
    this.modelCounter++;

    // if there are still chapters left, create a new view and pass in the
    // chapter as that views model and a template matched by id
    if (currentChapter){
      var chapterView = new App.Views.Chapter({ model: currentChapter });

      // save story progress to local storage for later continuation
      this.collection.saveProgress(currentChapter.id);
    } else {
      this.finishGame();
    }
  },
  addAllCompleted: function(){
    i = 1;
    while (i < this.modelCounter) {
      var currentChapter = this.collection.get(i);
      var chapterView = new App.Views.Chapter({ model: currentChapter });
      chapterView.solveAll();
      i++;
    }
    this.addOne();
  },
  pointsBump: function(){
    // have to persist points or this won't work (NaaN)
    this.points += 50;
    $('#points span').html(this.points);
  },
  finishGame: function(){
    alert('Game over.');
  }
});
