import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.MONGO_URI;
const client = new MongoClient(connectionString);

let db;
try {
  await client.connect();
  console.log("✅ MongoDB Connected Successfully");
  db = client.db("paymentsDB");
} catch (err) {
  console.error("❌ MongoDB Connection Error:", err);
}

export default db;


/*import {MongoClient} from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.dotenv.MongoClient || "";

console.log(connectionString);

const client = new MongoClient(connectionString);

let conn;

try{
    conn = await client.connect();
    console.log("Bullshit DB connected");

}catch(e){
    console.error(e);
}

let db = client.db("users");

export default db;*/