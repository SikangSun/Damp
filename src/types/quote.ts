export type QuoteDefault = {
    id: number;
    type: "message";
    content: string;
    timestamp: Date;
    user: string;
    message: string;
    channel: string;
    guild: string;
    quoter: string;
    tag: string;
}

export type QuoteImage = {
    id: number;
    type: "image";
    link: string;
    timestamp: Date;
    title: string;
    guild: string;
    quoter: string;
    tag: string;
}

export type Sentinel = {
    _id: number,
    type: string,
    seq: number,
    public_server_mode: boolean,
    quoter_list: string[]
}

export enum Role {
    ADMINISTRATOR,
    QUOTER,
    USER,
}