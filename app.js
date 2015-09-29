#!/usr/bin/env node

/**
 * Module dependencies.
 */
 
var program = require('commander');
var Wordnik = require('wordnik');
var colors = require('colors');
var R = require('ramda');

var api_key = '69cb40606211293cb7e81018c4d0b231e657a10ae78c924c9';

var wn = new Wordnik({
  api_key: api_key
});

/* A help guide */
program
  .version('0.0.1')
  .usage('[options] [word]')
  .option('def <word>', 'Display definitions of a word.')
  .option('syn <word>', 'Display synonyms of a word.')
  .option('ant <word>', 'Display antonyms of a word.')
  .option('ex <word>', 'Display examples of a word.')
  .option('<word>, dict <word>', 'Display all above details for a word.')
  .option('word-of-the-day', 'Display all above details of word of the day')
  .option('play', 'Play the Word Game')
  .parse(process.argv);

var expression = process.argv[2];

switch(expression) {
  case 'def':
    getDefinition(program.def);
    break;
  case 'syn':
    getSynonyms(program.syn);
    break;
  case 'ant':
    getAntonyms(program.ant);
    break;
  case 'ex':
    getExamples(program.ex);
    break;
  case undefined:
    getWordOfTheDay();
    break;
  default:
    console.log('default');
    break;
}

function getDefinition(word) {
  wn.definitions(word, function(e, defs) {
    if(e) {
      console.log(e);
    } else {
      var definitions = R.pluck('text', defs);
      intermediateFunction(definitions, program.def);
    }
  });
}

function getSynonyms(word) {
  wn.relatedWords(word, {
    relationshipTypes: 'synonym'
  }, function(e, syns) {
    if(e) {
      console.log(e);
    } else {
      var synonyms = R.pluck('words', syns);
      if (R.isNil(synonyms[0])) {
        intermediateFunction(synonyms, program.syn);
      } else {
        intermediateFunction(synonyms[0], program.syn);
      }
    }
  });
}

function getAntonyms(word) {
  wn.relatedWords(word , {
    relationshipTypes: 'antonym'
  }, function(e, ants) {
    if(e) {
      console.log(e);
    } else {
      var antonyms = R.pluck('words', ants);
      if (R.isNil(antonyms[0])) {
        intermediateFunction(antonyms, program.ant);
      } else {
        intermediateFunction(antonyms[0], program.ant);
      }
    }
  });
}

function getExamples(word) {
  wn.examples(word, function(e, examples) {
    if(e) {
      console.log(e);
    } else {
      if (R.isNil(examples.examples)) {
        intermediateFunction([], program.ex);
      } else {
        var examplesArray = R.pluck('text', examples.examples);
        intermediateFunction(examplesArray, program.ex);
      }
    }
  });
}

function getWordOfTheDay() {
  wn.wordOfTheDay(function(e, word) {
    if(e) {
      console.log(e);
    } else {
      console.log(word);
    }
  });
}

function intermediateFunction(result, userInput) {
  if ( result.length  < 1 || typeof result === undefined) {
    console.log(getNoDataMessage(expression)[0].cyan + ' ' + userInput.yellow);
  } else {
    console.log(getDescriptionText(expression)[0].blue + ' ' + userInput.yellow + ':');
    result.forEach (function (value, index) {
      console.log(R.toString(index + 1).blue + ': '.blue + value.green);
    });
  }
}

var descriptionList = [{
  'key_word': 'def',
  'description': 'Definition of the word-',
  'no_data_present_msg': 'No definition is present for the word-'
}, {
  'key_word': 'syn',
  'description': 'Synonyms of the word-',
  'no_data_present_msg': 'No synonym is present for the word-'
}, {
  'key_word': 'ant',
  'description': 'Antonyms of the word-',
  'no_data_present_msg': 'No antonym is present for the word-'
}, {
  'key_word': 'ex',
  'description': 'Examples of the word-',
  'no_data_present_msg': 'No example is present for the word-'
}];

function getDescriptionText(option) {
  return R.pluck('description', R.filter(R.propEq('key_word', option), descriptionList));
}

function getNoDataMessage(option) {
  return R.pluck('no_data_present_msg', R.filter(R.propEq('key_word', option), descriptionList));
}
