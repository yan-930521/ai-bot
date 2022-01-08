module.exports = async (model, data, type, intent, str) => {
  console.log(`trainNlp ${type} ${intent}\n${str}`);
  if(type == "mood") {
    if(data.mood[intent]) {
      model.addDocument('zh', str, intent);
      await model.train();
      console.log(`training finish`);
    }
  } else if(type == "event") {
    if(data.event[intent]) {
      model.addDocument('zh', str, intent);
      await model.train();
      console.log(`training finish`);
    }
  }
  return model;
}