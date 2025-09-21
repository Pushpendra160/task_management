import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

const User = mongoose.model('User', UserSchema);
export default User;