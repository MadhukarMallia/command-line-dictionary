#!/usr/bin/env node

/**
 * Module dependencies.
 */
 
var program = require('commander');
var wordnikAPICalls = require('./modules/calls');

/* A help guide */
program
  .version('0.0.1')
  .usage('[options] [word]')
  .option('def <word>', 'Display definitions of a word.')
  .option('syn <word>', 'Display synonyms of a word.')
  .option('ant <word>', 'Display antonyms of a word.')
  .option('ex <word>', 'Display examples of a word.')
  .option('dict <word>', 'Display examples of a word.')
  .option('<word>, dict <word>', 'Display all above details for a word.')
  .option('word-of-the-day', 'Display all above details of word of the day')
  .option('play', 'Play the Word Game')
  .parse(process.argv);

var expression = process.argv[2];

switch(expression) {
  case 'def':
    wordnikAPICalls.getDefinition(expression, program.def);
    break;
  case 'syn':
    wordnikAPICalls.getSynonyms(expression, program.syn);
    break;
  case 'ant':
    wordnikAPICalls.getAntonyms(expression, program.ant);
    break;
  case 'ex':
    wordnikAPICalls.getExamples(expression, program.ex);
    break;
  case 'dict':
    wordnikAPICalls.getCompleteDetails(expression, program.dict);
    break;
  case 'play':
    wordnikAPICalls.playTheWordGame();
    break;
  case undefined:
    wordnikAPICalls.getWordOfTheDay('wod');
    break;
  default:
    console.log('default');
    break;
};
