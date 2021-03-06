App.Models.Chapter = Backbone.Model.extend({
  defaults: {
    completed: false,
    riddles: [],
    riddlesClone: [],
    hintCounter: 0
  },
  riddleParse: function(){
    var content = this.get('text');

    // create an array of riddles by find words wrapped in curly braces
    var riddles = content.match(/{([^{}]+)}/g);

    // loop through the array of riddles, replace the text with inputs
    // and also return an array of clean strings as the riddle answers
    this.set({riddles:
      _.map(riddles, function(currentRiddle){
        var regEx = /{([^}]+)}/g;
        content = content.replace(/{(.*?)}/, '<input type="text" class="riddle" size="' + (currentRiddle.length - 2) + '">');
        return regEx.exec(currentRiddle)[1];
      }, this)
    });

    // make a clone of the riddles and save it on the collection for future comparison
    this.set('riddlesClone', this.get('riddles').slice(0));

    // set the text for the chapter equal to the string with inputs in place of
    // answers (words originally wraped in {})
    this.set({text: content});
  },
  saveProgress: function(solved){
    localStorage.setItem('solvedRiddles', solved);
  },
  getProgress: function(){
    return localStorage.getItem('solvedRiddles');
  },
  resetProgress: function(){
    localStorage.removeItem('solvedRiddles');
  }
});

// Adding this remove function to Array because it makes it easier
// to remove solved riddles from a particular chapter's bank
Array.prototype.remove = function(el, all) {
  for (var i = this.length - 1; i >= 0; i--) {
    if (this[i] === el) {
      this.splice(i, 1);
      if(!all) {
        break;
      }
    }
  }
  return this;
};
