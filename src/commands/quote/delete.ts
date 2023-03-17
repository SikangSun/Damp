import { EmbedBuilder, Client, SelectMenuInteraction } from 'discord.js';
import { QuoteDefault } from './../../types/quote';
import { embedQuote, findFailed } from './../../utils/embed';
import { deleteOneQuote } from './../../database/index';
import { SlashCommandBuilder, InteractionWebhook } from 'discord.js';
import { command, idOrTag } from '../../utils';

require('dotenv').config();


const deleteone = new SlashCommandBuilder()
  .setName('delete')
  .setDescription('Delete quote by tag or id')
  .addStringOption(option =>
    option.setName('input')
        .setDescription('Enter the tag or the id')
        .setRequired(true)
        .setMaxLength(30)
        .setMinLength(1)
    )

export default command(deleteone, async ({ interaction }) => {
    console.log("delete");
    const input: string = interaction.options.getString('input')!
    const identifier = idOrTag(input);
    const quote = await deleteOneQuote(identifier, input, interaction.guildId!);

    if (quote) {
        return interaction.reply({
            ephemeral: false,
            embeds: [new EmbedBuilder().setColor(0x49be25).setDescription(`Your quote \"${input}\" has been deleted!`)],
        });
    }
    
    return interaction.reply({
        ephemeral: false,
        embeds: [new EmbedBuilder()
            .setColor(0xbe2e1b)
            .setDescription(`Quote with ${ identifier === "tag" ? `tag ${input}` : `id ${input}`} does not exist. Delete failed`)],
    });
})
