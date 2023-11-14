"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatedSample = void 0;
var mongoose_1 = require("mongoose");
var ratedSampleSchema = new mongoose_1.Schema({
    commissionMemberId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "CommissionMember" },
    sampleId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Sample" },
    rating: { type: Number, required: true }
});
exports.RatedSample = (0, mongoose_1.model)("RatedSample", ratedSampleSchema);
