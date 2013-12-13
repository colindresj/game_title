App.Models.Chapter = Backbone.Model.extend({
  defaults: {
    completed: false
  },
  riddleParse: function(){
    var content = this.get('text');
    var regEx = new RegExp('/{(.*?)}/');
    var parsedContent = content.replace(/{(.*?)}/, '<input type="text" class="riddle">');
    this.set({text: parsedContent});
  }
});
