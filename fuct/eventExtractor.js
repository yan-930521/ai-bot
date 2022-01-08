module.exports = async (Event, content) => {
  try {
    var event = await Event.process('zh', content);
    console.log(content + "\nevent: " + event.intent);
  } catch(err) {
    console.error(err);
  } finally {
    return event;
  }
}