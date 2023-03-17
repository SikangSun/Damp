import { EmbedBuilder } from 'discord.js';
import { ChatInputCommandInteraction } from 'discord.js'

export const insertionFailed = (interaction: ChatInputCommandInteraction, tag: string, errCode: number) => {
    let errMsg: string = "";
    switch (errCode) {
        case 101:
            errMsg = `Tag \"${tag}\" already exists. Quote failed 😔`;
            break;
        case 102:
            errMsg = "Quote failed: Ambiguous tag, can be interpreted as ID"
            break;
        case 103:
            errMsg = "Quote failed: could not fetch channel"
            break;
        case 104:
            errMsg = "Quote failed: wrong id or message does not exist in this channel. Damp only supports quoting messages that are in the same channel"
            break;
        case 105:
            errMsg = "Quote failed: could not connect to database"
            break;
        default:
            errMsg = "Quote failed, please try again later"
    }
    const embed = new EmbedBuilder()
        .setColor(0xbe2e1b)
        .setDescription(errMsg)
    console.log(`Insertion error ${errCode}`)
    return interaction.reply({
        ephemeral: true,
        embeds: [embed]
      })

}

export const findFailed = (interaction: ChatInputCommandInteraction, tag: string, errCode: number) => {
    let errMsg: string = "";
    switch (errCode) {
        case 101:
            errMsg = `Can't find your quote \"${tag}\"`;
            break;
        case 102:
            errMsg = "Get failed: Ambiguous tag, can be interpreted as ID"
            break;
        case 105:
            errMsg = "Get failed: could not connect to database"
            break;
        default:
            errMsg = "Get failed, please try again later"
    }
    const embed = new EmbedBuilder()
	.setColor(0xbe2e1b)
	.setDescription(errMsg)

    console.log(`Find error ${errCode}`)
    return interaction.reply({
        ephemeral: true,
        embeds: [embed]
      })
    
}
