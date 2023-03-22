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
        case 106:
            errMsg = "Quote failed: You do not have quoter permissions. Please request a role from an administrator."
            break;
        case 107:
            errMsg = "Quote failed: You have reached 10 quotes quote limit. Please delete one of your quotes or request an adminstrator role and try again."
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
        case 106:
            errMsg = `Update failed: You do not have permission to delete the quote with ${ idTag === "tag" ? `tag ${input}` : `id ${input}`}. Without administrator role, you only have permission to delete your own quotes.`;
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
        case 103:
            errMsg = `Delete failed: You do not have permission to update the quote with ${ idTag === "tag" ? `tag ${input}` : `id ${input}`}. You only have permission to update your own quotes.`;
            break;
        case 105:
            errMsg = "Delete failed: could not connect to database"
            break;
        default:
            errMsg = "Delete failed, please try again later"
    }
    interaction.reply(Reply.error(errMsg));
}



export const roleFailed = (interaction: ChatInputCommandInteraction, input: string, errCode: number) => {
    let errMsg: string = "";
    switch (errCode) {
        case 100:
            errMsg = "Validation failed: You do not have administrator privileges."
            break;
        case 101:
            errMsg = "Validation failed: Incorrect role format. Please @ the role you would like to add/delete in command input (@ing in command will not send notification)."
            break;
        case 102:
            errMsg = "Validation failed: Role does not exist in this server. Please try again"
            break;
        case 105:
            errMsg = "Role failed: could not connect to database."
            break;
        default:
            errMsg = "validation failed, please try agian later"
    }
    interaction.reply(Reply.error(errMsg));
}