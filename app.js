var prompt = require('prompt');

var schema = {
  properties: {
    name: {
    	description: 'Enter your name',
      pattern: /^[a-zA-Z\s\-]+$/,
      message: 'Name must be only letters, spaces, or dashes',
      required: true
    },
    password: {
    	description: 'Enter your password',
      hidden: true
    }
  }
};

prompt.start();

prompt.get(schema, function (err, result) {
  console.log('Command-line input received:');
  console.log('  username: ' + result.name);
  console.log('  email: ' + result.password);
});