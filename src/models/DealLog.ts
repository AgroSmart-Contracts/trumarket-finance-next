import mongoose, { Schema, Document } from 'mongoose';

export interface IDealLog extends Document {
    dealId: number;
    event: string;
    args: any;
    blockNumber: number;
    blockTimestamp: Date;
    txHash: string;
    message: string;
}

const DealLogSchema = new Schema({
    dealId: {
        type: Number,
        required: true,
    },
    event: {
        type: String,
        required: true,
    },
    args: {
        type: Schema.Types.Mixed,
        required: true,
    },
    blockNumber: {
        type: Number,
        required: true,
    },
    blockTimestamp: {
        type: Date,
        required: true,
    },
    txHash: {
        type: String,
        required: true,
    },
    message: {
        type: String,
    },
}, {
    timestamps: true,
});

// Create the Mongoose model for DealLogs
const DealLog = mongoose.model<IDealLog>('DealsLogs', DealLogSchema);

export default DealLog;
