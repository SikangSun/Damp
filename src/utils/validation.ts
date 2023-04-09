import { getSentinel } from './../database/index';
import { EmbedBuilder, Client, User, GatewayIntentBits, Interaction, GuildMember, PermissionResolvable, GuildMemberRoleManager, ChatInputCommandInteraction } from 'discord.js';
import { QuoteDefault, QuoteImage, Sentinel, Role } from './../types/quote';


export const idOrTag = (input: string): string => {
    return isNaN(Number(input)) ? "tag" : "id";
}

export const validTag = (input: string): boolean => {
    return isNaN(Number(input)) ? true : false;
}

export const isPublicServerOn = async (guild: string): Promise<boolean> => {
    const sent: any = await getSentinel(guild)
        .catch(console.error)//error handling
    return sent.public_server_mode!;
}

export const roleExist = async (interaction: ChatInputCommandInteraction, role: string): Promise<boolean> => {
    const allRoles: string[] = Array.from(interaction.guild!.roles.cache.keys());
    return allRoles.includes(role);
}

export const userExist = async (interaction: ChatInputCommandInteraction, user: string): Promise<boolean> => {
    const allMembers: string[] = Array.from(interaction.guild!.members.cache.keys());
    return allMembers.includes(user);
}

export const isAdmin = (interaction: ChatInputCommandInteraction): boolean => {
    const member = interaction.member as GuildMember;
    const admin: PermissionResolvable = "Administrator";
    return member.permissions.has(admin);
}

export const memberIsQuoter = async (interaction: ChatInputCommandInteraction): Promise<boolean> => {
    const memberRoles: string[] = Array.from((interaction.member!.roles as GuildMemberRoleManager).cache.keys());
    const sent: Sentinel = await getSentinel(interaction.guildId!);
    const quoterList: string[] = await sent.quoter_list;
    const intersection = memberRoles.filter(value => quoterList.includes(value));
    return intersection.length == 0 ? false : true;
}

export const getUserRole = async (interaction: ChatInputCommandInteraction): Promise<Role> => {
    let role: Role;
    if (isAdmin(interaction)) {
        role = Role.ADMINISTRATOR;
    }
    else if (await memberIsQuoter(interaction)) {
        role = Role.QUOTER;
    }
    else {
        role = Role.USER;
    }
    return role;
}

