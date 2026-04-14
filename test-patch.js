const React = require('react');
const { Text } = require('react-native');

console.log(Text.render ? "We can patch render" : "No render property");
