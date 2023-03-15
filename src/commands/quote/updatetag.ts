import { EmbedBuilder, Client } from 'discord.js';
import { QuoteDefault } from './../../types/quote';
import { embedQuote, findFailed } from './../../utils/embed';
import { getAllQuotes, getTagQuote, updateTagQuote } from './../../database';
import { SlashCommandBuilder, InteractionWebhook } from 'discord.js';
import { command } from '../../utils';
import { GatewayIntentBits } from 'discord.js';

require('dotenv').config();


const tagedit = new SlashCommandBuilder()
  .setName('updatetag')
  .setDescription('Loop up a quote and change its tag')
  .addStringOption((option) =>
  option
    .setName('new_tag')
    .setDescription('Enter the updated the tag')
    .setMinLength(1)
    .setMaxLength(20)
    .setRequired(true)
)
  .addStringOption((option) =>
    option
      .setName('old_tag')
      .setDescription('Enter the tag for the quote you want to look up')
      .setMinLength(1)
      .setMaxLength(20)
      .setRequired(false)
  )
  .addStringOption((option) =>
  option
    .setName('message_id')
    .setDescription('If there is no tag, enter the ID of the quote you want to look up')
    .setMinLength(1)
    .setMaxLength(30)
    .setRequired(false)
)

export default command(tagedit, async ({ interaction }) => {
    console.log("edit tag");
    const tag: string = interaction.options.getString('old_tag')!;
    const id: string = interaction.options.getString('message_id')!;
    if (!tag && !id) {
        return interaction.reply({
            ephemeral: false,
            embeds: [new EmbedBuilder().setColor(0x6375a1).setDescription(`Request failed: no tag and id`)]
        })
    }

    const newtag: string = interaction.options.getString('new_tag')!;
    const result = await updateTagQuote(tag, newtag, id);
    // console.log(quote)
    if (!result) { //check tag uniqueness
        return interaction.reply({
            ephemeral: false,
            embeds: [findFailed(tag)]
        })

    }
    
    return interaction.reply({
        ephemeral: false,
        embeds: [new EmbedBuilder().setColor(0x49be25).setDescription(`Your tag has been updated!`)],
    });
})
