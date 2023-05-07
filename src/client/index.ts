import { dbConnect } from './../database/index';
import { Client, GatewayIntentBits, ActivityType  } from 'discord.js'
import { registerEvents } from '../utils'
import events from '../events'
import keys from '../keys'
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
})


registerEvents(client, events)

client.login(keys.clientToken).then(async () => {
    let serverCount = await client.guilds.cache.size // update the chache for accurate info.
    
    client?.user?.setPresence({
      activities: [{ name: `💬 and quoting ${serverCount} servers`, type: ActivityType.Watching}],
      status: 'dnd',
    })
  })
  .catch((err: any) => {
    console.error('[Login Error]', err)
    process.exit(1)
  })

dbConnect();