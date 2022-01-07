module.exports = async (Event, content) => {
  let event = await Event.process('zh', content);
  console.log(content + "\nevent: " + event);
  return event;
}