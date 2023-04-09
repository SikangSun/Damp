import { EmbedBuilder, Client, SlashCommandBuilder } from 'discord.js';
import { updateTagQuote, getQuote } from './../../database';
import { command, idOrTag, embedQuote, updateFailed, validTag, isAdmin, memberIsQuoter } from '../../utils';


const tagedit: Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand"> = new SlashCommandBuilder()
  .setName('tag')
  .setDescription('Look up a quote and change its tag')
    .addStringOption(option =>
    option.setName('input')
        .setDescription('Enter your tag or id')
        .setRequired(true)
        .setMaxLength(30)
        .setMinLength(1)
    )
    .addStringOption((option) =>
    option
      .setName('new_tag')
      .setDescription('Enter the updated the tag')
      .setMinLength(1)
      .setMaxLength(20)
      .setRequired(true)
    )

export default command(tagedit, async ({ interaction }) => {
    console.log("edit tag");
    const input: string = interaction.options.getString('input')!;
    const newtag: string = interaction.options.getString('new_tag')!;
    
    let unique: any = "";
    if (validTag(newtag)) {//valid tag, check distinct
        unique = await getQuote(newtag, interaction.guildId!)
                        .catch((err: any) => {return updateFailed(interaction, input, 105);})
    }
    else {//ambiguous tag
        return updateFailed(interaction, newtag, 103);
    }

    if (unique) {//not distinct
      return updateFailed(interaction, newtag, 101)
    }

    if (await memberIsQuoter(interaction)) {//role checking
        const current =  await getQuote(input, interaction.guildId!)
                                .catch((err: any) => {return updateFailed(interaction, input, 105);})
        if (isAdmin(interaction) == false && current!.quoter !== interaction.user.id!) { 
            updateFailed(interaction, input, 106);
        }
    }

    const idTag: string = idOrTag(input);
    const result = await updateTagQuote(idTag, newtag, input, interaction.guildId!)
        .catch((err: any) => {return updateFailed(interaction, input, 105)})

    if (!result) { //error
        return updateFailed(interaction, input, 104);
    }
    
    return interaction.reply({
        ephemeral: false,
        embeds: [new EmbedBuilder().setColor(0x49be25).setDescription(`Quote \"${input}\" is now tagged as \"${newtag}\"`)],
    });
})
