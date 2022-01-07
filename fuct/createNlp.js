const { NlpManager } = require('node-nlp');
module.exports = async (path) => {
  let manager = new NlpManager();
  await manager.load("./models/" + path);
  return manager;
}