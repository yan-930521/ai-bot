module.exports = async (Mood, content) => {
  let mood = await Mood.process('zh', content);
  console.log(content + "\nmood: " + mood);
  return mood;
}