const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

const route53Service = require('../services/route53Service');
const { register, login } = require('../controllers/authController');

//Middleware to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Authentication Routes
router.post('/register', register); // Route for user registration
router.post('/login', login); // Route for user login

// Fetch all hosted zones
router.get('/zones', getAllHostedZones);

// Fetch records for a hosted zone
router.get('/zones/hostedzone/:id/records', getHostedZoneRecords);

// Create DNS Record
router.post('/zones/hostedzone/:id/records', createRecord);

// Update DNS Record
router.put('/zones/hostedzone/:id/records', updateRecord);

// Delete DNS Record
router.delete('/zones/hostedzone/:id/records', deleteRecord);

// Fetch domain distribution for a hosted zone
router.get('/zones/hostedzone/:id/domain-distribution', getDomainDistribution);

// Fetch record type distribution for a hosted zone
router.get('/zones/hostedzone/:id/record-type-distribution', getRecordTypeDistribution);

// Bulk Upload
router.post('/zones/hostedzone/:id/bulk-upload', upload.single('file'), bulkUpload);

// Filtering Bulk records
router.get('/zones/hostedzone/:id/records/filter', filterRecords);

module.exports = router;

// Handlers for Route Functions

async function getAllHostedZones(req, res) {
  try {
    const hostedZones = await route53Service.getHostedZones();
    res.json(hostedZones);
  } catch (error) {
    handleError(res, error);
  }
}

async function getHostedZoneRecords(req, res) {
  try {
    const { id } = req.params;
    const records = await route53Service.getRecords(id);
    res.json(records);
  } catch (error) {
    handleError(res, error);
  }
}

async function createRecord(req, res) {
  try {
    const { id } = req.params;
    const recordData = req.body;
    const result = await route53Service.createRecord(id, recordData);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}

async function updateRecord(req, res) {
  try {
    const { id } = req.params;
    const recordData = req.body;
    const result = await route53Service.updateRecord(id, recordData);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}

async function deleteRecord(req, res) {
  try {
    const { id } = req.params;
    const recordData = req.body;
    const result = await route53Service.deleteRecord(id, recordData);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}

async function getDomainDistribution(req, res) {
  try {
    const { id } = req.params;
    const { domainDistribution } = await route53Service.getRecords(id);
    res.json(domainDistribution);
  } catch (error) {
    handleError(res, error);
  }
}

async function getRecordTypeDistribution(req, res) {
  try {
    const { id } = req.params;
    const { typeDistribution } = await route53Service.getRecords(id);
    res.json(typeDistribution);
  } catch (error) {
    handleError(res, error);
  }
}

async function bulkUpload(req, res) {
  try {
    const { id } = req.params;
    const { file } = req;
    const records = await parseFile(file);
    await processBulkUpload(id, records);
    res.json({ message: 'Bulk upload processed successfully' });
  } catch (error) {
    handleError(res, error);
  }
}

async function filterRecords(req, res) {
  try {
    const { id } = req.params;
    const { search, type } = req.query;
    const records = await route53Service.getRecords(id);
    let filteredRecords = records;
    if (search) {
      filteredRecords = filteredRecords.filter(record => 
        record.Name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (type) {
      filteredRecords = filteredRecords.filter(record => record.Type === type);
    }
    res.json(filteredRecords);
  } catch (error) {
    handleError(res, error);
  }
}

// Error handling function
function handleError(res, error) {
  console.error('Error:', error);
  res.status(500).send(error.message);
}

// Function to parse file based on mimetype
async function parseFile(file) {
  const filePath = file.path;
  if (file.mimetype === 'text/csv') {
    return parseCSV(filePath);
  } else if (file.mimetype === 'application/json') {
    return parseJSON(filePath);
  } else {
    throw new Error('Unsupported file type');
  }
}

// Parse CSV file and return records
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const records = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        records.push(row);
      })
      .on('end', () => {
        resolve(records);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Parse JSON file and return records
function parseJSON(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    });
  });
}

// Process bulk upload of records
async function processBulkUpload(id, records) {
  for (const record of records) {
    if (record.Action === 'CREATE') {
      await route53Service.createRecord(id, record);
    } else if (record.Action === 'UPDATE') {
      await route53Service.updateRecord(id, record);
    } else if (record.Action === 'DELETE') {
      await route53Service.deleteRecord(id, record);
    }
  }
}
