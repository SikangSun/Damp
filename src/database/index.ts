import { QuoteDefault, QuoteImage } from './../types/quote';
import { MongoClient } from 'mongodb'

require('dotenv').config();

export let db: any;

export const dbConnect = async () => { 
    await MongoClient.connect(process.env.MONGODB_URL!, {})
    .then(
    (database?:any) => {
      db = database.db("Default");
    })
    .catch(console.error)
  }

const newServer = async (guildID: string): Promise<void> => {
  const collection = db.createCollection(guildID)
    .catch((err: any) => console.log(err));
  await db.collection(guildID).insertOne({type: "sentinel", _id: 0, seq: 1})
}

const initializeCollection = async (guildID: string) => {
  if (!db) await dbConnect();
  const collectionArray = await db.listCollections().toArray();
  const exist = collectionArray.some((collection: any) => collection.name === guildID)

  if (!exist) {
    newServer(guildID);
  }
  return db.collection(guildID);
}

export const insertQuote = async ( quote: QuoteDefault | QuoteImage): Promise<void> => {
  const temp = await initializeCollection(quote.guild);

  quote.id = await getNextSequence(quote.guild);
  await temp.insertOne(quote)
  .catch((err: any) => console.log(err))
  console.log("Inserted Quote");
  return;
}

export const getAllQuotes = async (guildID: string) => {
  const temp = await initializeCollection(guildID);

  const all = await temp.find({ type: { $ne: 'sentinel' }}).toArray()
  return all;
}

export const getTagQuote = async (tag: string, guildID: string): Promise<QuoteDefault> => {
  const temp = await initializeCollection(guildID);

  const oneQuote: QuoteDefault[] = await temp.find({tag: tag}).toArray()
  return oneQuote[0];
}

export const updateTagQuote = async (identifier: string, newtag: string, input: string, guildID: string): Promise<boolean> => {
  const temp = await initializeCollection(guildID);

  const discriminator = identifier === "tag" ? {tag: input} : {id: input};

  let result = await temp.updateOne(discriminator, {$set: {tag: newtag}})
    .catch((err: any) => {
      console.log(err);
      return false;
    })


  return result.modifiedCount ? true : false;
}

export const deleteOneQuote = async (identifier: string, input: string, guildID: string): Promise<boolean> => {
  const temp = await initializeCollection(guildID);
  const discriminator = identifier === "tag" ? {tag: input} : {id: input};

  let result = await temp.deleteOne(discriminator)
    .catch((err: any) => {
      console.log(err);
      return false;
    })

  return result.deletedCount ? true : false;
}

const getNextSequence = async (guildID: string): Promise<number> => {
  const ret = await db.collection(guildID).findOneAndUpdate(
         { _id: 0 },
         { $inc: { seq: 1 } },
         { new: true}
  );
  return ret.value.seq;
}