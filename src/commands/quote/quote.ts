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
      .setRequired(true)
  )

export default command(meta, async ({ interaction }) => {

  const messageid:string = interaction.options.getString('messageid')!
  const guildId = interaction.guildId
  const channelId = interaction.channelId
  let Channel: any = await interaction.client.channels.fetch(channelId);
  const messages = await Channel!.messages.fetch();
  let target:any = Array.from(messages.values())
  target = target.filter((msg:any) => msg.id == messageid)[0]
  console.log("message content: " + target.content)
  insertQuote(target.content)
  console.log(`guildID:${guildId}\nchannel:${channelId}`)
  
  return interaction.reply({
    ephemeral: false,
    content: `"${target.content}" has been quoted 👌` // messageid ?? 'Pong! 🏓'
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

    const temp = db.db("Default");
    await temp.collection("quotes").insertOne({quote: quote})
    .catch((err: any) => console.log(err))
    console.log("in function")
}
dbConnect();