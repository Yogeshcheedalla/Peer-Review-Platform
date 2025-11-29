const mongoose = require("mongoose");

const ProjectTeamSchema = new mongoose.Schema(
    {
        projectId: {
            type: Number,
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("ProjectTeam", ProjectTeamSchema);
