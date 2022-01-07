/**
 * Copyright 2021 yan-930521  All Rights Reserved.
 */

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('link start!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

const Discord = require('discord.js');

const client = new Discord.Client();

client.login(process.env.token);

const setting = require("./setting.json");
const data = require('./data.json');
const config = require('./config.js');

const Control = new require('./encapsulate.js')();

var Mood = Control.createNlp('mood.nlp');
var Event = Control.createNlp('event.nlp');
var Brain = new Control.NeuralNet();
// Brain.init(2, 5, 1)
var Msgs = {};

client.on('ready',()=>{
  console.clear();
  console.log(client.user.tag + " link start!");

});

client.on('message', async msg => {
  let msgData = Msgs[msg.author.id][msg.content];
  // 抓出重複的訊息
  if(msgData) {
    let ans = config.repeat[random(conig.repeat.length)];
    for (let t in config.tags) {
      let r = new RegExp(t, "g");
      ans = ans.replace(r, config.tags[t](msgData));
    }
    msg.channel.send(ans);
    return;
  }
  Msgs[msg.author.id][msg.content] = new Msg();
  setTimeout(()=>{delete Msgs[msg.author.id][msg.content]}, setting['time_to_forget']);

  // 判別情感
  let mood = Control.moodExtractor(Mood, msg.content);

  // 事件提取
  let event = Control.eventExtractor(Event, msg.content);

  let action = Control.actionPredictor(Brain, mood, event);
  Control.act(Control, action, event, mood, msg)
});


client.on('message',async msg=>{
  if(msg.author.id != "823885929830940682") return;
  if(!msg.content.startsWith(setting.prefix)) return;
  let cmd = msg.content.replace(setting.prefix, "")
  if(cmd.startsWith("train")) {
    let str = cmd.replace('train', "");
    let mood = str.split(' ')[0];
    let event = str.split(' ')[1];
    // 過濾打錯的字
    Mood = await Control.trainNlp(Mood, mood, str);
    Event = await Control.trainNlp(Event, event, str);
    return;
  }
  if(cmd.startsWith("mood")) {
    let str = cmd.replace('train', "");
    let mood = str.split(' ')[0];
    // 過濾打錯的字
    Mood = await Control.trainNlp(Mood, mood, str);
    return;
  }
  if(cmd.startsWith("event")) {
    let str = cmd.replace('train', "");
    let event = str.split(' ')[0];
    // 過濾打錯的字
    Event = await Control.trainNlp(Event, event, str);
    return;
  }
});