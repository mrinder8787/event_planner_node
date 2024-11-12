const paymentModel = require('../model/paymentModel');
const jwt = require('jsonwebtoken');
const bookingModel = require('../model/bookingModel');
const moment = require('moment-timezone');
require('dotenv').config();


exports.paymentget = async (req, res) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
  }
  try {
    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    console.log('decoded token', decodedToken);
    if (!decodedToken) {
      console.error("Failed to decode token:", token);
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }

    if (!decodedToken.customerRef) {
      console.error("Missing customerRef in token:", decodedToken);
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }

    if (!decodedToken.userId) {
      console.error("Missing userId in token:", decodedToken);
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }
    const payment = await paymentModel.find({ customerRef: decodedToken.customerRef });

    if (payment && payment.length > 0) {

      const totalAmount = payment.reduce((acc, curr) => acc + Number(curr.amount), 0);

      return res.status(200).json({
        error: false,
        message: 'Payments Fetched Successfully',
        totalAmount: totalAmount,
        data: payment
      });
    } else {
      return res.status(404).json({
        error: true,
        message: 'No payments found for this customer',
      });
    }


  } catch (error) {
    console.log("error", error.message);
    return res.status(200).json({
      error: true,
      message: error,
    });
  }

}


//-------------------------------- Get amount in booking Id ----------------------



exports.getAmountbyBookingId = async (req, res) => {
  const authToken = req.headers.authorization;
  const bookingId = req.params.bookingId;
  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
  }
  try {
    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    console.log('decoded token', decodedToken);
    if (!decodedToken) {
      console.error("Failed to decode token:", token);
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }

    if (!decodedToken.customerRef) {
      console.error("Missing customerRef in token:", decodedToken);
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }
    if (!decodedToken.userId) {
      console.error("Missing userId in token:", decodedToken);
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }
    const bookingPayment = await paymentModel.find({ bookingid: bookingId });
    const bookingData = await bookingModel.findOne({ bookingId });

    if (bookingPayment && bookingPayment.length > 0) {
      const bookingOtherPayCount = await paymentModel.countDocuments({
        customerRef: decodedToken.customerRef, otherExpenses: { $exists: true },bookingid: bookingId
      });
      const totalOtherExpensesAmount = await paymentModel.aggregate([
        {
          $match: {
            customerRef: decodedToken.customerRef,
            otherExpenses: { $exists: true, $ne: "" },bookingid: bookingId
          }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: { $toDouble: "$amount" } }
          }
        }
      ]);

      console.log("Total other expenses amount:", totalOtherExpensesAmount[0]?.totalAmount || 0);
      const bookingPayCount = await paymentModel.countDocuments({ bookingid: bookingId });
      const bookingAmount = bookingData.bookingAmount;
      const totalAmount = bookingPayment.reduce((acc, curr) => acc + Number(curr.amount), 0);
      const profitLoss = bookingAmount - totalAmount;
      const status = profitLoss > 0 ? 'Profit' : profitLoss < 0 ? 'Loss' : 'Break-even';
      const bookingDateIST = moment(bookingData.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
      const paymentDatesIST = bookingPayment.map(payment =>
        moment(payment.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")
      );
      console.log("Profit/Loss:", profitLoss);
      console.log("Booking Date (IST):", bookingDateIST);
      console.log("Payment Dates (IST):", paymentDatesIST);
      return res.status(200).json({
        error: false,
        message: 'Payments Fetched by bookingId Successfully',
        bookingAmount: bookingData.bookingAmount,
        bookingAdvanceAmount: bookingData.advanceAmount,
        totalAmount: totalAmount,
        profitLoss: profitLoss,
        bookingPay: bookingPayCount,
        status: status,
        otherExpenseCount: bookingOtherPayCount,
        totalExpensesAmount:totalOtherExpensesAmount[0]?.totalAmount || 0,
      });
    } else {
      return res.status(404).json({
        error: true,
        message: 'No payments found for this customer',
      });
    }

  } catch (e) {
    console.log("Catch error", e.message);
    return res.status(500).json({
      error: true,
      message: e.message
    })
  }
}


//--------------------------------Get profit loss by date -------------------------


exports.getAmountbyDate = async (req, res) => {
  const authToken = req.headers.authorization;
  const { startDate, endDate } = req.body;

  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized: Missing authorization token' });
  }

  try {
    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

    if (!decodedToken || !decodedToken.customerRef || !decodedToken.userId) {
      return res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
    }
    if (!startDate || !endDate) {
      const bookingPay = await paymentModel.find({
        customerRef: decodedToken.customerRef
      });
      console.log("hdhh", bookingPay)
      const bookingdata = await bookingModel.find({
        customerRef: decodedToken.customerRef
      });
      if (bookingPay && bookingPay.length > 0) {
        const bookingCount = await bookingModel.countDocuments({ customerRef: decodedToken.customerRef });
        const bookingPayCount = await paymentModel.countDocuments({ customerRef: decodedToken.customerRef });
        const bookingOtherPayCount = await paymentModel.countDocuments({
          customerRef: decodedToken.customerRef, otherExpenses: { $exists: true }
        });

        const totalOtherExpensesAmount = await paymentModel.aggregate([
          {
            $match: {
              customerRef: decodedToken.customerRef,
              otherExpenses: { $exists: true, $ne: "" }
            }
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: { $toDouble: "$amount" } }
            }
          }
        ]);

        console.log("Total other expenses amount:", totalOtherExpensesAmount[0]?.totalAmount || 0);

        const bookingAmount = bookingdata.reduce((acc, curr) => acc + Number(curr.bookingAmount), 0);
        const bookingAdvanceAmount = bookingdata.reduce((acc, curr) => acc + Number(curr.advanceAmount), 0);
        const totalAmount = bookingPay.reduce((acc, curr) => acc + Number(curr.amount), 0);
        const profitLoss = bookingAmount - totalAmount;
        const status = profitLoss > 0 ? 'Profit' : profitLoss < 0 ? 'Loss' : 'Break-even';
        console.log("bookingAmount -", bookingAmount);
        console.log("bookingAdvanceAmount -", bookingAdvanceAmount);
        console.log("bookingAmount totalAmount -", totalAmount);
        console.log("bookingAmount totalAmount profitLoss-", profitLoss);
        console.log("Total Booking Count:", bookingCount);
        console.log("Total Booking Count:", bookingPayCount);
        return res.status(200).json({
          error: false,
          message: 'All Payments Fetched Successfully',
          bookingAmount: bookingAmount,
          bookingAdvanceAmount: bookingAdvanceAmount,
          totalAmount: totalAmount,
          profitLoss: profitLoss,
          status: status,
          totalBooking: bookingCount,
          totalPayCount: bookingPayCount,
          otherExpenseCount: bookingOtherPayCount,
          totalExpensesAmount: totalOtherExpensesAmount[0]?.totalAmount || 0,
        });
      }

    }

    const start = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
    const end = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999));

    console.log("Start Date:", start);
    console.log("End Date:", end);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: true, message: 'Invalid date format' });
    }

    const bookingData = await bookingModel.find({
      customerRef: decodedToken.customerRef,
      createdAt: { $gte: start, $lte: end }
    });

    console.log("Booking Data:", bookingData);
    const bookingOtherPayCount = await paymentModel.countDocuments({
      customerRef: decodedToken.customerRef, createdAt: { $gte: start, $lte: end }, otherExpenses: { $exists: true }
    });
    const totalOtherExpensesAmount = await paymentModel.aggregate([
      {
        $match: {
          customerRef: decodedToken.customerRef,createdAt: { $gte: start, $lte: end },
          otherExpenses: { $exists: true, $ne: "" }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $toDouble: "$amount" } }
        }
      }
    ]);

    console.log("Total other expenses amount:", totalOtherExpensesAmount[0]?.totalAmount || 0);
    if (!bookingData || bookingData.length === 0) {
      return res.status(404).json({ error: true, message: 'No bookings found for the given date range' });
    }


    const bookingPayment = await paymentModel.find({
      customerRef: decodedToken.customerRef,
      createdAt: { $gte: start, $lte: end }
    });

    console.log("Payment Data:", bookingPayment);

    if (bookingPayment && bookingPayment.length > 0) {
      const bookingCount = await bookingModel.countDocuments({
        customerRef: decodedToken.customerRef,
        createdAt: { $gte: start, $lte: end }
      });
      const bookingPayCount = await paymentModel.countDocuments({ customerRef: decodedToken.customerRef, createdAt: { $gte: start, $lte: end } });
      const bookingAmount = bookingData.reduce((acc, curr) => acc + Number(curr.bookingAmount), 0);
      const bookingAdvanceAmount = bookingData.reduce((acc, curr) => acc + Number(curr.advanceAmount), 0);
      const totalAmount = bookingPayment.reduce((acc, curr) => acc + Number(curr.amount), 0);
      const profitLoss = bookingAmount - totalAmount;
      const status = profitLoss > 0 ? 'Profit' : profitLoss < 0 ? 'Loss' : 'Break-even';
      console.log("bookingAmount -", bookingAmount);
      console.log("bookingAdvanceAmount -", bookingAdvanceAmount);
      console.log("bookingAmount totalAmount -", totalAmount);
      console.log("bookingAmount totalAmount profitLoss-", profitLoss);
      console.log("Total Booking Count:", bookingCount);

      return res.status(200).json({
        error: false,
        message: 'Payments Fetched Successfully',
        bookingAmount: bookingAmount,
        bookingAdvanceAmount: bookingAdvanceAmount,
        totalAmount: totalAmount,
        profitLoss: profitLoss,
        totalBooking: bookingCount,
        totalPayCount: bookingPayCount,
        otherExpenseCount: bookingOtherPayCount,
        totalExpensesAmount:totalOtherExpensesAmount[0]?.totalAmount || 0,
        status: status
      });
    } else {
      return res.status(404).json({
        error: true,
        message: 'No payments found within the given date range',
      });
    }
  } catch (e) {
    console.log("Catch error", e.message);
    return res.status(500).json({
      error: true,
      message: e.message
    });
  }
};
