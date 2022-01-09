(async () => {
  console.log("start");
  const ctl = require('./encapsulate.js')
  const Control = new ctl();
  const data = require('./Data/data.json');
  const data2 = require('./Data/mood.data.json')
  let moods = [];
  let event = [];
  let l = [
    "無",
    "喜",
    "哀",
    "討厭",
    "怒",
    "樂"
  ];
  // 0為Other，1為Like，2為Sadness，3為Disgust，4為Anger，5為Happiness
  for (let d in data.mood)
    moods.push(d);
  for (let d in data.event)
    event.push(d);

  var Mood = await Control.createNlp('mood.nlp');

  for (let da in data2) {
    if (data2[da].type == 0) continue;
    //model, data, type, intent, str
    Mood = Control.trainNlp(Mood, data, "mood", l[data2[da].type], data2[da].str.replace(/ /g,""));
  }
  await Mood.train();
  await Mood.save('./models/mood.nlp');
  console.log("finish")

  let ans = await Control.moodExtractor(Mood, "你好阿")
  console.log(ans)
  let ans2 = await Control.moodExtractor(Mood, "太難過了吧")
  console.log(ans2)
})()