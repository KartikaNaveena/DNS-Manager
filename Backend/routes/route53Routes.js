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

router.get('/zones/:id/records', async (req, res) => {
  try {
    const { id } = req.params;
    const records = await route53Service.getRecords(id);
    res.json(records);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
