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
var givenWord = '';

switch(expression) {
  case 'def':
    wn.definitions(program.def, function(e, defs) {
    	if(e) {
    		console.log(e);
    	} else {
        givenWord = program.def;
        R.forEach(__displayFunction, defs);
    	}
    });
    break;
  case 'syn':
    wn.relatedWords(program.syn , {
    	relationshipTypes: 'synonym'
    }, function(e, word) {
    	if(e) {
    		console.log(e);
    	} else {
        givenWord = program.syn;
    		console.log(word);
    	}
    });
    break;
  case 'ant':
    wn.relatedWords(program.ant , {
    	relationshipTypes: 'antonym'
    }, function(e, word) {
    	if(e) {
    		console.log(e);
    	} else {
        givenWord = program.ant;
    		console.log(word);
    	}
    });
    break;
  case 'ex':
    wn.examples(program.ex, function(e, examples) {
    	if(e) {
    		console.log(e);
    	} else {
        givenWord = program.ex;
    		console.log(examples);
    	}
    });
    break;
  case undefined:
    wn.wordOfTheDay( function(e, word) {
    	if(e) {
    		console.log(e);
    	} else {
    		console.log(word);
    	}
    });
    break;
  default:
    console.log('default');
    break;
}


function __displayFunction(word) { 
  console.log(getDescriptionText(expression)[0].blue + ' ' + givenWord.yellow + ': ' + word.text.green);
}

function getDescriptionText(option) {
  var descriptionList = [{
    'key_word': 'def',
    'description': 'Definition of the word-'
  }, {
    'key_word': 'syn',
    'description': 'Definition of the word-'
  }, {
    'key_word': 'ant',
    'description': 'Definition of the word-'
  }, {
    'key_word': 'ex',
    'description': 'Definition of the word-'
  }]
  return R.pluck('description', R.filter(R.propEq('key_word', option), descriptionList));
}

