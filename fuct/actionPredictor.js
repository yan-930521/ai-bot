const config = require('./config.js');
module.exports = (Brain, mood, event) => {
  let pat = [config.moods[mood], config.events[event]];
  let action = Brain.test(pat);
  return config.actions[action];
}