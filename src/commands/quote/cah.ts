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
  const prompt = blackcards[Math.floor(Math.random() * blackcards.length)];
  const message: any = await interaction.reply(
    {
        ephemeral: false,
        content: `Prompt: ${prompt}` 
    }
  )
  const quotes = await getRandomQuote(interaction.guildId!, 5);

  let promises: any = [];
  quotes.forEach(async (element: QuoteDefault, i: number) => {
    promises.push(embedQuote(element)); // Add each promise to the array
      // Wait for all promises to resolve using Promise.all()
  });
  const callback: any = [];
  Promise.all(promises).then((list) => {
    console.log("first")
    list.forEach((element: any, i: number) => {
      const button = new ButtonBuilder()
        .setCustomId(i.toString())
        .setLabel('Select')
        .setStyle(ButtonStyle.Primary)
      
		const row  = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(button);
        const temp = interaction.followUp({
            embeds: [element],
            components: [row]
        });
        callback.push(temp);
    })
    Promise.all(callback).then(async (messageList) => {
      try {
        console.log("second")
        let awaitList: any[] = [];
        const collectorFilter = (i:any) => i.user.id === interaction.user.id;
        messageList.forEach((m: any) => {
          awaitList.push(m.awaitMessageComponent({filter: collectorFilter, time: 60000 }));
        })
        Promise.race(awaitList).then(async (selected: any) => {
          messageList.forEach((element: any) => {element.delete()});
          console.log(selected.customId)
          const element = list[parseInt(selected.customId)];
          await interaction.editReply({ 
            content: `**Prompt: ${prompt}**\n, and ${interaction.user.username} chose`,
            embeds: [element],
          });
        });
      } catch (e) {
        console.log(e)
        messageList.forEach((element: any) => {element.delete()});
        await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
      }
    })
  })

})
