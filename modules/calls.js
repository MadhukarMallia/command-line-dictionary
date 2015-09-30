'use strict';

var Wordnik = require('wordnik');
var R = require('ramda');
var async = require('async');
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
  getCompleteDetails: getCompleteDetails
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
  var completeWordDetails = []
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

module.exports = calls;