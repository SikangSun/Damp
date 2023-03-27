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
    console.error('[Login Error]', err);
    process.exit(1);
  })


export const embedQuote = async (quote: QuoteDefault | QuoteImage): Promise<EmbedBuilder> => {

	if (quote.type === "message") {
		return await embedMessage(quote);
	}
	else {
		return await embedImage(quote);
	}

}


const embedMessage = async (quote: QuoteDefault) : Promise<EmbedBuilder> => {
	const time = `<t:${Math.floor(quote.timestamp.valueOf()/1000)}:f>`
    const user: User | void = await embedClient.users.fetch(quote.user) //user can be void
        .catch((err: any) => console.log(err))
	const quoter: User | void = await embedClient.users.fetch(quote.quoter) //user can be void
        .catch((err: any) => console.log(err))

    return new EmbedBuilder()
		.setColor(0x6375a1)
		.setAuthor({ name: `${user?.username} said:`, iconURL: user?.displayAvatarURL()!})
		.setDescription(`>>> ${quote.content ? quote.content :"<Empty>"}`)
		.setFields([{name: "⠀", value: time }])
		.setThumbnail(user?.displayAvatarURL()!)
		.setFooter({ text: `Quoted @${quoter!.username} • ID ${quote!.id} • ${quote!.tag ? `Tagged as \"${quote.tag}\"` : "No Tag"}`,  iconURL: quoter?.avatarURL()!});
}

const embedImage = async (quote: QuoteImage) : Promise<EmbedBuilder> => {
	const time = `<t:${Math.floor(quote.timestamp.valueOf()/1000)}:f>`
	const quoter: User | void = await embedClient.users.fetch(quote.quoter) //user can be void
        .catch((err: any) => console.log(err))

    return new EmbedBuilder()
		.setColor(0x6375a1)
		.setTitle(quote.title)
		.setDescription(time)
		.setImage(quote.link)
		.setFooter({ text: `Quoted @${quoter!.username} • ID ${quote!.id} • ${quote!.tag ? `Tagged as \"${quote.tag}\"` : "No Tag"}`,  iconURL: quoter?.avatarURL()!});
}

const desc: string = "Damp is a Discord quote bot created with the intention to enhance the Discord server experience. The following are the list of commands that Damp currently support.";
const quoteMessageName = `\`/quote message [message link or id] [tag: optional]\``;
const quoteMessageValue = `
>>> For message link, hover over message -> click on three dots -> click "Copy Message Link"
Quote a Discord message with the message link or id. Tag the quote for easy retrieval later.`;

const quoteImageName = `\`/quote image [image link] [title: optional] [tag: optional]\``;
const quoteImageValue = `
>>> For image/gif link, right click image on Discord -> click "Copy Link". Any URL to images is also viable.
Quote any image, gif, video, or any Discord attachment-supported formats. Give it a funny title. Tag the quote for easy retrieval later. \
`;
const getQuoteName = "\`/get quote [id or tag]\`";
const getQuoteValue = `
> Retrieve and display a quote by its ID or tag.\
`
const getAllName = "\`/get all\`";
const getAllValue = `
> Retrieve all quotes on this server. The display messages will only be visible to you.
`;
const tagName = `\`/tag [id or tag] [new tag]\``;
const tagValue = `> Change the tag of a quote given its ID or tag. Note that the tag cannot be only numbers, and it also has to be unique from all other tags in the server.`;
const deleteName = `\`/delete [id or tag]\``;
const deleteValue = `> Delete a quote from the server given the ID or tag. This is a permanent action and cannot be restored.`;
const randomName = "\`/random\`";
const randomValue = "> Randomly retrieve a quote, display it, and Damp will react to it. When the server has enough custom emotes, Damp will also react in the server's emotes instead of default ones. Note that Damp must be in the channel to have permission to react to the message.";
const adminName = "\`/admin_only\`";
const adminValue = "> To turn on public server options and role permissions, enter \"/admin_only help\" for more information. Admin roles required";
const notes1Name = " State of Development"
const notes1Value = `Damp is still under development. This means more features are coming, but also means there may be bugs and server inconsistencies. If there are any issues, please contact me with the info listed in the footer.`
const notes2Name = "Security"
const notes2Value = `By design, Damp do not have any administrator roles (e.g. kick member, ban members), and all public server role checking are done on the program, which allows Damp to operate at a permission level below administrator. This is designed intentionally to deter any malicious exploits using Damp.`
const notes3Name = " Upcoming updates and features";
const notes3Value = `I will be mainly focusing on refining error handling and picking out any existing bugs. I am also trying to clean up the user interface to make Damp easier to interact with. After that, I am looking into implementing a "Card against Humanity" feature, which allows users to match their server quotes against a random prompt, which sounds fun to me at least :).`
const notes4Name = "Damp";
const notes4Value = `The reason why I started this project was because I loved having a "quote" channel in servers to record all of the stupid/funny things friends have said, and it is always nostalgic to read them over and having a good laugh. I hope Damp will achieve just that but in a more interactive and lively manner. Currently, the bot is completely free, however, as scalability kicks in, I may have to place restrictions on the number of quotes allowed per server. If you enjoy using Damp, feel free to share it with your other servers, public or private, as it will help me a lot. Feel free to contact me for any inquries. Thank you.`;

export const embedHelp = (): EmbedBuilder[] => {
	const first = new EmbedBuilder()
	.setColor(0x6375a1)
	.setTitle("Getting Started")
	.setURL("https://tinyurl.com/inviteDamp")
	.setDescription(desc)
	.addFields(
		{name: quoteMessageName, value: quoteMessageValue},
		{name: quoteImageName, value: quoteImageValue},
		{name: getQuoteName, value: getQuoteValue},
		{name: getAllName, value: getAllValue},
		{name: tagName, value: tagValue},
		{name: deleteName, value: deleteValue},
		{name: randomName, value: randomValue},
		{name: adminName, value: adminValue},
	)
	.setAuthor({ name: 'Damp', iconURL: 'https://cdn.discordapp.com/avatars/1076606284553539634/5ea3a8fc6da219ba071ae9a0e472d41a.webp', url: 'https://tinyurl.com/inviteDamp' })
	.setThumbnail('https://cdn.discordapp.com/avatars/1076606284553539634/5ea3a8fc6da219ba071ae9a0e472d41a.webp')
	const second = new EmbedBuilder()
	.setColor(0x6375a1)
	.setTitle("General Notes")
	.addFields(
		{name: notes1Name, value: notes1Value},
		{name: notes2Name, value: notes2Value},
		{name: notes3Name, value: notes3Value},
		{name: notes4Name, value: notes4Value},
	)
	.setAuthor({ name: 'Damp', iconURL: 'https://cdn.discordapp.com/avatars/1076606284553539634/5ea3a8fc6da219ba071ae9a0e472d41a.webp', url: 'https://tinyurl.com/inviteDamp' })
	.setThumbnail('https://cdn.discordapp.com/avatars/1076606284553539634/5ea3a8fc6da219ba071ae9a0e472d41a.webp')
	.setFooter({ text: `@Sikang#7291 • Last updated: March 26, 2023`, iconURL: "https://images-ext-1.discordapp.net/external/S6JAqk5SH1XjnxaDN-XjvaWWfu1IcL8ga_m3Oj55Ue0/https/cdn.discordapp.com/avatars/270425872400384001/089c7e3f8c992803483caa7793ce7477.webp"});
	return [first, second]
}

const desc2 = `
Damp comes with basic role permission checking, and can be toggled on/off based on the preference of the server administrators. 
By default, public server mode is off, and any person on the server has all access to all quotes (e.g. quote, delete, tag, etc). This is not so secure when applied to a large public server, as malicious actors may try to sabotage other user's information. 
Damp has three basic roles: Administrator, Quoter, and User.
`
const administratorName = `Administrator`
const administratorValue = `> Reflects administrator roles in the server (i.e. if the user has an adminstrator role in the server, they will also have administrator permissions to Damp). Has all privileges just as public server mode off. Can delete, tag, and quote without any limit. `
const quoterName = `Quoter`
const quoterValue = `> Quoter roles must be registered to Damp with the command /add role [@role]. Quoters has limited privileges: has a personal 10 quote limit and can only delete and tag one's own quotes. When a command is ran, Damp will check the user's Roles with the registered Quoter roles, where if any of the user's roles is considered as a Quoter, Damp will allow the action. Administrator permissions will take precedent over Quoter's permissions.`
const userName = `User`;
const userValue = `> User is anyone who is not an administrator and do not have any Quoter roles (e.g. anyone who just joined the server). User can use /get quote and /get all, however, /get all will only return the 10 lastest quoted on the server.`;
const onName = `Commands: \`/admin_only on/off\``;
const onValue = `Turn Public Server Mode On/Off.`;
const showInfoName = `\`/admin_only show_info\``;
const showInfoValue = `Display current Public Server Mode and the list of roles that allow`;
const addRoleName = `\`/admin_only add_role [@role: required]\``;
const addRoleValue = `Add a role as a Quoter to the database.  Please @ the role directly in the command input. Do not worry, it will not push any notifications.`;
const deleteRoleName = `\`/admin_only delete_role [@role: required]\``;
const deleteRoleValue = `Delete an existing Quoter role from the database.  Please @ the role directly in the command input. It will not push any notifications.`;


export const embedAdminHelp = (): EmbedBuilder => {
	return new EmbedBuilder()
	.setColor(0x6375a1)
	.setTitle("Public Server Settings and Role Permissions")
	.setDescription(desc2)
	.addFields(
		{name: administratorName, value: administratorValue},
		{name: quoterName, value: quoterValue},
		{name: userName, value: userValue},
		{name: onName, value: onValue},
		{name: showInfoName, value: showInfoValue},		
		{name: addRoleName, value: addRoleValue},		
		{name: deleteRoleName, value: deleteRoleValue},	
	)
	.setAuthor({ name: 'Damp', iconURL: 'https://cdn.discordapp.com/avatars/1076606284553539634/5ea3a8fc6da219ba071ae9a0e472d41a.webp', url: 'https://tinyurl.com/inviteDamp' })
	.setThumbnail('https://cdn.discordapp.com/avatars/1076606284553539634/5ea3a8fc6da219ba071ae9a0e472d41a.webp')

}


