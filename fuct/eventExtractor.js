module.exports = async (Event, content) => {
  try {
    let event = await Event.process('zh', content);
    console.log(content + "\nevent: " + event);
  } catch(err) {
    console.error(err);
  } finally {
    return event;
  }
}