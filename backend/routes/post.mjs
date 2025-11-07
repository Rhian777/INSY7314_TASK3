import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req,res)=>{
    let collection = await db.collection("posts");
    let result = await collection.find({}).toArray();
    res.send(results).status(200);
});

router.post("/upload", async (req,res)=>{
    let newDocument = {
        user: req.body.user,
        content: req.body.content,
        image: req.body.image
    };

    let collection = await db.collection("posts");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
});

export default router;