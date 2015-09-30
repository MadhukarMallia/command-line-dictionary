'use strict';

var Wordnik = require('wordnik');
var R = require('ramda');
var async = require('async');
var display = require('./display.js');

var api_key = '69cb40606211293cb7e81018c4d0b231e657a10ae78c924c9';

var wn = new Wordnik({
  api_key: api_key
});

exports.getDefinition = function(word) {
	wn.definitions(word, function(e, defs) {
    if(e) {
      console.log(e);
    } else {
      var definitions = R.pluck('text', defs);
      display.intermediateFunction(definitions, word);
      return definitions;
    }
  });
};

exports.getSynonyms = function(word) {
  wn.relatedWords(word, {
    relationshipTypes: 'synonym'
  }, function(e, syns) {
    if(e) {
      console.log(e);
    } else {
      var synonyms = R.pluck('words', syns);
      if (R.isNil(synonyms[0])) {
        if (typeof word !== 'undefined') {
          // intermediateFunction([], c);
        }
        return null;
      } else {
        //console.log(typeof program.syn !== 'undefined');
        if (typeof word !== 'undefined') {
          display.intermediateFunction(synonyms[0], word);
        }
        return synonyms[0];
      }
    }
  });
};

exports.getAntonyms = function(word) {
  wn.relatedWords(word , {
    relationshipTypes: 'antonym'
  }, function(e, ants) {
    if(e) {
      console.log(e);
    } else {
      var antonyms = R.pluck('words', ants);
      if (R.isNil(antonyms[0])) {
        if (typeof word !== 'undefined') {
          display.intermediateFunction(antonyms, word);
        }
        return null;
      } else {
        //console.log(R.isNil(program.ant));
        if (typeof word !== 'undefined') {
          display.intermediateFunction(antonyms[0], word);
        }
        return antonyms[0];
      }
    }
  });
};

exports.getWordOfTheDay = function() {
  var wordOfDay = [];
  wn.wordOfTheDay(function(e, word) {
    if(e) {
      console.log(e);
    } else {
      wordOfDay.word = word.word;
      wordOfDay.definitions = R.pluck('text', word.definitions);
      wordOfDay.examples = R.pluck('text', word.examples);

      async.parallel([
        function(callback) {
          wordOfDay.synonyms = getSynonyms(word.word);
          callback();
        },
        function(callback) {
          wordOfDay.antonyms = getAntonyms(word.word);
          callback();
        }
      ], function () {
        console.log(wordOfDay);
      });
    }
  });
};

exports.getExamples = function(word) {
  wn.examples(word, function(e, examples) {
    if(e) {
      console.log(e);
    } else {
      if (R.isNil(examples.examples)) {
        display.intermediateFunction([], program.ex);
        return null;
      } else {
        var examplesArray = R.pluck('text', examples.examples);
        display.intermediateFunction(examplesArray, word);
        return examplesArray;
      }
    }
  });
};

exports.getCompleteDetails = function(word) {
  var completeWordDetails = []
  async.series([
    function(callback) {
      expression = 'syn';
      completeWordDetails.synonyms = getSynonyms(word);
      callback();
    },
    function(callback) {
      expression = 'ant'
      completeWordDetails.antonyms = getAntonyms(word);
      callback();
    },
    function(callback) {
      expression = 'def';
      completeWordDetails.definitions = getDefinition(word);
      callback();
    },
    function(callback) {
      expression = 'ex';
      completeWordDetails.examples = getExamples(word);
      callback();
    }
  ]);
};
// exports.