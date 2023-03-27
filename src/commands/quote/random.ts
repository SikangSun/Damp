import { getRandomQuote } from './../../database/index';
import { QuoteDefault, QuoteImage } from './../../types/quote';
import { insertQuote, getQuote } from '../../database/index';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { command, validTag, insertionFailed, embedQuote, findFailed  } from '../../utils'

const defaultEmoji = ['😳', '😍', '🙏', '🤨', '🔥', '🤯', '🥵', '😎', '🤮', '🤡']
const random = new SlashCommandBuilder()
  .setName('random')
  .setDescription('Get a random quote, also Damp will react to it')


export default command(random, async ({ interaction }) => {
    const quote: any = await getRandomQuote(interaction.guildId!)
    .catch((err: any) => {return findFailed(interaction, "", 105)})

    if (quote) {
        const embed: EmbedBuilder = await embedQuote(quote);
        return await interaction.reply({
            ephemeral: false,
            embeds: [embed],
        })
        .then(async (message: any) => {
            const reply = await interaction.fetchReply();
            const reactionEmoji: any = Array.from(interaction?.guild?.emojis?.cache.values()!)
            let validEmoji;

            if (reactionEmoji.length > 5) {
                validEmoji = reactionEmoji.filter((obj: any) => obj.available === true);
            }
            else {
                validEmoji = defaultEmoji;
            }
    
            const random: number = Math.floor(Math.random() * validEmoji.length);
            await reply.react(validEmoji![random].toString())
            }
        )
    }
  
})