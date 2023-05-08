import { idOrTag } from './../utils/validation';
import { QuoteDefault, QuoteImage, Sentinel, QuoteVoice } from './../types/quote';
import { MongoClient } from 'mongodb'

require('dotenv').config();

export let db: any;


export const insertQuote = async ( quote: QuoteDefault | QuoteImage | QuoteVoice): Promise<void> => {
  const temp = await initializeCollection(quote.guild);
  quote.id = await getNextSequence(quote.guild);
  await temp.insertOne(quote)
    .catch((err: any) => console.log(err))
  return;
}



export const getRandomQuote = async (guildID: string, size: number) => {
  const temp = await initializeCollection(guildID);
  const all = await temp.aggregate([
    { $match: { type: { $ne: "sentinel" } } },
    { $sample: { size: size } }
  ]).toArray()
  return all;
}



export const getAllQuotes = async (guildID: string) => {
  const temp = await initializeCollection(guildID);
  const all = await temp.find({ type: { $ne: 'sentinel' }}).toArray()
  return all;
}


export const getNumberOfQuotesByUser = async (guildID: string, quoterID: string): Promise<number> => {
  const temp = await initializeCollection(guildID);
  const count = await temp.countDocuments({ quoter: { $eq: quoterID } });
  return count;
}


export const getQuote = async (input: string, guildID: string): Promise<QuoteDefault | QuoteImage> => {
  const temp = await initializeCollection(guildID);
  const oneQuote: QuoteDefault[] = await temp.find(idOrTag(input) === "tag" ? {tag: input} : {id: Number(input)}).toArray()
  return oneQuote[0];
}


export const updateTagQuote = async (identifier: string, newtag: string, input: string, guildID: string): Promise<boolean> => {
  const temp = await initializeCollection(guildID);
  const discriminator = idOrTag(input) === "tag" ? {tag: input} : {id: Number(input)};
  let result = await temp.updateOne(discriminator, {$set: {tag: newtag}})
    .catch((err: any) => {console.log(err);return false;})
  return result.modifiedCount ? true : false;
}


export const deleteOneQuote = async (identifier: string, input: string, guildID: string): Promise<boolean> => {
  const temp = await initializeCollection(guildID);
  const discriminator = idOrTag(input) === "tag" ? {tag: input} : {id: Number(input)}
  let result = await temp.deleteOne(discriminator)
    .catch((err: any) => { console.log(err); return false;})
  return result.deletedCount ? true : false;
}


export const getSentinel = async (guild: string): Promise<Sentinel> => {
  const temp = await initializeCollection(guild);

  return await temp.findOne({ type: 'sentinel' })!;
}



export const setPublicServerMode = async (guildID: string, input: boolean): Promise<boolean> => {
  const temp = await initializeCollection(guildID);

  const ret = await temp.findOneAndUpdate(
      { _id: 0 },
      { $set: { public_server_mode: input }},
      { new: true} 
    );

  return true;
}



export const addRoleToQuoter = async (roleid: string, guildID: string): Promise<void>  => {
  const temp = await initializeCollection(guildID);
  const filter = { _id: 0};
  const update = { $addToSet: { quoter_list: roleid } };
  const result = await temp.updateOne(filter, update);
}



export const deleteRoleInQuoter = async (roleid: string, guildID: string): Promise<void>  => {
  const temp = await initializeCollection(guildID);
  const filter = { _id: 0};
  const update = { $pull: { quoter_list: roleid } };
  const result = await temp.updateOne(filter, update);
}














const getNextSequence = async (guildID: string): Promise<number> => {
  const ret = await db.collection(guildID).findOneAndUpdate(
         { _id: 0 },
         { $inc: { seq: 1 } },
         { new: true}
  );
  return ret.value.seq;
}


export const dbConnect = async () => { 
  await MongoClient.connect(process.env.MONGODB_URL!, {})
    .then((database?:any) => {db = database.db("Default");})
    .catch(console.error)
}


const newServer = async (guildID: string): Promise<void> => {
  const collection = db.createCollection(guildID)
    .catch((err: any) => console.log(err));
  await db.collection(guildID).insertOne({type: "sentinel", _id: 0, seq: 1, public_server_mode: false, quoter_list: []})
}


const initializeCollection = async (guildID: string) => {
  if (!db) await dbConnect();
  const collectionArray = await db.listCollections().toArray();
  const exist = collectionArray.some((collection: any) => collection.name === guildID)
  if (!exist) newServer(guildID);
  return db.collection(guildID);
}



