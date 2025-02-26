const path = require("path");
const upload = require("../middleware/quotationPdf");
const { sendEmailWithAttachment } = require("../Controller/mailController");

exports.sendQuotationEmail = async (req, res) => {
    try {
      
        if (!req.file) {
            return res.status(400).json({ success: false, message: "PDF file is required" });
        }

        const { customerEmail, customerName } = req.body;
        const pdfPath = req.file.path;

        const emailResponse = await sendEmailWithAttachment(
            customerEmail,
            "Your Quotation",
            `<!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
                    .container { max-width: 600px; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
                    h2 { color: #333333; text-align: center; }
                    p { font-size: 14px; color: #555555; line-height: 1.6; }
                    .button { background: #007BFF; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777777; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Quotation for Photography & Videography</h2>
                    <p>Dear ${customerName},</p>
                    <p>We appreciate your interest in our services. Please find attached the quotation for your photography and videography requirements.</p>
                    <p>We are excited to collaborate with you and ensure your special moments are beautifully captured.</p>
                    <p>For any queries, feel free to reach out.</p>
                    <p><strong>Best regards,</strong><br>Event Planner</p>
                    <a href="#" class="button">View Quotation</a>
                    <div class="footer">
                        © 2024 Event Planner. All Rights Reserved.
                    </div>
                </div>
            </body>
            </html>`,
            pdfPath
        );

        res.status(200).json(emailResponse);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
