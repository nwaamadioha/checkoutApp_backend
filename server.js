import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json())
dotenv.config();

const uri = process.env.ATLAS_URI
const connect = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to mongoDB");
    } catch (error) {
        throw error;
    }
};

const cardSchema = new mongoose.Schema({
    cardNumber: Number,
    expDate: String,
    cvv: Number,
    amount: Number
})

const Card = mongoose.model("Card", cardSchema)
app.get("/", function(req, res){
    res.send("Just an API");
  });

app.post("/", async function(req, res){
    const card = new Card(req.body);
    await card.save().then(() => { 
        Card.findOne({ cardNumber: req.body.cardNumber}, function(err, card){
            if(err){
                console.log(err)
            }else{
                const RequestId = (card._id).toString()
                res.json({RequestId: RequestId, Amount: card.amount})
            }
        })
    }).catch( err=> {
        res.status(400).json("Error: " + err);
    }); 
})


// mongoose.connect(uri);
// const connection = mongoose.connection;
// connection.once("open", () => {
//     console.log("Mongodb connection established");
// })



app.listen(5000, function(){
    connect();
    console.log("Server started on port 5000")
})
