const express = require('express');
const router = express.Router();
const route53Service = require('../services/route53Service');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const csv = require('csv-parser');

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
    console.log(req.params);
    console.log(req.body);
    const recordData = req.body;
    console.log('Record data received for deletion:',recordData );
    const result = await route53Service.deleteRecord(id, recordData);
    res.json(result);
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).send(error.message);
  }
});


//Bulk Upload
router.post('/zones/hostedzone/:id/bulk-upload', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { file } = req;
    const filePath = file.path;
    
    // Log the mimetype of the uploaded file
    console.log('Uploaded file mimetype:', file.mimetype);

    // Determine if the file is a CSV based on mimetype or file extension
    const isCSV = file.mimetype ;
     console.log('going to parse');
    const records = await parseFile(filePath, isCSV);

    console.log('after parsing came to post bulk');

    for (const record of records) {
      console.log('Processing record:', record,record.Action ); // Add this line
      if (record.Action === 'CREATE') {
        console.log('Action is CREATE. Calling createRecord.'); // Add this line
        await route53Service.createRecord(id, record);
      } else if (record.Action === 'UPDATE') {
        console.log('Action is UPDATE. Calling updateRecord.'); // Add this line
        await route53Service.updateRecord(id, record);
      } else if (record.Action === 'DELETE') {
        console.log('Action is DELETE. Calling deleteRecord.'); // Add this line
       // const { Name, Type, TTL, ResourceRecords } = record;
        await route53Service.deleteRecord(id, record);
      }
    }

    res.json({ message: 'Bulk upload processed successfully' });
  } catch (error) {
    console.error('Error processing bulk upload:', error); // Add this line
    res.status(500).send(error.message);
  }
});

const parseFile = (filePath, isCSV) => {
  return new Promise((resolve, reject) => {
    const records = [];
     console.log('entered parse file');
     console.log(isCSV);
    if (isCSV === 'text/csv') {
      console.log('Parsing CSV file:', filePath);
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          console.log('Row data:', row);
          const record = {
            Action: row.Action,
            Name: row.Name,
            Type: row.Type,
            TTL: parseInt(row.TTL), // Ensure TTL is parsed as integer
            ResourceRecords: JSON.parse(row.ResourceRecords)
          };
          records.push(record);
        })
        .on('end', () => {
          console.log('CSV parsing completed.');
          resolve(records);
        })
        .on('error', (error) => {
          console.error('Error parsing CSV:', error);
          reject(error);
        });
    } else if(isCSV=== 'application/json') {
      console.log('Parsing JSON file:');
      
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading JSON file:', err);
          reject(err);
          return;
        }
        try {
          const json = JSON.parse(data);
          console.log('JSON data:', json);
          resolve(json);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          reject(error);
        }
      });
    }
    else{
      console.error('Error cannot read other type');
    }
  });
};

//filtering Bulk records

router.get('/zones//hostedzone/:id/records/filter', async (req, res) => {
  try {
    const { id } = req.params;
    const { search, type } = req.query; // Get search and filter query parameters
    const records = await route53Service.getRecords(id);

    // Apply search and filter logic
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
    res.status(500).send(error.message);
  }
});

module.exports = router;
