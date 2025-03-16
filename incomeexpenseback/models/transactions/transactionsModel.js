import mongoose from 'mongoose';

const transactionSchma = new mongoose.Schema({
    name : {type : String , required : true},
    amount : {type : Number , required : true},
    date : { type : Date , required : true},
    type : { type : String , enum : ["income" , "expense"] , required : true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
})

const Transaction = mongoose.model("Transaction" , transactionSchma)

export default Transaction;