const mongoose = require("mongoose");

const blogConnection = mongoose.createConnection(
  "mongodb+srv://virenderkumar23435:email@cluster0.jkhqypm.mongodb.net/dev",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

blogConnection.on(
  "error",
  console.error.bind(console, "Blog MongoDB connection error:")
);

blogConnection.once("open", () => {
  console.log("Connected to Blog MongoDB");
});

module.exports = blogConnection;
