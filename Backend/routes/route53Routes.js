const express = require('express');
const router = express.Router();
const route53Service = require('../services/route53Service');

router.get('/zones', async (req, res) => {
  try {
    const hostedZones = await route53Service.getHostedZones();
    res.json(hostedZones);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/zones//hostedzone/:id/records', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching records for hosted zone: ${id}`); 
    const records = await route53Service.getRecords(id);
    res.json(records);
  } catch (error) {
    console.error(`Error fetching records for hosted zone: ${id}`, error);
    res.status(500).send(error.message);
  }
});

// Create DNS Record
router.post('/zones/hostedzone/:id/records', async (req, res) => {
  console.log('POST /zones/hostedzone/:id/records endpoint hit'); // Add this line
  try {
    const { id } = req.params;
    const recordData = req.body;
    console.log('Record data received for creation:', recordData); // Add this line
    const result = await route53Service.createRecord(id, recordData);
    res.json(result);
  } catch (error) {
    console.log('error');
    res.status(500).send(error.message);
  }
});

// Update DNS Record
router.put('/zones//hostedzone/:id/records', async (req, res) => {
  try {
    const { id } = req.params;
    const recordData = req.body;
    console.log('Record data received for update:', recordData); // Add this line
    const result = await route53Service.updateRecord(id, recordData);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete DNS Record
router.delete('/zones/hostedzone/:id/records', async (req, res) => {
  try {
    const { id } = req.params;
    const { recordName, recordType, ttl, resourceRecords } = req.body;
    console.log('Record data received for deletion:', { recordName, recordType, ttl, resourceRecords });
    const result = await route53Service.deleteRecord(id, recordName, recordType, ttl, resourceRecords);
    res.json(result);
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
