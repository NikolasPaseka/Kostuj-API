"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionMember = void 0;
const mongoose_1 = require("mongoose");
const commissionMemberSchema = new mongoose_1.Schema({
    catalogueId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Catalogue" },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" }
});
exports.CommissionMember = (0, mongoose_1.model)("CommissionMember", commissionMemberSchema);
