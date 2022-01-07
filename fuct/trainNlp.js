module.exports = async (model, config, intent, str) => {
  if(config.moods[intent] || config.moods[intent]) {
    console.log(`trainNlp ${intent}\n${str}`);
    model.addDocument('zh', str, intent);
    await model.train();
  }
  return model;
}