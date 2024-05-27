const AWS = require('../config/awsConfig');
const route53 = new AWS.Route53();

const getHostedZones = async () => {
  const data = await route53.listHostedZones().promise();
  return data.HostedZones;
};

const getRecords = async (hostedZoneId) => {
  const params = { HostedZoneId: hostedZoneId };
  const data = await route53.listResourceRecordSets(params).promise();
  return data.ResourceRecordSets;
};

const createRecord = async (hostedZoneId, recordData) => {
  console.log('Creating record with data:', recordData); 
  const params = {
    HostedZoneId: hostedZoneId,
    ChangeBatch: {
      Changes: [
        {
          Action: 'CREATE',
          ResourceRecordSet: recordData
        }
      ]
    }
  };
  const data = await route53.changeResourceRecordSets(params).promise();
  return data;
};

const updateRecord = async (hostedZoneId, recordData) => {
  console.log('Updating record with data:', recordData); 
  const params = {
    HostedZoneId: hostedZoneId,
    ChangeBatch: {
      Changes: [
        {
          Action: 'UPSERT',
          ResourceRecordSet: recordData
        }
      ]
    }
  };
  const data = await route53.changeResourceRecordSets(params).promise();
  return data;
};

const deleteRecord = async (hostedZoneId, recordName, recordType, ttl, resourceRecords) => {
  console.log('Deleting record with data:', { recordName, recordType, ttl, resourceRecords });
  const params = {
    HostedZoneId: hostedZoneId,
    ChangeBatch: {
      Changes: [
        {
          Action: 'DELETE',
          ResourceRecordSet: {
            Name: recordName,
            Type: recordType,
            TTL: ttl,
            ResourceRecords: resourceRecords.map(record => ({ Value: record.Value }))
          }
        }
      ]
    }
  };
  const data = await route53.changeResourceRecordSets(params).promise();
  return data;
};


module.exports = {
  getHostedZones,
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord
};
