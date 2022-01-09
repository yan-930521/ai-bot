module.exports = (model, data, type, intent, str) => {
  console.log(`trainNlp ${type} ${intent}\n${str}`);
  if(type == "mood") {
    if(data.mood[intent]) {
      model.addDocument('zh', str, intent);
    }
  } else if(type == "event") {
    if(data.event[intent]) {
      model.addDocument('zh', str, intent);
    }
  }
  return model;
}