import { EmbedBuilder, Client, Interaction } from 'discord.js';
import { QuoteDefault, QuoteImage } from './../../types/quote';
import { embedQuote, findFailed } from './../../utils/embed';
import { getAllQuotes, getQuote } from './../../database/index';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { command } from '../../utils';
import { GatewayIntentBits } from 'discord.js';

require('dotenv').config();


const getone = new SlashCommandBuilder()
  .setName('get')
  .setDescription('Get quote by tag or id')
  .addSubcommand((option: SlashCommandSubcommandBuilder) => {//subcommand get all
    return option
    .setName("all")
    .setDescription("Get all messages")
  })
  .addSubcommand((option: SlashCommandSubcommandBuilder) => {//subcommand get one
    return option
    .setName("quote")
    .setDescription("Get one message with tag or id")
    .addStringOption((option: any) =>
    option
      .setName('tag_or_id')
      .setDescription('Enter the tag or the id of the quote you want to look up')
      .setMinLength(1)
      .setMaxLength(30)
      .setRequired(true)
  )
  })



export default command(getone, async ({ interaction }) => {
    const subcommand = interaction.options.getSubcommand();
    console.log("getone");
    if (subcommand === "quote") {
        return await one(interaction)
      }
      else if (subcommand === "all") {
        return all(interaction)
      }
 
})

const one = async (interaction: ChatInputCommandInteraction) => {
    const input: string = interaction.options.getString('tag_or_id')!
    const quote = await getQuote(input, interaction.guildId!);
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
        embeds: [findFailed(input)],
    });
}

const all = async (interaction: ChatInputCommandInteraction) => {
    console.log("getall");
    const content: any = await getAllQuotes(interaction.guildId!);

    await interaction.reply(
        {
            ephemeral: true,
            content: `Here is all your quotes` 
        }
    )

    content.sort((a:QuoteDefault | QuoteImage, b: QuoteDefault | QuoteImage) => 
        {
            return a.timestamp < b.timestamp ? -1 : 1; 
        }
    )

    content.map(async (element: QuoteDefault) => {
        const example: EmbedBuilder = await embedQuote(element);
        await interaction.followUp({
            ephemeral: true,
            embeds: [example],
        })
    });
    return;
}