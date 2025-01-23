

exports.gstCalculater = async (req, res) => {
    const { originalAmount, gstRate, transactionType } = req.body;
  
    try {
      if (!originalAmount || !gstRate || !transactionType) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const amount = parseFloat(originalAmount);
      const rate = parseFloat(gstRate);
  
      if (isNaN(amount) || isNaN(rate)) {
        return res.status(400).json({ error: 'Invalid numeric values' });
      }
  
      const gstAmount = (amount * rate) / 100;
      let cgst = 0, sgst = 0, igst = 0;
  
      if (transactionType === 'Intra-State') {
        cgst = gstAmount / 2;
        sgst = gstAmount / 2;
      } else if (transactionType === 'Inter-State') {
        igst = gstAmount;
      } else {
        return res.status(400).json({ error: 'Invalid transaction type' });
      }
  
      const totalAmount = amount + gstAmount;
      const totalWithoutGst = amount - gstAmount;
      console.log("Total Amount", totalAmount);
  
      return res.status(200).json({
        error: false,
        message: "GST Calculated",
        originalAmount: amount,
        gstRate: rate,
        transactionType,
        gstAmount,
        cgst,
        sgst,
        igst,
        totalAmount,
        totalWithoutGst
      });
    } catch (e) {
      return res.status(500).json({
        error: true,
        message: e.message,
      });
    }
  };
  