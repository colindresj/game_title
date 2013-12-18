App.Views.Story = Backbone.View.extend({
  el: '#story',
  events: {
    'click #start': 'startGame',
    'click #hint': 'giveHint',
    'click #answer': 'giveAnswer'
  },
  template: JST['story'],
  initialize: function(){

    // ready for done event to render the full view
    this.listenTo(this.collection, 'done', this.render);

    // add a new chapter whenever one is completed
    this.listenTo(this.collection, 'change:completed', this.addOne);

    // add points to score when an answer is solved
    this.listenTo(this.collection, 'riddleSolved', this.pointsBump);
  },
  render: function(){

    // checking local storage for a current chapter and if so setting the counter to it
    var currentChapter = this.collection.getProgress();
    if (currentChapter) {
      this.$el.append(this.template({
        title: this.collection.title,
        author: this.collection.author,
        points: this.collection.points,
        newGame: false,
        hintsLeft: this.collection.getHints() === "0" ? false : true
      }));
      this.modelCounter = parseInt(currentChapter, 10);
      this.listenTo(this.collection, 'sync', this.addAllCompleted);
    } else {
      this.$el.append(this.template({
        points: this.collection.points,
        newGame: true,
        hintsLeft: false
      }));
      this.modelCounter = 1;
    }
  },
  startGame: function(){
    this.addOne();
    $('#start').replaceWith('<button id="hint">Hint</button><button id="answer">Answer</button>');
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
    $('#points span').html(this.collection.pointsBump());
  },
  pointsDrop: function(amount){
    $('#points span').html(this.collection.pointsDrop(amount));
  },
  giveHint: function(){
    // get the current chapterId from storage or assign it as 1 because nothing has been saved yet
    var currentChapterId = parseInt(this.collection.getProgress(), 10) || 1;

    // trigger an event on the current chapter model to give the answer and drop the points
    var currentChapter = this.collection.get(currentChapterId).trigger('giveHint');
    this.pointsDrop(50);
    this.lowerHints();

  },
  giveAnswer: function(){

    // get the current chapterId from storage or assign it as 1 because nothing has been saved yet
    var currentChapterId = parseInt(this.collection.getProgress(), 10) || 1;

    // trigger an event on the current chapter model to give the answer and drop the points
    var currentChapter = this.collection.get(currentChapterId).trigger('giveAnswer');
    this.pointsDrop(150);
    this.lowerHints();
  },
  lowerHints: function(){
    this.collection.lowerHints();

    // check if there are any hints remaining, and if not remove the hint button
    var hints = parseInt(this.collection.getHints(), 10);
    if (hints === 0) {
      $('#answer').hide();
      $('#hint').hide();
    }
  },
  finishGame: function(){
    alert('That\'s all for now, folks.');
  }
});
