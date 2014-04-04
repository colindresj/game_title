[![Build Status](https://travis-ci.org/colindresj/game_title.svg?branch=master)](https://travis-ci.org/colindresj/game_title)

##Game Title
**Game Title** is a text-based game. It adds complexity to a suspense story by removing some of the words. Your challenge is to work your way through chapters of word puzzles in order to continue reading, and eventually complete, the story. Play the game on [Heroku](http://game-title.herokuapp.com "Game Title").

###How It Works

- Puzzles are hidden in the text.
- You get 50 points for every puzzle you correctly solve. Points are tracked at the top right of the page.
- You have 10 hints. Everytime you press the "Hint" or "Answer" button, you are deducted a hint.
  Hints will cost you 50 points, and answers will cost 150 points.
- Correct guesses are highlighted in <span class="green-raw-highlight">green</span>, and given answers are highlighted in <span class="pink-raw-highlight">red</span>.
- Your entire game progress is saved automatically, so feel free to play this game over time.
- When you're ready to begin, press the button at the top left of the page.

###Built With
This is a Backbone Application being served up by Ruby on Rails running a Thin Server. There is no database, as everything runs off a flat-file design made up of a series of YAML files. Data is persisted to the browser's LocalStorage directly from within Backbone.

Data is plugged into the DOM from Backbone using a combination of my own regular expressions and Handlebars.

There are plans to add a MongoDB and Mongo Mapper integration to persist data onto a server as well.
