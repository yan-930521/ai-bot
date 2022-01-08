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

const setting = require("./Data/setting.json"); // 系統上的設定
const data = require('./Data/data.json'); // 初始資料
const data_brain = require('./Data/brain.json'); // 初始資料
const grammar = require('./Data/grammar.json'); // 替代詞
const config = require('./config.js'); // 功能集

const ctl = require('./encapsulate.js')
const Control = new ctl();
var Mood;
var Event;
var Brain

var Msgs = {};
var isready = false;
client.on('ready', async () => {
  console.clear();
  console.log(client.user.tag + " link start!");
  Mood = await Control.createNlp('mood.nlp');
  Event = await Control.createNlp('event.nlp');
  Brain = new Control.NeuralNet();
  Brain.init(2, 5, 1)
  Brain.train(data_brain, 500, 0.5, 0.1);

  isready = true;
  console.log("Control is ready!")
});

client.on('message', async msg => {
  try {
    if (!isready) return;
    if (msg.content.startsWith(setting.prefix)) return;
    if (msg.author.bot) return;

    // 抓出重複的訊息

    let auth = Msgs[msg.author.id];
    if (auth) {
      let msgData = Msgs[msg.author.id][msg.content];
      if (msgData) {
        let ans = config.repeat[random(conig.repeat.length)];
        for (let t in config.tags) {
          let r = new RegExp(t, "g");
          ans = ans.replace(r, config.tags[t](msgData));
        }
        msg.channel.send(ans);
        return;
      }
    } else {
      Msgs[msg.author.id] = {};
    }

    Msgs[msg.author.id][msg.content] = new Control.Msg();

    setTimeout(() => {
      delete Msgs[msg.author.id][msg.content];
    }, setting['time_to_forget']);

    // 判別情感
    let mood = Control.moodExtractor(Mood, msg.content);

    // 事件提取
    let event = Control.eventExtractor(Event, msg.content);

    // 語法決定
    let action = Control.actionPredictor(Brain, data, mood, event);

    //Control.act(Control, data, action, event, mood, msg.content);
  } catch (err) {
    console.error(err);
  }

});


client.on('message', async msg => {
  if (!isready) return;
  if (msg.author.id != "823885929830940682") return;
  if (msg.author.bot) return;
  if (!msg.content.startsWith(setting.prefix)) return;

  let cmd = msg.content.replace(setting.prefix, "")
  if (cmd.startsWith("train")) {
    let str = cmd.replace('train', "");
    let mood = str.split(' ')[0];
    let event = str.split(' ')[1];

    Mood = await Control.trainNlp(Mood,  data, type, mood, str);
    Event = await Control.trainNlp(Event, data, type, event, str);
    return;
  }
  if (cmd.startsWith("list")) {
    let str = "```\n";
    for(let d in data){
      str += `< ${d} >\n`;
      for(let i in data[d]) {
        str += ` ${data[d][i].num}. ${i}\n`;
      }
    }
    str += "```";
    msg.channel.send(str);
    return;
  }
});