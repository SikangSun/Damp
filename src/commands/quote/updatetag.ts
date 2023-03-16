import { EmbedBuilder, Client } from 'discord.js';
import { QuoteDefault } from './../../types/quote';
import { embedQuote, findFailed } from './../../utils/embed';
import { updateTagQuote } from './../../database';
import { SlashCommandBuilder, InteractionWebhook } from 'discord.js';
import { command } from '../../utils';
import { GatewayIntentBits } from 'discord.js';

require('dotenv').config();


const tagedit = new SlashCommandBuilder()
  .setName('updatetag')
  .setDescription('Loop up a quote and change its tag')
    .addStringOption(option =>
    option.setName('identifier')
        .setDescription('Choose to look up by tag or id here')
        .setRequired(true)
        .addChoices(
            { name: "tag", value: "tag" },
            { name: "id", value: "id"},
    ))
    .addStringOption(option =>
    option.setName('input')
        .setDescription('Enter your tag or id')
        .setRequired(true)
        .setMaxLength(30)
        .setMinLength(1)
    )
    .addStringOption((option) =>
    option
      .setName('new_tag')
      .setDescription('Enter the updated the tag')
      .setMinLength(1)
      .setMaxLength(20)
      .setRequired(true)
    )

export default command(tagedit, async ({ interaction }) => {
    console.log("edit tag");
    const identifier: string = interaction.options.getString('identifier')!;
    const input: string = interaction.options.getString('input')!;
    const newtag: string = interaction.options.getString('new_tag')!;

    const result = await updateTagQuote(identifier, newtag, input, interaction.guildId!);
    // console.log(quote)
    if (!result) { //error
        return interaction.reply({
            ephemeral: false,
            embeds: [new EmbedBuilder()
                .setColor(0xbe2e1b)
                .setDescription(`Quote with ${ identifier === "tag" ? `tag ${input}` : `message id ${input}`} does not exist. Update failed`)],
        });

    }
    
    return interaction.reply({
        ephemeral: false,
        embeds: [new EmbedBuilder().setColor(0x49be25).setDescription(`Your tag has been updated!`)],
    });
})
