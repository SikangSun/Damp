import { QuoteDefault } from './../../types/quote';
import { blackcards } from './../../client/index';
import { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder  } from 'discord.js';
import { getRandomQuote } from "./../../database"
import { command,  embedQuote, } from '../../utils';


const cah = new SlashCommandBuilder()
  .setName('meme')
  .setDescription('Make a Cards Against Humanity meme with your quotes')


export default command(cah, async ({ interaction }) => {
  console.log("cah");
  // const quotes: string[] = await getAllQuotes(interaction.guildId!);
  //TODO: handle less than 5 quotes
  const message: any = await interaction.reply(
    {
        ephemeral: false,
        content: `Prompt: ${blackcards[Math.floor(Math.random() * blackcards.length)]}` 
    }
  )
  const quotes = await getRandomQuote(interaction.guildId!, 5);
  const callback = [];
  console.log(quotes)
  let promises: any = [];
  quotes.forEach(async (element: QuoteDefault, i: number) => {
    promises.push(embedQuote(element)); // Add each promise to the array
      // Wait for all promises to resolve using Promise.all()
  });
  // Promise.all(promises).then((list) => {
  //   list.forEach((element: any, i: number) => {
  //     const button = new ButtonBuilder()
  //       .setCustomId(i.toString())
  //       .setLabel('Select')
  //       .setStyle(ButtonStyle.Primary)
      
	// 	const row  = new ActionRowBuilder<ButtonBuilder>()
  //     .addComponents(button);
  //       const temp = interaction.followUp({
  //           ephemeral: true,
  //           embeds: [element],
  //           components: [row]
  //       });
  //       callback.push(temp);
  //   })
  //   })
    // try {
    //   const confirmation = await response.awaitMessageComponent({ time: 60000 });
    // } catch (e) {
    //   await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
    // }
    
})
