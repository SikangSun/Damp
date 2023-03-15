import { insertionFailed } from './../../utils/embed';
import { QuoteDefault, QuoteImage } from './../../types/quote';
import { insertQuote, getTagQuote } from '../../database/index';
import { SlashCommandBuilder, InteractionWebhook } from 'discord.js'
import { command } from '../../utils'
import { Client, GatewayIntentBits } from 'discord.js'

require('dotenv').config();

const quote = new SlashCommandBuilder()
  .setName('quoteimage')
  .setDescription('quote a link to an image.')
  .addStringOption((option) =>
    option
      .setName('link')
      .setDescription('Link to your image (For Discord images, right click and press \"Copy Link\")')
      .setMinLength(1)
      .setMaxLength(150)
      .setRequired(true)
  )
  .addStringOption((option) =>
  option
    .setName('title')
    .setDescription('Gave this image a title')
    .setMinLength(1)
    .setMaxLength(50)
    .setRequired(false)
)
  .addStringOption((option) =>
    option
      .setName('tag')
      .setDescription('Give an unique tag for this quote for look up later')
      .setMinLength(1)
      .setMaxLength(20)
      .setRequired(false)
  )

export default command(quote, async ({ interaction }) => {
  const link: string = interaction.options.getString('link')!
  const title: string = interaction.options.getString('title')!
  const tag: string = interaction.options.getString('tag')!

  if (tag) { //checking tag uniqueness
    const unique: QuoteDefault | undefined = await getTagQuote(tag);
    if (unique) {
      return interaction.reply({
        ephemeral: false,
        embeds: [insertionFailed(tag)]
      })
    }
  }

  //console.log(message.author)
  //console.log(interaction, "asdf")
 
  const quoteObject: QuoteImage = {
    type: "image",
    link: link,
    timestamp: new Date(),
    quoter: interaction.user.id,
    title: title,
    tag: tag
  };
  await insertQuote(quoteObject);

  
  return interaction.reply({
    ephemeral: false,
    content: `"${quoteObject.title}" has been quoted 👌` 
  })
})

