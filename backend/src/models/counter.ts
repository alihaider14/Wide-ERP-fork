import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 1000 }
});

const Counter =  mongoose.model("counter", counterSchema);

export default Counter;