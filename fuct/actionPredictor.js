module.exports = (Brain, data, mood, event) => {
  let pat = [data.mood[mood].num, data.event[event].num];
  let action = Brain.test(pat);
  console.log(`action :${Math.round(config.actions[action])}`)
  return Math.round(config.actions[action]);
}