module.exports = async (model,intent, str) => {
  model.addDocument('zh', str, intent);
  await model.train();
  return model;
}