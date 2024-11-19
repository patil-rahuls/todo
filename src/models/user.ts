import { Schema, model } from "mongoose";
import { User } from '../interfaces/user.js'
import bcrypt from 'bcrypt';

const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
});

userSchema.pre('save', async function(next){
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.verifyPassword = async function(inputPassword: string){
  return bcrypt.compare(inputPassword, this.password);
}

export default model("User", userSchema);
