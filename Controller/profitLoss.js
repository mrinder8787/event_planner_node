const express = require('express');

function getWorkingDays(year, month) {
    const date = new Date(year, month - 1, 1);
    let workingDays = 0;
  
    while (date.getMonth() === month - 1) {
      const day = date.getDay();
      if (day !== 0 && day !== 6) {
        workingDays++;
      }
      date.setDate(date.getDate() + 1);
    }
  
    return workingDays;
  }
  
exports.profitLoss=async(req,res)=>{
    const { monthlySalary, year, month } = req.body;
  
    // Input Validation
    if (
      typeof monthlySalary !== 'number' ||
      typeof year !== 'number' ||
      typeof month !== 'number' ||
      month < 1 ||
      month > 12
    ) {
      return res.status(400).json({
        error: true,
        message: 'Invalid input. Please provide valid monthlySalary, year, and month.',
      });
    }
  
    // Calculate Working Days
    const workingDays = getWorkingDays(year, month);
  
    if (workingDays === 0) {
      return res.status(400).json({
        error: true,
        message: 'The specified month has no working days.',
      });
    }
  
    // Calculate Daily Salary
    const dailySalary = monthlySalary / workingDays;
  
    // Calculate Half-Day Salary
    const halfDaySalary = dailySalary / 2;
  
    res.json({
      error: false,
      data: {
        monthlySalary,
        year,
        month,
        workingDays,
        dailySalary: parseFloat(dailySalary.toFixed(2)),
        halfDaySalary: parseFloat(halfDaySalary.toFixed(2)), // Return half-day salary
      },
    });
}