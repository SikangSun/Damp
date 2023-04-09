import { EmbedBuilder, Client, Interaction, SlashCommandBuilder, SlashCommandSubcommandBuilder, ChatInputCommandInteraction, Message, InteractionResponse } from 'discord.js';
import { QuoteDefault, QuoteImage, Role } from './../../types/quote';
import { getAllQuotes, getQuote } from './../../database/index';
import { command, embedQuote, findFailed, idOrTag, Reply, isPublicServerOn, getUserRole } from '../../utils';

const emoji = '🆗';
const getone = new SlashCommandBuilder()
  .setName('get')
  .setDescription("Get one message with tag or id")
  .addStringOption((option: any) =>
    option
      .setName('input')
      .setDescription('Enter the tag or the id of the quote you want to look up')
      .setMinLength(1)
      .setMaxLength(30)
      .setRequired(true)
  );



export default command(getone, async ({ interaction }) => {
    return await one(interaction);
})

const one = async (interaction: ChatInputCommandInteraction) => {
    const input: string = interaction.options.getString('input')!
    const quote: any = await getQuote(input, interaction.guildId!)
        .catch((err: any) => {return findFailed(interaction, input, 105)})
    
    if (quote) {
        const embed: EmbedBuilder = await embedQuote(quote);
        return interaction.reply({
            ephemeral: false,
            embeds: [embed],
        });
    }
    
    findFailed(interaction, input, 101)
}

