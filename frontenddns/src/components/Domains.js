import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Records from './Records';

const Domains = () => {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await axios.get('http://localhost:3000/route53/zones');
        console.log('Fetched domains:', response.data);
        setDomains(response.data);
      } catch (error) {
        console.error('Error fetching domains:', error);
      }
    };

    fetchDomains();
  }, []);

  return (
    <div>
      <h1>Domains</h1>
      <table>
        <thead>
          <tr>
            <th>Domain Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {domains.map(domain => (
            <tr key={domain.Id}>
              <td>{domain.Name}</td>
              <td>
                <button onClick={() => setSelectedDomain(domain.Id)}>View Records</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedDomain && <Records domainId={selectedDomain} />}
    </div>
  );
};

export default Domains;
