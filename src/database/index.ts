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
  //console.log(all);
  return all;
}
  
