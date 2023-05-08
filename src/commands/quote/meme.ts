import { QuoteDefault } from './../../types/quote';
// import { blackcards } from './../../client/index';
import { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder  } from 'discord.js';
import { getRandomQuote } from "./../../database"
import { command,  embedQuote, } from '../../utils';
const fs = require('fs');

export let blackcards: string[] = [];

fs.readFile('src/client/cah.json', 'utf8', (err: any, data: any) => {
  if (err) {
    console.error(err);
    return;
  }
  const json = JSON.parse(data);
  json.map((obj: any) => {
    blackcards = blackcards.concat(obj.black);
  })
  blackcards = blackcards.filter((obj: any) => {
    return obj.pick === 1
  })
  blackcards = blackcards.map((obj: any) => { return obj.text.replace(/_/g, '[BLANK]');;});
  //console.log(blackcards)
});

const meme = new SlashCommandBuilder()
  .setName('meme')
  .setDescription('Make a Cards Against Humanity meme with your quotes')


export default command(meme, async ({ interaction }) => {
  console.log("cah");
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
    }) //list foreach
    Promise.all(callback).then(async (messageList) => {
      try {
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
