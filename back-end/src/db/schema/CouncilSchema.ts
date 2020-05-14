import { Schema } from 'mongoose'

// TODO: 完善数据结构
export const CouncilMembers = {
    code: {
        type: String,
        required: true,
    },
    cid: {
        type: String,
        required: true,
    },
    did: {
        type: String,
        required: true,
    },
    didName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    introduction: {
        type: String,
    },
    impeachmentVotes: {
        type: Number,
        required: true,
    },
    location: {
        type: Number,
        required: true,
    },
    depositAmount: {
        type: String,
        required: true,
    },
    depositHash: {
        type: String,
        required: true,
    },
    penalty: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    }
}

export const Council = {
    index: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    councilMembers: [CouncilMembers],
}