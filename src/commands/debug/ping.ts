import { SlashCommandBuilder, InteractionWebhook } from 'discord.js'
import { command } from '../../utils'
import { Client, GatewayIntentBits } from 'discord.js'
import { MongoClient } from 'mongodb'
require('dotenv').config();

let db: any


const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages
  ],
})

const meta = new SlashCommandBuilder()
  .setName('quote')
  .setDescription('quote your friends.')
  .addStringOption((option) =>
    option
      .setName('messageid')
      .setDescription('Provide the bot with the ID of the message you want to quote.')
      .setMinLength(1)
      .setMaxLength(2000)
      .setRequired(false)
  )

export default command(meta, async ({ interaction }) => {
  // console.log(interaction)

  const messageid:string = interaction.options.getString('messageid')!
  const guildId = interaction.guildId
  const channelId = interaction.channelId
  let Channel: any = await interaction.client.channels.fetch(channelId);
  //console.log(Channel)
  // const iw = new InteractionWebhook(client, interaction.applicationId, interaction.id);
  // const target = await iw.fetchMessage(messageid)
  // console.log(target.content)

  // .then(message => console.log(message.content))
  // .catch(console.error);
  const messages = await Channel!.messages.fetch();
  let target:any = Array.from(messages.values())
  target = target.filter((msg:any) => msg.id == messageid)[0]
  console.log("message content: " + target.content)
  console.log(target)
  insertQuote(target.content)
  // let filtered = messages.filter((msg) => msg.content.startsWith(wf));
  console.log(`guildID:${guildId}\nchannel:${channelId}`)
  
  return interaction.reply({
    ephemeral: false,
    content:target.content // messageid ?? 'Pong! 🏓'
  })
})

const dbConnect = async () => { 
  MongoClient.connect(process.env.MONGODB_URL!, {})
  .then(
  (database?:any) => {
    db = database

  })
  .catch(console.error)
}

const insertQuote = async ( quote: string ) => {
    console.log("in function")
    const temp = db.db("Default");
    await temp.collection("quotes").insertOne({quote: quote})
    .catch((err: any) => console.log(err))
    
}
dbConnect();