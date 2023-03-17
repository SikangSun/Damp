import { EmbedBuilder, Client, User, GatewayIntentBits } from 'discord.js';
import { QuoteDefault, QuoteImage } from './../types/quote';

export const idOrTag = (input: string): string => {
    return isNaN(Number(input)) ? "tag" : "id";
}

export const validTag = (input: string): boolean => {
    return isNaN(Number(input)) ? true : false;
}