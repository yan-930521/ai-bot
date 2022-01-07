module.exports = async (Mood, content) => {
  try {
    let mood = await Mood.process('zh', content);
    console.log(content + "\nmood: " + mood);
  } catch(err) {
    console.error(err);
  } finally {
    return mood;
  }
  
}