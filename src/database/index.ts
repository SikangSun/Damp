import { QuoteDefault } from './../types/quote';
import { MongoClient } from 'mongodb'

require('dotenv').config();

export let db: any;

export const dbConnect = async () => { 
    await MongoClient.connect(process.env.MONGODB_URL!, {})
    .then(
    (database?:any) => {
      db = database;
    })
    .catch(console.error)
  }
  
export const insertQuote = async ( quote: QuoteDefault ): Promise<void> => {
  if (!db) await dbConnect();
  const temp = db.db("Default");

  await temp.collection("quotes").insertOne(quote)
  .catch((err: any) => console.log(err))
  console.log("Inserted Quote");
  return;
}

export const getAllQuotes = async () => {
  if (!db) await dbConnect();
  const temp = db.db("Default");

  const all = await temp.collection("quotes").find({}).toArray()
  return all;
}

export const getTagQuote = async (tag: string): Promise<QuoteDefault> => {
  if (!db) await dbConnect();
  const temp = db.db("Default");

  const one: QuoteDefault[] = await temp.collection("quotes").find({tag: tag}).toArray()
  return one[0];
}

export const updateTagQuote = async (tag: string, newtag: string, id: string): Promise<boolean> => {
  if (!db) await dbConnect();
  const temp = db.db("Default");

  let result = await temp.collection("quotes").updateOne({tag: tag}, {$set: {tag: newtag}})
    .catch((err: any) => {
      console.log(err);
      return false;
    })
  console.log(result);
  if (!result.modifiedCount) {
    result = await temp.collection("quotes").updateOne({message: id}, {$set: {tag: newtag}})
      .catch((err: any) => {
        console.log(err);
        return false;
      })
  }

  return result.modifiedCount ? true : false;
}

export const deleteOneQuote = async (identifier: string, input: string): Promise<boolean> => {
  if (!db) await dbConnect();
  const temp = db.db("Default");
  const discriminator = identifier === "tag" ? {tag: input} : {message: input};

  let result = await temp.collection("quotes").deleteOne(discriminator)
    .catch((err: any) => {
      console.log(err);
      return false;
    })
  // console.log(result);


  return result.deletedCount ? true : false;
}