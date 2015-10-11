'use strict';

var Wordnik = require('wordnik');
var R = require('ramda');
var async = require('async');
var inquirer = require('inquirer');
var display = require('./display');

var api_key = '69cb40606211293cb7e81018c4d0b231e657a10ae78c924c9';

var wn = new Wordnik({
  api_key: api_key
});

var calls = {
  getDefinition: getDefinition,
  getSynonyms: getSynonyms,
  getAntonyms: getAntonyms,
  getWordOfTheDay: getWordOfTheDay,
  getExamples: getExamples,
  getCompleteDetails: getCompleteDetails,
  playTheWordGame: playTheWordGame
};

function getDefinition(option, word) {
	wn.definitions(word, function(e, defs) {
    if(e) {
      console.log(e);
    } else {
      var definitions = R.pluck('text', defs);
      display.intermediateFunction(option, definitions, word);
      return definitions;
    }
  });
};

function getSynonyms(option, word) {
  wn.relatedWords(word, {
    relationshipTypes: 'synonym'
  }, function(e, syns) {
    if(e) {
      console.log(e);
    } else {
      var synonyms = R.pluck('words', syns);
      if (R.isNil(synonyms[0])) {
        if (typeof word !== 'undefined') {
          display.intermediateFunction(option, synonyms, word);
        }
        return null;
      } else {
        if (typeof word !== 'undefined') {
          display.intermediateFunction(option, synonyms[0], word);
        }
        return synonyms[0];
      }
    }
  });
};

function getAntonyms(option, word) {
  wn.relatedWords(word , {
    relationshipTypes: 'antonym'
  }, function(e, ants) {
    if(e) {
      console.log(e);
    } else {
      var antonyms = R.pluck('words', ants);
      if (R.isNil(antonyms[0])) {
        if (typeof word !== 'undefined') {
          display.intermediateFunction(option, antonyms, word);
        }
        return null;
      } else {
        if (typeof word !== 'undefined') {
          display.intermediateFunction(option, antonyms[0], word);
        }
        return antonyms[0];
      }
    }
  });
};

function getExamples(option, word) {
  wn.examples(word, function(e, examples) {
    if(e) {
      console.log(e);
    } else {
      if (R.isNil(examples.examples)) {
        display.intermediateFunction(option, [], program.ex);
        return null;
      } else {
        var examplesArray = R.pluck('text', examples.examples);
        display.intermediateFunction(option, examplesArray, word);
        return examplesArray;
      }
    }
  });
};

function getWordOfTheDay(option) {
  var wordOfDay = [];
  wn.wordOfTheDay(function(e, word) {
    if(e) {
      console.log(e);
    } else {
      wordOfDay.word = word.word;
      console.log((display.getDescriptionText(option)[0]).blue + ' ' + wordOfDay.word.yellow);
      async.parallel([
        function() {
          wordOfDay.synonyms = getSynonyms('syn', wordOfDay.word);
        },
        function() {
          wordOfDay.antonyms = getAntonyms('ant', wordOfDay.word);
        },
        function() {
          wordOfDay.definitions = R.pluck('text', word.definitions);
          display.intermediateFunction('def', wordOfDay.definitions, wordOfDay.word);
        },
        function() {
          wordOfDay.examples = R.pluck('text', word.examples);
          display.intermediateFunction('ex', wordOfDay.examples, wordOfDay.word);
        }
      ]);
    }
  });
};

function getCompleteDetails(option, word) {
  var completeWordDetails = [];
  async.parallel([
    function(callback) {
      completeWordDetails.synonyms = getSynonyms('syn', word);
      callback();
    },
    function(callback) {
      completeWordDetails.antonyms = getAntonyms('ant', word);
      callback();
    },
    function(callback) {
      completeWordDetails.definitions = getDefinition('def', word);
      callback();
    },
    function(callback) {
      completeWordDetails.examples = getExamples('ex', word);
      callback();
    }
  ], function() {
    console.log((display.getDescriptionText(option)[0]).blue + ' ' + word.yellow);
  });
};

function playTheWordGame() {
  wn.randomWord(function(e, word){
    if (e) {
      console.log(e);
    } else {
      console.log(word.word); //change this after completing the app

      var hints = [];
      // hints.word = word.word;
      hints.word = 'vales'; //check this line. move back to the previous line before submission.
      async.parallel([
        function(callback) {
          wn.definitions(hints.word, function(e, defs) {
            if (e) {
              console.log(e);
            } else {
              hints.def = R.pluck('text', defs);
              callback();
            }
          });
        },
        function(callback) {
          wn.relatedWords(hints.word, {
            relationshipTypes: 'synonym'
          }, function(e, syn) {
            hints.syn = [];
             if (e) {
              console.log(e);
            } else {
              hints.syn = R.pluck('words', syn)[0] ? R.pluck('words', syn)[0] : [];
              callback();
            }
          });
        },
        function(callback) {
          wn.relatedWords(hints.word, {
            relationshipTypes: 'antonym'
          }, function(e, ant) {
            hints.ant = [];
            if (e) {
              console.log(e);
            } else {
              hints.ant = R.pluck('words', ant)[0] ? R.pluck('words', ant)[0] : [];
              callback();
            }
          });
        }
      ], function() {
        showHint(hints);
      });
    }
  });
}

function showHint(hints, hintKey) {
  console.log(hintKey);
  var functions = ['syn', 'ant', 'def'];
  var variable = hintKey ? hintKey : getRandomElement(functions);

  if (hints.syn.length < 1 && hints.ant.length < 1 && hints.def.length < 1) {
    console.log('No more hints. :)'.green);
    showAnswer(hints);
  } else {
    if (variable === 'jumble') {
      var jumbledWord = scramble();
      console.log('jumbledWord is ', jumbledWord);
    }
    if (variable === 'syn' && hints.syn.length > 0) {
      var synonym = getRandomElement(hints[variable]);

      console.log((display.getDescriptionText(variable)[0]).cyan);
      console.log(synonym.green);

      hints[variable].splice(hints[variable].indexOf(synonym), 1);
      askQuestion(variable, hints);
    } else if (variable === 'ant' && hints.ant.length > 0) {
      var antonym = getRandomElement(hints[variable]);

      console.log((display.getDescriptionText(variable)[0]).cyan);
      console.log(antonym.green);

      hints[variable].splice(hints[variable].indexOf(antonym), 1);
      askQuestion(variable, hints);
    } else {
      variable = 'def';
      var definition = getRandomElement(hints[variable]);

      console.log((display.getDescriptionText(variable)[0]).cyan);
      console.log(definition.green);

      hints[variable].splice(hints[variable].indexOf(definition), 1);
      askQuestion(variable, hints);
    }
  }
}

function scramble(str) {
  var scrambled = '';
  var src = str.split('');
  var randomNum;

  while (src.length > 1) {
    randomNum = Math.floor(Math.random() * src.length);
    scrambled += src[randomNum];
    src.splice(randomNum, 1);
  }
  scrambled += src[0];
  return scrambled;
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function askQuestion(variable, hints) {

  var questions = [
    {
      type: "input",
      name: "answer",
      message: "What's your answer?",
      filter: function(val) {
        return val.toLowerCase();
      }
    }
  ];

  //need to handle the case where a synonym is entered
  inquirer.prompt(questions, function (answers) {
    hints.word = hints.word.toLowerCase();
    if (answers.answer === hints.word) {
      var appreciationMessage = ["Good!", "Great!", "Awesome!", "Super!", "Nice!"];
      var message = getRandomElement(appreciationMessage);
      console.log((message + ' You entered the correct word!!').green);
    } else {
      var wrongWordMessage = ["Oh no!", "Sorry!", "Oh my!"];
      var message = getRandomElement(wrongWordMessage);
      console.log((message + ' You entered the wrong word!!').red);
      displayChoiceList(variable, hints);
    }
  });
}

function displayChoiceList(variable, hints) {
  var questions = [
    {
      type: "rawlist",
      name: "choice",
      message: "Select an option to continue:",
      choices: ['Try Again', 'Hint', 'Quit']
    }
  ];

  inquirer.prompt(questions, function (answers) {
    switch (answers.choice) {
      case 'Try Again':
        askQuestion(variable, hints);
        break;
      case 'Hint':
        giveHints(hints);
        break;
      case 'Quit':
        showAnswer(hints);
        break;
    };
  });
}

function showAnswer(hints) {
  console.log('Correct word is: '.blue + hints.word.yellow);
  getCompleteDetails('dict', hints.word);
}

function giveHints(hints) {
  //deal the functionality
  console.log('Hints:'.blue);
  var keys = ['jumble', 'def', 'syn', 'ant'];
  var hintKey = getRandomElement(keys);
  showHint(hints, hintKey);
}

module.exports = calls;