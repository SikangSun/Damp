import { EmbedBuilder, Client, Interaction, SlashCommandBuilder, SlashCommandSubcommandBuilder, ChatInputCommandInteraction, Message, InteractionResponse } from 'discord.js';
import { QuoteDefault, QuoteImage } from './../../types/quote';
import { getAllQuotes, getQuote } from './../../database/index';
import { command, embedQuote, findFailed, idOrTag, Reply } from '../../utils';

const emoji = '🆗';
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
        return await one(interaction);
      }
    else if (subcommand === "all") {
        return await all(interaction);
    }
 
})

const one = async (interaction: ChatInputCommandInteraction) => {
    const input: string = interaction.options.getString('tag_or_id')!
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

const all = async (interaction: ChatInputCommandInteraction) => {
    console.log("getall");
    const content: any = await getAllQuotes(interaction.guildId!)
        .catch((err: any) => {console.log(err); return findFailed(interaction, "", 105)})

    if (content.length == 0) {
        return findFailed(interaction, "", 102);
    }
    const message: any = await interaction.reply(
        {
            ephemeral: false,
            content: `Here is all of your quotes` 
        }
    )
    .then(async (message) => {
        const reply = await interaction.fetchReply();
        const reactionEmoji: any = Array.from(interaction?.guild?.emojis?.cache.values()!)
        let validEmoji;
        if (reactionEmoji.length != 0) {
            validEmoji = reactionEmoji.filter((obj: any) => obj.available === true);
        }
        else {
            validEmoji = [emoji]
        }

        const random: number = Math.floor(Math.random() * validEmoji.length);
        await reply.react(validEmoji![random].toString());
      }
    )


    content.sort((a:QuoteDefault | QuoteImage, b: QuoteDefault | QuoteImage) => 
        {
            return a.id < b.id ? -1 : 1; 
        }
    )
    let promises: any = []; // Array to store promises
    content.forEach(async (element: QuoteDefault, i: number) => {
      promises.push(embedQuote(element)); // Add each promise to the array
        // Wait for all promises to resolve using Promise.all()
    });

    Promise.all(promises).then((list) => {
        list.forEach((element) => {
            interaction.followUp({
                ephemeral: true,
                embeds: [element],
            });
        })
        
    })
    
    return;
}