const { Queue } = require("bullmq");
const Employee = require("../model/Employe");

const emailQue = new Queue("email-que", {
  connection: {
    host: "redis-12d75cbc-virenderkumar23435-ed80.a.aivencloud.com",
    port: 20966,
    password: "AVNS_XNQN_xMIQWnTtp-hHpF",
    username: "default",
  },
});

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createNewEmployee = async (req, res) => {
  const newEmployee = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
  };

  if (!newEmployee.firstname || !newEmployee.lastname || !newEmployee.email) {
    return res
      .status(400)
      .json({ message: "First and last names email are required." });
  }
  const isExit = await Employee.findOne({ email: newEmployee.email });
  if (isExit) {
    return res
      .status(400)
      .json({ message: `Employee email ${newEmployee.email} already exists` });
  }
  const adMongo = await Employee.create(req.body);
  emailQue.add(`${new Date()}`, {
    email: adMongo.email,
    id: adMongo.id,
  });

  res.status(201).json(adMongo);
};

const updateEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found` });
  }
  if (req.body.firstname) employee.firstname = req.body.firstname;
  if (req.body.lastname) employee.lastname = req.body.lastname;
  const filteredArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );
  const unsortedArray = [...filteredArray, employee];
  data.setEmployees(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );
  res.json(data.employees);
};

const deleteEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found` });
  }
  const filteredArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );
  data.setEmployees([...filteredArray]);
  res.json(data.employees);
};

const getEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.params.id)
  );
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.params.id} not found` });
  }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
