// import { EmbedBuilder, Client } from 'discord.js';
// import { QuoteDefault, QuoteImage } from './../../types/quote';
// import { embedQuote } from './../../utils/embed';
// import { getAllQuotes } from './../../database/index';
// import { SlashCommandBuilder, InteractionWebhook } from 'discord.js';
// import { command } from '../../utils';
// import { GatewayIntentBits } from 'discord.js';

// require('dotenv').config();


// const getall = new SlashCommandBuilder()
//   .setName('getall')
//   .setDescription('see all quotes in this server.')


// export default command(getall, async ({ interaction }) => {
//     console.log("getall");
//     const content: any = await getAllQuotes(interaction.guildId!);

//   await interaction.reply({
//     ephemeral: true,
//     content: `Here is all your quotes` 
// })
//     content.sort((a:QuoteDefault | QuoteImage, b: QuoteDefault | QuoteImage) => {
//       return a.timestamp < b.timestamp ? -1 : 1; 
//     })
//     content.map(async (element: QuoteDefault) => {
//         const example: EmbedBuilder = await embedQuote(element);
//         await interaction.followUp({
//             ephemeral: true,
//             embeds: [example],
//         })
//     });
//     return;
// })

