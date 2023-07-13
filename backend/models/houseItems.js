import mongoose from "mongoose";

const houseSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required: true
        },
        prevText: {
            type: String
        },
        text: {
          type: String
        },
        startPrice: {
          type: Number,
          required: true
        },
        currentPrice: {
          type: Number,
        },
        finishPrice: {
          type: Number
        },
        winnerUser: {
          type: Array,
          default: []
        },
        images: {
            type: Array,
            default: []
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
        userCount: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },{
        timestamps: true
    }
);
export default mongoose.model('House', houseSchema)