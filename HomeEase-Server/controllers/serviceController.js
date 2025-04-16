const ServiceModel = require('../models/serviceModel');

const serviceController = {
  getAllServices: async (req, res) => {
    try {
      const result = await ServiceModel.getAllServices();
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  getServiceById: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await ServiceModel.getServiceById(id);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Service not found" });
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getServiceByEmail: async (req, res) => {
    try {
      const email = req.params.email;
      const result = await ServiceModel.getServicesByEmail(email);
      // console.log('Email:', email, 'Result:', result);
      
      if (result && result.length > 0) {  // Check for array length
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "No services found for this email" });
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ 
        error: "Internal Server Error",
        details: error.message 
      });
    }
  },

  createService: async (req, res) => {
    try {
      const service = req.body;
      const result = await ServiceModel.createService(service);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  deleteService: async (req, res) => {
    try {
      const id = req.params.id;
      const result = await ServiceModel.deleteService(id);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  },

  updateService: async (req, res) => {
    try {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await ServiceModel.updateService(id, updatedData);
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
};

module.exports = serviceController;