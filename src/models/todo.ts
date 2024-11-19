import { Schema, model } from "mongoose";
import { Todo } from '../interfaces/todo.js';

const todoSchema = new Schema<Todo>({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
  dueDate: {
    type: String,
    required: false,
    index: true
  },
  completed: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: String,
    required: true
  }
});

export default model("Todo", todoSchema);
