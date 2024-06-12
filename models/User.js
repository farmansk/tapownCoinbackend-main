import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const MissionSchema = new Schema({
    mission_id: { type: String, required: true },
    completed: { type: Boolean, required: true, default: false },
    reward_claimed: { type: Boolean, required: true, default: false }
});

const createDefaultMissions = () => [
    { mission_id: "m1" },
    { mission_id: "m2" },
    { mission_id: "m3" },
    { mission_id: "m4" },
    { mission_id: "m5" },
    { mission_id: "m6" },
    { mission_id: "m7" },
    { mission_id: "m8" }
];

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    user_id: { type: String, required: true, unique: true },
    own_coins: { type: Number, required: true, default: 0 },
    missions: { type: [MissionSchema], default: createDefaultMissions }
});


const User = model('User', UserSchema);
export default User;
