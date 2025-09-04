import mongoose, { Schema } from "mongoose";

const counterSchema = new Schema({
  count: {
    type: String,
    default: "tool",
  },
  id: {
    type: Number,
    default: 0,
  },
});

const CounterModel = mongoose.model("Counter", counterSchema);

export default CounterModel;
