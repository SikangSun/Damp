import { EmbedBuilder, Client, Interaction, SlashCommandBuilder, SlashCommandSubcommandBuilder, ChatInputCommandInteraction, Message, InteractionResponse } from 'discord.js';
import { QuoteDefault, QuoteImage, Role } from './../../types/quote';
import { getAllQuotes, getQuote } from './../../database/index';
import { command, embedQuote, findFailed, idOrTag, Reply, isPublicServerOn, getUserRole } from '../../utils';

const emoji = '🆗';
const getall = new SlashCommandBuilder()
  .setName('list')
  .setDescription('Get quote by tag or id')
  .addSubcommand((option: SlashCommandSubcommandBuilder) => {//subcommand get all
    return option
    .setName("all")
    .setDescription("Get all messages")
  })



export default command(getall, async ({ interaction }) => {
    return await all(interaction);
})

const all = async (interaction: ChatInputCommandInteraction) => {
    console.log("getall");
    let content: any = await getAllQuotes(interaction.guildId!)
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

    if (await isPublicServerOn(interaction.guildId!) == true && await getUserRole(interaction) == Role.USER) {
        content = content.slice(-10); //Role checking
    } 

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