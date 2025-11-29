const mongoose = require("mongoose");
const Submission = require("./models/Submission");
const Assignment = require("./models/Assignment");
const Review = require("./models/Review");
const User = require("./models/User");

mongoose
    .connect("mongodb://127.0.0.1:27017/assignmentApp")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

const debugPeerReview = async () => {
    try {
        // 1. Find a student user
        const student = await User.findOne({ role: "student" });
        if (!student) {
            console.log("No student found");
            process.exit();
        }
        console.log(`Debug for Student: ${student.email} (${student._id})`);

        // 2. Find an assignment
        const assignment = await Assignment.findOne();
        if (!assignment) {
            console.log("No assignment found");
            process.exit();
        }
        console.log(`Assignment: ${assignment.title} (${assignment._id})`);

        // 3. Find all submissions for this assignment
        const submissions = await Submission.find({ assignment: assignment._id });
        console.log(`Total Submissions Found: ${submissions.length}`);
        submissions.forEach(s => console.log(` - Submission ID: ${s._id}, Student ID: ${s.student}`));

        // 4. Find reviews by this student
        const myReviews = await Review.find({ author: student._id });
        const reviewedSubmissionIds = myReviews.map((r) => r.submission.toString());
        console.log(`Reviewed IDs: ${JSON.stringify(reviewedSubmissionIds)}`);

        // 5. Apply Filter Logic
        const filtered = submissions.filter(
            (s) => {
                const isReviewed = reviewedSubmissionIds.includes(s._id.toString());
                const isOwn = s.student.toString() === student._id.toString();
                console.log(`Checking Sub ${s._id}: Reviewed? ${isReviewed}, Own? ${isOwn}`);
                return !isReviewed && !isOwn;
            }
        );

        console.log(`Filtered Result Count: ${filtered.length}`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debugPeerReview();
