import { getSentinel } from './../database/index';
import { EmbedBuilder, Client, User, GatewayIntentBits, Interaction, GuildMember, PermissionResolvable, GuildMemberRoleManager } from 'discord.js';
import { QuoteDefault, QuoteImage, Sentinel } from './../types/quote';


export const idOrTag = (input: string): string => {
    return isNaN(Number(input)) ? "tag" : "id";
}

export const validTag = (input: string): boolean => {
    return isNaN(Number(input)) ? true : false;
}

export const isPublicServerOn = async (guild: string): Promise<boolean> => {
    await getSentinel(guild)
        .then((sent: Sentinel) => {
            return sent.public_server_mode;
        })
        .catch(console.error)//error handling
    return false;
}

export const isAdmin = (interaction: Interaction): boolean => {
    const member = interaction.member as GuildMember;
    const admin: PermissionResolvable = "Administrator";
    return member.permissions.has(admin);
}

export const memberIsQuoter = async (interaction: Interaction): Promise<boolean> => {
    const memberRoles: string[] = Array.from((interaction.member!.roles as GuildMemberRoleManager).cache.keys());
    const sent: Sentinel = await getSentinel(interaction.guildId!);
    const quoterList: string[] = await sent.quoter_list;
    const intersection = memberRoles.filter(value => quoterList.includes(value));
    return intersection.length == 0 ? false : true;
}