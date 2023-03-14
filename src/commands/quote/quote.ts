import { QuoteDefault } from './../../types/quote';
import { insertQuote } from '../../database/index';
import { SlashCommandBuilder, InteractionWebhook } from 'discord.js'
import { command } from '../../utils'
import { Client, GatewayIntentBits } from 'discord.js'

require('dotenv').config();

// let db: any
const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages
  ],
})

const quote = new SlashCommandBuilder()
  .setName('quote')
  .setDescription('quote your friends.')
  .addStringOption((option) =>
    option
      .setName('messageid')
      .setDescription('Provide the bot with the ID of the message you want to quote.')
      .setMinLength(1)
      .setMaxLength(30)
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('tag')
      .setDescription('Give an unique tag for this quote for look up later')
      .setMinLength(1)
      .setMaxLength(15)
      .setRequired(false)
  )

export default command(quote, async ({ interaction }) => {
  const messageid: string = interaction.options.getString('messageid')!
  const tag: string = interaction.options.getString('tag')!
  const guildId: string = interaction.guildId!
  const channelId: string = interaction.channelId!
  let Channel: any = await interaction.client.channels.fetch(channelId);
  const message = await Channel!.messages.fetch(messageid);
  //console.log(message.author)
  // console.log(interaction)
 
  const quoteObject: QuoteDefault = {
    content: <string>message.content,
    timestamp: <Date>message.createdAt,
    user: <string>message.author.id,
    message: messageid,
    channel: channelId,
    guild: guildId,
    quoter: interaction.user.id,
    tag: tag
  };
  await insertQuote(quoteObject);

  //console.log(`guildID:${typeof guildId}\nchannel:${channelId}`)
  
  return interaction.reply({
    ephemeral: false,
    content: `"${quoteObject.content}" has been quoted 👌` 
  })
})

