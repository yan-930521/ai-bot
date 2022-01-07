const config = require('./config.js');
module.exports = (Control, action, event, mood, msg) => {
  let actionFunction = config.actionGetter[action];
  let eventReply = config.eventResponder[event][Control.random(config.eventResponder[event].length)]
  let moodReply = config.moodResponder[mood][Control.random(config.moodResponder[mood].length)]
  actionFunction(eventReply, moodReply, msg)
}