import { EmbedBuilder, Client, User, GatewayIntentBits } from 'discord.js';
import { QuoteDefault, QuoteImage } from './../types/quote';
import keys from '../keys'
import date from 'date-and-time';

const embedClient = new Client({
	intents: [
	  GatewayIntentBits.Guilds,
	  GatewayIntentBits.GuildMembers,
	],
  })

  embedClient.login(keys.clientToken)
  .catch((err: any) => {
    console.error('[Login Error]', err)
    process.exit(1)
  })


export const embedQuote = async (quote: QuoteDefault | QuoteImage): Promise<EmbedBuilder> => {

	if (quote.type === "message") {
		return await embedMessage(quote);
	}
	else {
		return await embedImage(quote);
	}

}

export const insertionFailed = (tag: string): EmbedBuilder => {
	return new EmbedBuilder()
	.setColor(0xbe2e1b)
	.setDescription(`Tag \"${tag}\" already exists. Quote failed 😔`)
}

export const findFailed = (tag: string): EmbedBuilder => {
	return new EmbedBuilder()
	.setColor(0xbe2e1b)
	.setDescription(`Tag \"${tag}\" not found. Retrieval failed 😱`)
}

const embedMessage = async (quote: QuoteDefault) : Promise<EmbedBuilder> => {
	const time = date.format(quote.timestamp, 'MM/DD/YY HH:mmA');
    const user: User | void = await embedClient.users.fetch(quote.user) //user can be void
        .catch((err: any) => console.log(err))
	const quoter: User | void = await embedClient.users.fetch(quote.quoter) //user can be void
        .catch((err: any) => console.log(err))

    return new EmbedBuilder()
		.setColor(0x6375a1)
		.setAuthor({ name: `${user?.username} said:`, iconURL: user?.avatarURL()!})
		.setDescription(`${quote.content ? quote.content :"<Empty>"}`)
		.addFields([{ name: 'ID', value: `${quote!.message}`, inline: true }, {name: 'Tag', value: `${quote!.tag ? `\"${quote.tag}\"` : "None"}`, inline: true}])
		.setThumbnail(user?.avatarURL()!)
		.setFooter({ text: `Quoted @${quoter!.username} • ${time}`,  iconURL: quoter?.avatarURL()!});
}

const embedImage = async (quote: QuoteImage) : Promise<EmbedBuilder> => {
	const time = date.format(quote.timestamp, 'MM/DD/YY HH:mmA');
	const quoter: User | void = await embedClient.users.fetch(quote.quoter) //user can be void
        .catch((err: any) => console.log(err))
	console.log(quote)
    return new EmbedBuilder()
		.setColor(0x6375a1)
		.setTitle(quote.title)
		.setDescription(` ${quote!.tag ? `\"${quote.tag}\"` : "None"}`)
		.setImage(quote.link)
		.setFooter({ text: `Quoted @${quoter!.username} • ${time}`,  iconURL: quoter?.avatarURL()!});
}