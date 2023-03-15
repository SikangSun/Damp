import { EmbedBuilder, Client, User } from 'discord.js';
import { QuoteDefault } from './../types/quote';
import { client } from '../client'
import date from 'date-and-time';


// import { createCanvas, loadImage } from "canvas";

export const embedQuote = async (quote: QuoteDefault): Promise<EmbedBuilder> => {
    const time = date.format(quote.timestamp, 'MM/DD/YY HH:mmA');
    console.log(quote.user)
    const user: User | void = await client.users.fetch(quote.user) //user can be void
        .catch((err: any) => console.log(err))
	const quoter: User | void = await client.users.fetch(quote.quoter) //user can be void
        .catch((err: any) => console.log(err))
    console.log(user);
    return new EmbedBuilder()
	.setColor(0x6375a1)
	.setAuthor({ name: `${user?.username} said:`, iconURL: user?.avatarURL()!})
	.setDescription(`${quote.content ? quote.content :"<Empty>"}`)
	.addFields([{ name: 'ID', value: `${quote!.message}`, inline: true }, {name: 'Tag', value: `${quote!.tag ? `\"${quote.tag}\"` : "None"}`, inline: true}])
	.setThumbnail(user?.avatarURL()!)
	// .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })

	.setFooter({ text: `Quoted @${quoter!.username} • ${time}`,  iconURL: quoter?.avatarURL()!});
	//• ID: ${quote!.message} • ${quote!.tag ? `Tag: ${quote.tag}` : "No tag"}
}
    