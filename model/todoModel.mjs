import mongoose, { Schema } from "mongoose";
const todoSchema = new Schema({
  title: {
    type: String,
    required: [true, "title 不能为空"],
    trim: true,
    minlength: [1, "title 长度必须在 1-200 之间"],
    maxlength: [200, "title 长度必须在 1-200 之间"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "description 不能超过 500 字符"],
  },
  userEmail: {
    type: String,
    required: [true, "userEmail 不能为空"],
    trim: true,
    match: [/.+@.+\..+/, "userEmail 必须是有效的邮箱地址"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  updateAt: {
    type: Date,
    default: () => new Date(),
  },
  id: {
    type: Number,
    unique: true,
  },
});

const TodoModel = mongoose.model("Todo", todoSchema);

export default TodoModel;
