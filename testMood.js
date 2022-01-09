(async () => {
  const ctl = require('./encapsulate.js')
  const data = require('./Data/data.json');
  for(let d in data.mood) {
    console.log(`${data.mood[d].num}. ${d}`)
  }
  const Control = new ctl();
  var Mood = await Control.createNlp('mood.nlp');
  let ans = await Control.moodExtractor(Mood, "你好阿")
  console.log(ans);
})()