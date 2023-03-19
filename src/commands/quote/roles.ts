import { getRandomQuote, getSentinel, addRoleToQuoter, deleteRoleInQuoter } from './../../database/index';
import { QuoteDefault, QuoteImage, Sentinel } from './../../types/quote';
import { insertQuote, getQuote, setPublicServerMode } from '../../database/index';
import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionResolvable, Interaction } from 'discord.js'
import { command, validTag, insertionFailed, embedQuote, findFailed  } from '../../utils'


const roles = new SlashCommandBuilder()
  .setName('_admin_only')
  .setDescription('Role permission settings for public/large servers')
  .addStringOption(option =>
		option.setName('commands')
			.setDescription('select a specfic command')
			.setRequired(true)
			.addChoices(
				{ name: 'on', value: 'on' },
        { name: 'off', value: 'off' },
				{ name: 'show_info', value: 'show' },
        { name: 'add_role', value: 'add'},
        { name: 'delete_role', value: 'delete'}
			))
  .addStringOption(option =>
    option.setName('input')
      .setDescription('Optional role input (add and delete only; @ing here will not have notif)')
      .setRequired(false)
  )



export default command(roles, async ({ interaction }) => {
  const command = interaction.options.getString('commands');
  const roleid = interaction.options.getString('input')!;

  //is admin check
  if (command === "on" || command === "off") {
    await modeSwitch(interaction,  command === "on" ? true : false);
  }
  else if (command === "show") {
    await showList(interaction);
  }
  else if (command === "add") {//role validation
    await addQuoter(interaction, roleid);
  }
  else if (command === "delete") {//role validation
    await deleteQuoter(interaction, roleid);
  }

  // return interaction.reply(
  //   {
  //     ephemeral: false,
  //     content: ` 👌` 
  //   }
  // )
})

const modeSwitch = async (interaction: ChatInputCommandInteraction, input: boolean) => {
  console.log(`Turn mode ${input}`)
  const result = await setPublicServerMode(interaction.guildId!, input);
  if (result) {
    const replyObject = {
      ephemeral: true,
      content: `Public server mode turned ${input ? "ON" : "OFF"}` 
    }
    return interaction.reply(replyObject);
  }
}

const showList = async (interaction: ChatInputCommandInteraction) => {
  const sent: Sentinel = await getSentinel(interaction.guildId!);
  console.log(sent)
  let response = `Public Server Mode: ${sent.public_server_mode ? "On" : "Off"}\nList of Roles with Quoting Privileges:\n`
  const concatFunction = (element: string) => {
    response += "[<@&" + element + ">]\n"
  }
  sent.quoter_list.forEach(concatFunction);
  const replyObject = {
    ephemeral: true,
    content: response, 
  }
  return interaction.reply(replyObject);
}

const addQuoter = async (interaction: ChatInputCommandInteraction, roleid: string) => {
  const extractRoleid = roleid.match(/<@&(\d+)>/);
  console.log("add role");
  if (extractRoleid) {
    await addRoleToQuoter(extractRoleid[1], interaction.guildId!);
  } else {
    return null;
  }
}


const deleteQuoter = async (interaction: ChatInputCommandInteraction, roleid: string) => {
  const extractRoleid = roleid.match(/<@&(\d+)>/);
  console.log("delete role");
  if (extractRoleid) {
    await deleteRoleInQuoter(extractRoleid[1], interaction.guildId!);
  } else {
    return null;
  }
}