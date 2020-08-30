const mongoose = require('mongoose');

const URI ="mongodb+srv://nurcholis:nurcholis@clusterjp-u9ur2.mongodb.net/nanda-nurcholis?retryWrites=true&w=majority";

const connectDB = async () => {
  await mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  console.log('db connected..!');
};

module.exports = connectDB;