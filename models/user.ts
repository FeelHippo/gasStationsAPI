import mongoose from 'mongoose';

export interface UserInterface {
  username: string;
  password: string;
}
interface modelInterface extends mongoose.Model<any> {
  instantiate(authentication: UserInterface): UserDoc
}
export interface UserDoc extends mongoose.Document {
  username: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});

userSchema.statics.instantiate = (authentication: UserInterface) => new User(authentication);

const User = mongoose.model<UserDoc, modelInterface>('User', userSchema);

export { User }