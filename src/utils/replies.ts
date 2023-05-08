import {
  InteractionReplyOptions,
  //WebhookEditMessageOptions,
} from 'discord.js'

export const Colors = {
  error: 0xf54242,
  success: 0x49be25,
}

interface ReplyObject {
  error: (msg: string) => InteractionReplyOptions;
  success: (msg: string) => InteractionReplyOptions;
}


export const Reply: ReplyObject = {
  error: (msg: string): InteractionReplyOptions => {
    return {
      ephemeral: true,
      embeds: [{
        color: Colors.error,
        description: msg
      }]
    };
  },
  success: (msg: string): InteractionReplyOptions => {
    return {
      embeds: [{
        color: Colors.success,
        description: msg
      }]
    };
  }
}

export const EditReply = {
  error(msg: string){
    return {
      embeds: [{
        color: Colors.error,
        description: msg
      }]
    }
  }

}
