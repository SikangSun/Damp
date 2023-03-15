export type QuoteDefault {
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
    type: "image";
    link: string;
    timestamp: Date;
    title: string;
    quoter: string;
    tag: string;
}