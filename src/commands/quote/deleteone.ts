import { EmbedBuilder, Client, SelectMenuInteraction } from 'discord.js';
import { QuoteDefault } from './../../types/quote';
import { embedQuote, findFailed } from './../../utils/embed';
import { deleteOneQuote } from './../../database/index';
import { SlashCommandBuilder, InteractionWebhook } from 'discord.js';
import { command } from '../../utils';
import { GatewayIntentBits } from 'discord.js';

require('dotenv').config();


const deleteone = new SlashCommandBuilder()
  .setName('delete')
  .setDescription('Delete quote by tag or id')
  .addStringOption(option =>
    option.setName('identifier')
        .setDescription('Choose to look up by tag or message id here')
        .setRequired(true)
        .addChoices(
            { name: "tag", value: "tag" },
            { name: "message id", value: "id"},
    ))
    .addStringOption(option =>
		option.setName('input')
			.setDescription('Enter your tag or message id')
			.setRequired(true)
            .setMaxLength(30)
            .setMinLength(1)
	)

export default command(deleteone, async ({ interaction }) => {
    console.log("delete");
    const identifier: string = interaction.options.getString('identifier')!
    const input: string = interaction.options.getString('input')!

    const quote = await deleteOneQuote(identifier, input);
    // console.log(quote)
    
    if (quote) {
        return interaction.reply({
            ephemeral: false,
            embeds: [new EmbedBuilder().setColor(0x49be25).setDescription(`Your quote has been deleted!`)],
        });
    }
    
    return interaction.reply({
        ephemeral: false,
        embeds: [new EmbedBuilder()
            .setColor(0xbe2e1b)
            .setDescription(`Quote with ${ identifier === "tag" ? `tag ${input}` : `message id ${input}`} does not exist. Delete failed`)],
    });
})
