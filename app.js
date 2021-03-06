import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json())

const uri = process.env.MONGODB_URI;
mongoose.connect(uri);
mongoose.connection.once('open', function(){
    console.log('Conection has been made!');
}).on('error', function(error){
    console.log('Error is: ', error);
});


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

app.post("/api", async function(req, res){
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


let port = process.env.PORT;
if(port == null || port == ""){
    port = 5000;
}

app.listen(port, function(){
    console.log("Server started on port 5000")
})
