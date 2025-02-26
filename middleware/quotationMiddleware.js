const { body, validationResult } = require("express-validator");

const validateQuotation = [
    body("customerRef").notEmpty().withMessage("Customer reference is required"),
    body("customerName").notEmpty().withMessage("Customer name is required"),
    body("customerEmail").isEmail().withMessage("Valid email is required"),
    body("customerPhone").isMobilePhone().withMessage("Valid phone number is required"),
    body("fromDate").isISO8601().toDate().withMessage("Valid fromDate is required"),
    body("toDate").isISO8601().toDate().withMessage("Valid toDate is required"),
    body("pinCode").isNumeric().withMessage("Pin code must be a number"),
    body("subTotalAmount").isNumeric().withMessage("SubTotalAmount must be a number"),
    body("TotalAmount").isNumeric().withMessage("TotalAmount must be a number"),
    body("includeGstAmount").isNumeric().withMessage("includeGstAmount must be a number"),
   
    body("bookingitem")
        .isArray({ min: 1 }).withMessage("Booking items must be a non-empty array")
        .custom((items) => items.every(item => typeof item === "string"))
        .withMessage("Each booking item must be a string"),

    body("bookingEvent")
        .isArray({ min: 1 }).withMessage("Booking events must be a non-empty array")
        .custom((events) => events.every(event => typeof event === "string"))
        .withMessage("Each booking event must be a string"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateQuotation };
