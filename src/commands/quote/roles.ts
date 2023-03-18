import { getRandomQuote } from './../../database/index';
import { QuoteDefault, QuoteImage } from './../../types/quote';
import { insertQuote, getQuote } from '../../database/index';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { command, validTag, insertionFailed, embedQuote, findFailed  } from '../../utils'


const roles = new SlashCommandBuilder()
  .setName('_admin_only')
  .setDescription('Role permission settings for public/large servers')


export default command(roles, async ({ interaction }) => {
   
})