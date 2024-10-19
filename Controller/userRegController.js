const jwt = require('jsonwebtoken');

const userRegistrion = require('../model/userregistrion');
const bcrept = require('bcrypt');

require('dotenv').config();



exports.userRegistrion = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await userRegistrion.findOne({ email });
  const hasPassword = await bcrept.hash(password, 10);
  const userId = `USER-${Date.now()}`;

  if (existingUser) {
    const passwordMatch = await bcrept.compare(password, existingUser.password);

    if (passwordMatch) {
      const expiresIn = 24 * 60 * 60;
      const token = jwt.sign(
        { userId: existingUser._id, customerRef: existingUser.customerRef },
        process.env.ACCESS_SECRET_TOKEN,
        { expiresIn: expiresIn }
      );

      console.log('hdjkhj', token);

      existingUser.Jwttoken = token;
      await existingUser.save();
      return res.status(400).json({
        error: true,
        message: "User alredy Exit",
        data: existingUser,
      })
    }
  }

  const userregistraion = userRegistrion({
    email,
    password: hasPassword,
    // Jwttoken:jwttoken,
    userid: userId,
  });

  const userRegistrionData = await userregistraion.save();
  return res.status(200).json({
    error: false,
    msg: "Register User Successfully!",
    data: userRegistrionData,
  });
}