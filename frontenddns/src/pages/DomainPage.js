import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DomainDistributionChart from '../components/DomainDistributionChart';
import '../styles/DomainPage.css';

const DomainPage = () => {
  const [domains, setDomains] = useState([]);
  const [domainDistribution, setDomainDistribution] = useState({});
  const [showChart, setShowChart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await axios.get('http://localhost:3000/route53/zones');
      setDomains(response.data);
      // Calculate domain distribution
      const distribution = response.data.reduce((acc, domain) => {
        const domainName = domain.Name.split('.').slice(-2).join('.');
        acc[domainName] = (acc[domainName] || 0) + 1;
        return acc;
      }, {});

      setDomainDistribution(distribution);
    } catch (error) {
      console.error('Error fetching domains:', error);
    }
  };

  const fetchDomainDistribution = async (zoneId) => {
    try {
      const response = await axios.get(`http://localhost:3000/route53/zones/hostedzone/${zoneId}/domain-distribution`);
      setDomainDistribution(response.data);
      setShowChart(true);
    } catch (error) {
      console.error('Error fetching domain distribution:', error);
    }
  };

  return (
    <div className="domain-page">
      <h2>Domains</h2>
      <table>
        <thead>
          <tr>
            <th>Domain Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {domains.map(domain => (
            <tr key={domain.Id}>
              <td>{domain.Name}</td>
              <td>
                <button onClick={() =>navigate(`/records/${domain.Id}`)}>View Records</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DomainDistributionChart domainDistribution={domainDistribution} />
    </div>
  );
};

export default DomainPage;
