import { SlashCommandBuilder, InteractionWebhook } from 'discord.js'
import { command } from '../../utils'
import { Client, GatewayIntentBits } from 'discord.js'
import { MongoClient } from 'mongodb'
require('dotenv').config();

interface TextChannel {
  messages: MessageManager
}
interface MessageManager {

}


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
  console.log(target.content)
  // let filtered = messages.filter((msg) => msg.content.startsWith(wf));
  console.log(`guildID:${guildId}\nchannel:${channelId}`)
  db(target.content);
  return interaction.reply({
    ephemeral: false,
    content:target.content // messageid ?? 'Pong! 🏓'
  })
})

const db = async (quote: string) => { 
  const obj: any = {quote: quote}
  MongoClient.connect(process.env.MONGODB_URL!, {})
  .then(
  (err?:any, db?:any) => {
    if (err) throw err;
    const dbo:any = db.db("default");
    dbo.collection("quotes").insertOne(obj, function(err:any, res:any) {
      if (err) throw err;
      console.log("1 quote added");
      db.close();
      })
    })
}