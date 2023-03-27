import { isPublicServerOn, getUserRole, memberIsQuoter } from './../../utils/validation';
import { QuoteDefault, QuoteImage, Role } from './../../types/quote';
import { insertQuote, getQuote, getNumberOfQuotesByUser  } from '../../database/index';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder, Client, GatewayIntentBits, ChatInputCommandInteraction } from 'discord.js'
import { command, validTag, insertionFailed, Reply  } from '../../utils'

const quote = new SlashCommandBuilder()
  .setName('quote')
  .setDescription('quote your friends.')

  .addSubcommand((option: SlashCommandSubcommandBuilder) => {//subcommand message
    return option
    .setName("message")
    .setDescription("Quote a message")
    .addStringOption((suboption: any) =>
    suboption
      .setName('message_link_or_id')
      .setDescription('ID or the link of the message you want to quote.')
      .setMinLength(1)
      .setMaxLength(150)
      .setRequired(true)
    )
    .addStringOption((suboption: any) =>
      suboption
        .setName('tag')
        .setDescription('Give an unique tag for this quote for look up later')
        .setMinLength(1)
        .setMaxLength(20)
        .setRequired(false)
    )
  })

  .addSubcommand((option: SlashCommandSubcommandBuilder) => {//subcommand image
    return option
    .setName('image')
    .setDescription('Quote a link to an image/gif/attachment.')
    .addStringOption((suboption) =>
      suboption
        .setName('link')
        .setDescription('Link to your image/gif (For Discord images, right click and press \"Copy Link\")')
        .setMinLength(1)
        .setMaxLength(250)
        .setRequired(true)
    )
    .addStringOption((suboption) =>
      suboption
        .setName('title')
        .setDescription('Gave this image a title')
        .setMinLength(1)
        .setMaxLength(50)
        .setRequired(false)
    )
    .addStringOption((suboption) =>
      suboption
        .setName('tag')
        .setDescription('Give an unique tag for this quote for look up later')
        .setMinLength(1)
        .setMaxLength(20)
        .setRequired(false)
    )
  })
  


export default command(quote, async ({ interaction }) => {
  const subcommand = interaction.options.getSubcommand();
  console.log("quote", subcommand);

  if (await isPublicServerOn(interaction.guildId!)) { //role checking
    const userRole: Role = await getUserRole(interaction);
    if (userRole == Role.USER) {
      return insertionFailed(interaction, "", 106);
    }
    else if (userRole == Role.QUOTER && await getNumberOfQuotesByUser(interaction.guildId!, interaction.user.id!) >= 10) {
      return insertionFailed(interaction, "", 107);
    }
  }

  if (subcommand === "message") {
    return await message(interaction);
  }
  else if (subcommand === "image") {
    return await image(interaction);
  }
})



const message = async (interaction: ChatInputCommandInteraction) => {
  let messageid: string = interaction.options.getString('message_link_or_id')!
  const tag: string = interaction.options.getString('tag')!

  if (messageid.includes("https")) {
    const splitArr = messageid.split("/");
    messageid = splitArr?.pop()!;
  }
  if (tag && !validTag(tag)) {
    return insertionFailed(interaction, tag, 102);
  }

  let unique: any;
  if (tag) { //checking tag uniqueness
    unique = await getQuote(tag, interaction.guildId!)
  }
  if (unique) {
    return insertionFailed(interaction, tag, 101);
  }

  const guildId: string = interaction.guildId!
  const channelId: string = interaction.channelId!
  let Channel: any = await interaction.client.channels.fetch(channelId)
    .catch((err: any) => { 
      return insertionFailed(interaction, tag, 103);
    });
  const message = await Channel!.messages.fetch(messageid)
    .catch((err: any) => {
      return insertionFailed(interaction, tag, 104);
    });
  //console.log(message.author)
  //  console.log(interaction)



  const quoteObject: QuoteDefault = {
    id: 0,
    type: "message",
    content: <string>message.content,
    timestamp: message.createdAt,
    user: <string>message.author.id,
    message: messageid,
    channel: channelId,
    guild: guildId,
    quoter: interaction.user.id,
    tag: tag
  };
  await insertQuote(quoteObject)
    .catch((err: any) => {
      return insertionFailed(interaction, tag, 105);
    })

  return interaction.reply(Reply.success(`"${quoteObject.content}" has been quoted 👌`))
}



const image = async (interaction: ChatInputCommandInteraction) => {
  const link: string = interaction.options.getString('link')!
  const title: string = interaction.options.getString('title')!
  const tag: string = interaction.options.getString('tag')!

  
  if (tag && !validTag(tag)) {
    return insertionFailed(interaction, tag, 102);
  }

  let not_unique: any;
  if (tag) { //checking tag uniqueness
    not_unique = await getQuote(tag, interaction.guildId!);
  }
  if (not_unique) {
    return insertionFailed(interaction, tag, 101)
  }

  //console.log(message.author)
 
 
  const quoteObject: QuoteImage = {
    id: 0,
    type: "image",
    link: link,
    timestamp: new Date(),
    guild: interaction.guildId!,
    quoter: interaction.user.id,
    title: title,
    tag: tag
  };
  await insertQuote(quoteObject)
  .catch((err: any) => {
    return insertionFailed(interaction, tag, 105);
  })
 
  return interaction.reply({
    ephemeral: false,
    content: `${quoteObject.tag ? `\"${quoteObject.tag}\"` : "Your image/gif"} has been quoted 👌` 
  })
}

