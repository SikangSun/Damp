import { getRandomQuote, getSentinel, addRoleToQuoter, deleteRoleInQuoter } from './../../database';
import { QuoteDefault, QuoteImage, Sentinel } from './../../types/quote';
import { insertQuote, getQuote, setPublicServerMode } from '../../database/index';
import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionResolvable, GuildMemberRoleManager } from 'discord.js'
import { Reply, command, embedQuote,  roleFailed, isAdmin,  memberIsQuoter, roleExist } from '../../utils'


const help = new SlashCommandBuilder()
  .setName('_help')
  .setDescription('Get started with Damp!')


  export default command(help, async ({ interaction }) => {

  })