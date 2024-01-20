const mongoose = require("mongoose");

// Define the employee schema
const employeeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
});

// Create the Employee model
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
