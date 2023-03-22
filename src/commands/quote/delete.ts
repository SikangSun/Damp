import { EmbedBuilder, Client, SelectMenuInteraction } from 'discord.js';
import { deleteOneQuote, getQuote } from './../../database';
import { SlashCommandBuilder } from 'discord.js';
import { command, idOrTag, embedQuote, deleteFailed, isAdmin, memberIsQuoter } from '../../utils';


const deleteone = new SlashCommandBuilder()
  .setName('delete')
  .setDescription('Delete quote by tag or id')
  .addStringOption(option =>
    option.setName('input')
        .setDescription('Enter the tag or the id')
        .setRequired(true)
        .setMaxLength(30)
        .setMinLength(1)
    )

export default command(deleteone, async ({ interaction }) => {
    console.log("delete");
    const input: string = interaction.options.getString('input')!
    const identifier = idOrTag(input);

   
    if (await memberIsQuoter(interaction)) {
        const current =  await getQuote(input, interaction.guildId!)
                        .catch((err: any) => {return deleteFailed(interaction, input, 105);})
        if (isAdmin(interaction) == false && current!.quoter !== interaction.user.id!) { //role checking
            deleteFailed(interaction, input, 103);
        }
    }

    const quote = await deleteOneQuote(identifier, input, interaction.guildId!)
        .catch(err => {
            return deleteFailed(interaction, input, 105);
        })

    if (!quote) {
        return deleteFailed(interaction, input, 102);
    }
    
    return interaction.reply({
        ephemeral: false,
        embeds: [new EmbedBuilder().setColor(0x49be25).setDescription(`Your quote \"${input}\" has been deleted!`)],
    });
})
