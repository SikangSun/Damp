import { getAllQuotes } from './../../database/index';
import { SlashCommandBuilder, InteractionWebhook } from 'discord.js'
import { command } from '../../utils'
import { Client, GatewayIntentBits } from 'discord.js'

require('dotenv').config();


const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages
  ],
})

const getall = new SlashCommandBuilder()
  .setName('getquotes')
  .setDescription('see all quotes.')

export default command(getall, async ({ interaction }) => {
    console.log("getall");
    const content: any = await getAllQuotes();

  await interaction.reply({
    ephemeral: false,
    content: `Here is all your quotes` 
})
    content.map(async (element: any) => {
        await interaction.followUp({
            ephemeral: false,
            content: `${element.quote}` 
        })
    });
    return;
})

