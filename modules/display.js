'use strict';

var R = require('ramda');
var colors = require('colors');

// var expression = process.argv[2];

var display = {
	intermediateFunction: intermediateFunction,
	getDescriptionText: getDescriptionText
};

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
}, {
  'key_word': 'wod',
  'description': 'Word of the day is-'
}, {
  'key_word': 'dict',
  'description': 'Complete details of the word-',
  'no_data_present_msg': 'No detail is present for the word-'
}];

function getDescriptionText(option) {
  return R.pluck('description', R.filter(R.propEq('key_word', option), descriptionList));
}

function getNoDataMessage(option) {
  return R.pluck('no_data_present_msg', R.filter(R.propEq('key_word', option), descriptionList));
}

function anotherIntermediateFunction() {

}

function intermediateFunction (option, result, userInput) {
  if (result.length  < 1 || typeof result === undefined) {
    console.log(getNoDataMessage(option)[0].cyan + ' ' + userInput.yellow);
  } else {
    console.log(getDescriptionText(option)[0].blue + ' ' + userInput.yellow + ':');
    result.forEach (function (value, index) {
      console.log(R.toString(index + 1).blue + ': '.blue + value.green);
    });
  }
};

module.exports = display;