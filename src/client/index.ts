import { dbConnect } from './../database/index';
import { Client, GatewayIntentBits, ActivityType  } from 'discord.js'
import { registerEvents } from '../utils'
import events from '../events'
import keys from '../keys'
const fs = require('fs');

export let blackcards: string[] = [];
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
})

fs.readFile('src/client/cah.json', 'utf8', (err: any, data: any) => {
  if (err) {
    console.error(err);
    return;
  }
  const json = JSON.parse(data);
  json.map((obj: any) => {
    blackcards = blackcards.concat(obj.black);
  })
  blackcards = blackcards.filter((obj: any) => {
    return obj.pick === 1
  })
  blackcards = blackcards.map((obj: any) => { return obj.text.replace(/_/g, '[BLANK]');;});
  //console.log(blackcards)
});

registerEvents(client, events)

client.login(keys.clientToken).then(async () => {
    let serverCount = await client.guilds.cache.size // update the chache for accurate info.
    
    client?.user?.setPresence({
      activities: [{ name: `💬 and quoting ${serverCount} servers`, type: ActivityType.Watching}],
      status: 'dnd',
    })
  })
  .catch((err) => {
    console.error('[Login Error]', err)
    process.exit(1)
  })

dbConnect();