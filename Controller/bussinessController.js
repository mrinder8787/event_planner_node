const Business = require('../model/bussinessaddModel');
const jwt = require('jsonwebtoken');
const { upload, checkFileSize } = require('../middleware/upload');

const addBusiness = (req, res) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }
  const token = authToken.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

  upload(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: err });
    } else {
      if (req.file == undefined) {
        console.error('No file selected!');
        return res.status(400).json({ message: 'No file selected!' });
      } else {

        checkFileSize(req, res, () => {
          console.log('Uploaded file:', req.file);

          const { name, contactNumber, state, city, address, maxBidAmount ,businessDescription} = req.body;
          if (!name || !address ) {
            return res.status(400).json({ error: 'BussinessName and fullAdress are required.' });
          }


          const newBusiness = new Business({
            BussinessName: name,
            contactNumber: contactNumber,
            state: state,
            city: city,
            fullAdress: address,
            maxBidAmount: maxBidAmount,
            imageUrl: req.file.path,
            businessDescription,
            customerRef: decodedToken.customerRef
          });

          newBusiness.save()
            .then(business => res.json({
              error: false,
              message: "Bussiness Add Successfully !",
              data: [business]
            }))
            .catch(err => res.status(500).json({ error: err.message }));
        });
      }
    }
  });
};


module.exports = {
  addBusiness
};
