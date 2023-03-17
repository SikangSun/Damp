import { EmbedBuilder, Client } from 'discord.js';
import { updateTagQuote } from './../../database';
import { SlashCommandBuilder } from 'discord.js';
import { command, idOrTag, embedQuote, findFailed } from '../../utils';

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
    const input: string = interaction.options.getString('input')!;
    const newtag: string = interaction.options.getString('new_tag')!;
    const idTag: string = idOrTag(input);
    const result = await updateTagQuote(idTag, newtag, input, interaction.guildId!);
    // console.log(quote)
    if (!result) { //error
        return interaction.reply({
            ephemeral: false,
            embeds: [new EmbedBuilder()
                .setColor(0xbe2e1b)
                .setDescription(`Quote with ${ idTag === "tag" ? `tag ${input}` : `id ${input}`} does not exist. Update failed`)],
        });

    }
    
    return interaction.reply({
        ephemeral: false,
        embeds: [new EmbedBuilder().setColor(0x49be25).setDescription(`Quote \"${input}\" is now tagged as \"${newtag}\"`)],
    });
})
