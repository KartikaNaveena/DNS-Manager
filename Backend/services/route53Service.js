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
          ResourceRecordSet: {
            Name: recordData.Name,
            Type: recordData.Type,
            TTL: recordData.TTL,
            ResourceRecords: recordData.ResourceRecords
          }
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
          ResourceRecordSet: {
            Name: recordData.Name,
            Type: recordData.Type,
            TTL: recordData.TTL,
            ResourceRecords: recordData.ResourceRecords
          }
        }
      ]
    }
  };
  const data = await route53.changeResourceRecordSets(params).promise();
  return data;
};

const deleteRecord = async (hostedZoneId, recordData) => {
  console.log('Deleting record with data:', recordData);
  const params = {
    HostedZoneId: hostedZoneId,
    ChangeBatch: {
      Changes: [
        {
          Action: 'DELETE',
          ResourceRecordSet: {
            Name: recordData.Name,
            Type: recordData.Type,
            TTL: recordData.TTL,
            ResourceRecords: recordData.ResourceRecords
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
