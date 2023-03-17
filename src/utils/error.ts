import { EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { idOrTag } from "./validation"

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
            errMsg = "Get failed: you have no quotes. Use \"/quote message\" to get started!"
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



export const updateFailed = (interaction: ChatInputCommandInteraction, input: string, errCode: number) => {
    let errMsg: string = "";
    const idTag: string = idOrTag(input);
    switch (errCode) {
        case 101:
            errMsg = `Update failed: tag \"${input}\" already exists. Quote failed 😔`;
            break;
        case 102:
            errMsg = `Update failed: quote with ${ idTag === "tag" ? `tag ${input}` : `id ${input}`} does not exist. Update failed`;
            break;
        case 103:
            errMsg = "Update failed: Ambiguous tag, can be interpreted as ID"
            break;
        case 104:
            errMsg = "Update failed: your quote is not found"
            break;
        case 105:
            errMsg = "Update failed: could not connect to database"
            break;
        default:
            errMsg = "Update failed, please try again later"
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


export const deleteFailed = (interaction: ChatInputCommandInteraction, input: string, errCode: number) => {
    let errMsg: string = "";
    const idTag: string = idOrTag(input);
    switch (errCode) {
        case 102:
            errMsg = `Delete failed: quote with ${ idTag === "tag" ? `tag ${input}` : `id ${input}`} does not exist`;
            break;
        case 105:
            errMsg = "Update failed: could not connect to database"
            break;
        default:
            errMsg = "Update failed, please try again later"
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