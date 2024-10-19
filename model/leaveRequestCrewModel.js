const mongoose = require('mongoose');
const leaveRequestCrew = mongoose.Schema({
    reason: {
        type: String,
        requerd: true,
    },
    crewid: {
        type: String,
        requerd: true,
    },
    fromDate: {
        type: String,
        required: true,
    },
    toDate: {
        type: String,
        required: true,
    },
    customerRef: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Pending"
    }
})

module.exports = mongoose.model('LeaveRequestCrew', leaveRequestCrew);