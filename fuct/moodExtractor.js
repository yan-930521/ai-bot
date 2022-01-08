module.exports = async (Mood, content) => {
  try {
    var mood = await Mood.process('zh', content);
    console.log(content + "\nmood: " + mood.intent);
  } catch(err) {
    console.error(err);
  } finally {
    return mood;
  }
}