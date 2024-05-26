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

module.exports = {
  getHostedZones,
  getRecords,
};
