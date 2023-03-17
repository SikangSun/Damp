import { EmbedBuilder, Client } from 'discord.js';
import { updateTagQuote, getQuote } from './../../database';
import { SlashCommandBuilder } from 'discord.js';
import { command, idOrTag, embedQuote, updateFailed, validTag } from '../../utils';

require('dotenv').config();


const tagedit = new SlashCommandBuilder()
  .setName('tag')
  .setDescription('Look up a quote and change its tag')
    .addStringOption(option =>
    option.setName('tag_or_id')
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
    const input: string = interaction.options.getString('tag_or_id')!;
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
