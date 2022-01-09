(async () => {
  const ctl = require('./encapsulate.js')
  const Control = new ctl();
  var Mood = await Control.createNlp('mood.nlp');
  let ans = await Control.moodExtractor(Mood, "你好阿")
  console.log(ans);
})()