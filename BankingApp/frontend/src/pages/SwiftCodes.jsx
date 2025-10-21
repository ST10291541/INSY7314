
import React, { useState } from 'react';
import './SwiftCodes.css';

const SwiftCodes = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Sample SWIFT codes data - in a real app this would come from an API
  const [swiftCodes] = useState([
    { bankName: 'Standard Bank of South Africa', swiftCode: 'SBZAZAJJ' },
    { bankName: 'First National Bank', swiftCode: 'FIRNZAJJ' },
    { bankName: 'ABSA Bank', swiftCode: 'ABSAZAJJ' },
    { bankName: 'Nedbank', swiftCode: 'NEDSZAJJ' },
    { bankName: 'Capitec Bank', swiftCode: 'CABLZAJJ' },
    { bankName: 'Investec Bank', swiftCode: 'INVEZAJJ' },
    { bankName: 'Bidvest Bank', swiftCode: 'BIDVZAJJ' },
    { bankName: 'Discovery Bank', swiftCode: 'DISCZAJJ' },
    { bankName: 'TymeBank', swiftCode: 'TYMEZAJJ' },
    { bankName: 'Bank of America', swiftCode: 'BOFAUS3N' },
    { bankName: 'JPMorgan Chase', swiftCode: 'CHASUS33' },
    { bankName: 'Wells Fargo', swiftCode: 'WFBIUS6S' },
    { bankName: 'Citibank', swiftCode: 'CITIUS33' },
    { bankName: 'HSBC Bank', swiftCode: 'HBUKGB4B' },
    { bankName: 'Barclays Bank', swiftCode: 'BARCGB22' },
    { bankName: 'Deutsche Bank', swiftCode: 'DEUTDEFF' },
    { bankName: 'BNP Paribas', swiftCode: 'BNPAFRPP' },
    { bankName: 'Credit Suisse', swiftCode: 'CRESCHZZ' },
    { bankName: 'UBS', swiftCode: 'UBSWCHZH' },
    { bankName: 'Commonwealth Bank of Australia', swiftCode: 'CTBAAU2S' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Filter SWIFT codes based on search term
  const filteredSwiftCodes = swiftCodes.filter(code =>
    code.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.swiftCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="swift-codes-container">
      <h1>SWIFT Codes Directory</h1>
      <p>Welcome, {user.fullName} ({user.role})</p>
      
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by bank name or SWIFT code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="swift-codes-table-container">
        <table className="swift-codes-table">
          <thead>
            <tr>
              <th>Bank Name</th>
              <th>SWIFT Code</th>
            </tr>
          </thead>
          <tbody>
            {filteredSwiftCodes.length === 0 ? (
              <tr>
                <td colSpan="2" className="no-results">
                  No SWIFT codes found matching your search.
                </td>
              </tr>
            ) : (
              filteredSwiftCodes.map((code, index) => (
                <tr key={index}>
                  <td>{code.bankName}</td>
                  <td className="swift-code">{code.swiftCode}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="swift-codes-info">
        <p><strong>Total SWIFT Codes:</strong> {filteredSwiftCodes.length}</p>
        <p><em>SWIFT codes are used for international wire transfers between banks.</em></p>
      </div>
    </div>
  );
};

export default SwiftCodes;
