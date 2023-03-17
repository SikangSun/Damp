import { EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { idOrTag } from "./validation"
import { Reply } from "./replies"

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
    interaction.reply(Reply.error(errMsg));
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
    interaction.reply(Reply.error(errMsg));
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
    interaction.reply(Reply.error(errMsg));
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
    interaction.reply(Reply.error(errMsg));
}