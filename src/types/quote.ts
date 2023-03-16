export type QuoteDefault {
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

export type QuoteImage {
    id: number;
    type: "image";
    link: string;
    timestamp: Date;
    title: string;
    guild: string;
    quoter: string;
    tag: string;
}