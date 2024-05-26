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

module.exports = router;