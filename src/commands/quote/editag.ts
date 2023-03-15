import { EmbedBuilder, Client } from 'discord.js';
import { QuoteDefault } from './../../types/quote';
import { embedQuote, findFailed } from './../../utils/embed';
import { getAllQuotes, getTagQuote } from './../../database/index';
import { SlashCommandBuilder, InteractionWebhook } from 'discord.js';
import { command } from '../../utils';
import { GatewayIntentBits } from 'discord.js';

require('dotenv').config();


const tagedit = new SlashCommandBuilder()
  .setName('tagedit')
  .setDescription('Loop up a quote and change its tag')
  .addStringOption((option) =>
    option
      .setName('tag')
      .setDescription('Enter the tag for the quote you want to look up')
      .setMinLength(1)
      .setMaxLength(20)
      .setRequired(True)
  )


export default command(getone, async ({ interaction }) => {
    console.log("getone");
    const tag: string = interaction.options.getString('tag')!

    const quote = await getTagQuote(tag);
    // console.log(quote)
    if (quote) {
        const embed: EmbedBuilder = await embedQuote(quote);
        return interaction.reply({
            ephemeral: false,
            embeds: [embed],
        });
    }
    
    return interaction.reply({
        ephemeral: false,
        embeds: [findFailed(tag)],
    });
})
