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

    // checking local storage for a game progress
    var currentChapter = this.collection.getProgress();

    // if game is over render completed story and break out
    if (localStorage.getItem('gameComplete')) {
      this.$el.append(this.template({
        title: this.collection.title,
        author: this.collection.author,
        points: this.collection.points,
        newGame: false,
        hintsLeft: this.collection.getHints() === "0" ? false : true
      }));
      this.modelCounter = parseInt(currentChapter, 10);
      this.renderFinished();
      return false;
    }

    // if there is current chapter and if so setting the counter to it
    if (currentChapter) {
      $('#intro').remove();
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
      $('#intro').show();
      this.$el.append(this.template({
        points: this.collection.points,
        newGame: true,
        hintsLeft: false
      }));
      this.modelCounter = 0;
    }
  },
  startGame: function(){
    $('#intro').hide();
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

      // solve any that need to be solved
      chapterView.solveSome();

      // save story progress to local storage for later continuation
      this.collection.saveProgress(currentChapter.id);
    } else {
      this.finishGame();
    }
  },
  addAllCompleted: function(){
    i = 0;
    while (i < this.modelCounter) {
      var completedChapterHTML = localStorage.getItem('chapter' + i);
      this.$el.append(completedChapterHTML);
      i++;
    }
    this.addOne();
  },
  renderFinished: function(){
    i = 0;
    while (i <= this.modelCounter) {
      var completedChapterHTML = localStorage.getItem('chapter' + i);
      this.$el.append(completedChapterHTML);
      i++;
    }
  },
  pointsBump: function(){
    var $points= $('#points');

    $points.find('span').html(this.collection.pointsBump());
    $points.addClass('delay-fade');

    // wait until the animation is complete before removing the class
    setTimeout(function() {
      $points.removeClass('delay-fade');
    }, 1000);
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
    var _this = this;
    this.$el.hide();
    $('#complete').show().find('.final-points').find('span').html(this.collection.points);
    this.collection.finishGame();

    // show the completed story after 5 seconds
    setTimeout(function() {
      _this.$el.show();
      $('#complete').hide();
    }, 5000);
  }
});
