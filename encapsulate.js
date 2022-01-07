module.exports = class {
  constructor(){
    let fuct = "./fuct/";
    this.random = require(fuct+'random.js');
    this.moodExtractor = require(fuct+'moodExtractor.js');
    this.eventExtractor = require(fuct+'eventExtractor.js');this.actionPredictor = require(fuct+'actionPredictor.js');
    this.act = require(fuct+'act.js');
    this.createNlp = require(fuct+'createNlp.js');
    this.trainNlp = require(fuct+'trainNlp.js');
    this.NeuralNet = require(fuct+'NeuralNet.js');
    this.Msg = require(fuct+'Msg.js');
  }
}