import { command, embedHelp } from './../../utils';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { QuoteDefault, QuoteImage, Sentinel } from './../../types/quote';




const help = new SlashCommandBuilder()
  .setName('_help')
  .setDescription('Get started with Damp!')


  export default command(help, async ({ interaction }) => {
    const [first, second] = embedHelp();
    return interaction.reply({
      ephemeral: true,
      embeds: [first, second],
    });
  })