#!/usr/bin/env node

/**
 * Module dependencies.
 */
 
var program = require('commander');
var Wordnik = require('wordnik');
var colors = require('colors');

var api_key = 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';

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
    wn.definitions(program.def, function(e, defs) {
    	if(e) {
    		console.log(e);
    	} else {
    		console.log(defs);
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
    		console.log(word);
    	}
    });
    break;
  case 'ex':
    wn.examples(program.ex, function(e, examples) {
    	if(e) {
    		console.log(e);
    	} else {
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
