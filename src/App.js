import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("balance");

  // Test wallet address (Vitalik's address for demo)
  const testAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

  const apiCall = async (endpoint, params = {}) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `http://localhost:3000/api/moralis/${endpoint}${queryString ? `?${queryString}` : ''}`;
      
      console.log(`🌐 Making API call to: ${url}`);
      const response = await axios.get(url);
      
      console.log("✅ API Response:", response.data);
      setData(response.data);
    } catch (err) {
      console.error("❌ API Error:", err);
      setError(err.response?.data?.error || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleHealthCheck = () => {
    apiCall("health");
  };

  const handleGetBalance = () => {
    apiCall(`wallet-balance/${testAddress}`);
  };

  const handleGetTokenBalances = () => {
    apiCall(`token-balances/${testAddress}`);
  };

  const handleGetNFTBalances = () => {
    apiCall(`nft-balances/${testAddress}`);
  };

  const handleGetTransactions = () => {
    apiCall(`transactions/${testAddress}`, { limit: 5 });
  };

  const renderData = () => {
    if (!data) return null;

    switch (activeTab) {
      case "health":
        return (
          <div className="data-display">
            <h3>Health Check Response</h3>
            <p><strong>Status:</strong> {data.status}</p>
            <p><strong>Message:</strong> {data.message}</p>
            <p><strong>Timestamp:</strong> {data.timestamp}</p>
          </div>
        );

      case "balance":
        return (
          <div className="data-display">
            <h3>Wallet Balance Response</h3>
            <p><strong>Address:</strong> {data.address}</p>
            <p><strong>Chain:</strong> {data.chain}</p>
            <p><strong>Balance (ETH):</strong> {data.balance}</p>
            <p><strong>Balance (Wei):</strong> {data.balanceWei}</p>
            <p><strong>Timestamp:</strong> {data.timestamp}</p>
          </div>
        );

      case "tokens":
        return (
          <div className="data-display">
            <h3>Token Balances Response</h3>
            <p><strong>Address:</strong> {data.address}</p>
            <p><strong>Chain:</strong> {data.chain}</p>
            <p><strong>Token Count:</strong> {data.count}</p>
            <p><strong>Timestamp:</strong> {data.timestamp}</p>
            {data.tokens && data.tokens.length > 0 && (
              <div>
                <h4>Tokens:</h4>
                <div className="token-list">
                  {data.tokens.slice(0, 5).map((token, index) => (
                    <div key={index} className="token-item">
                      <p><strong>Symbol:</strong> {token.symbol}</p>
                      <p><strong>Name:</strong> {token.name}</p>
                      <p><strong>Balance:</strong> {token.balance}</p>
                      <p><strong>Decimals:</strong> {token.decimals}</p>
                    </div>
                  ))}
                  {data.tokens.length > 5 && (
                    <p>... and {data.tokens.length - 5} more tokens</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case "nfts":
        return (
          <div className="data-display">
            <h3>NFT Balances Response</h3>
            <p><strong>Address:</strong> {data.address}</p>
            <p><strong>Chain:</strong> {data.chain}</p>
            <p><strong>NFT Count:</strong> {data.count}</p>
            <p><strong>Timestamp:</strong> {data.timestamp}</p>
            {data.nfts && data.nfts.length > 0 && (
              <div>
                <h4>NFTs:</h4>
                <div className="nft-list">
                  {data.nfts.slice(0, 3).map((nft, index) => (
                    <div key={index} className="nft-item">
                      <p><strong>Name:</strong> {nft.name}</p>
                      <p><strong>Symbol:</strong> {nft.symbol}</p>
                      <p><strong>Token ID:</strong> {nft.tokenId}</p>
                      <p><strong>Contract:</strong> {nft.tokenAddress}</p>
                    </div>
                  ))}
                  {data.nfts.length > 3 && (
                    <p>... and {data.nfts.length - 3} more NFTs</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case "transactions":
        return (
          <div className="data-display">
            <h3>Transactions Response</h3>
            <p><strong>Address:</strong> {data.address}</p>
            <p><strong>Chain:</strong> {data.chain}</p>
            <p><strong>Transaction Count:</strong> {data.count}</p>
            <p><strong>Timestamp:</strong> {data.timestamp}</p>
            {data.transactions && data.transactions.length > 0 && (
              <div>
                <h4>Recent Transactions:</h4>
                <div className="transaction-list">
                  {data.transactions.slice(0, 3).map((tx, index) => (
                    <div key={index} className="transaction-item">
                      <p><strong>Hash:</strong> {tx.hash}</p>
                      <p><strong>From:</strong> {tx.fromAddress}</p>
                      <p><strong>To:</strong> {tx.toAddress}</p>
                      <p><strong>Value:</strong> {tx.value}</p>
                    </div>
                  ))}
                  {data.transactions.length > 3 && (
                    <p>... and {data.transactions.length - 3} more transactions</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Moralis API Integration Test</h1>
        <p>Testing Moralis SDK with sn-api backend</p>
      </header>

      <main className="App-main">
        <div className="test-address">
          <h3>Test Wallet Address:</h3>
          <code>{testAddress}</code>
          <p><em>(Vitalik Buterin's address for demo purposes)</em></p>
        </div>

        <div className="api-tabs">
          <button 
            className={`tab-button ${activeTab === "health" ? "active" : ""}`}
            onClick={() => setActiveTab("health")}
          >
            Health Check
          </button>
          <button 
            className={`tab-button ${activeTab === "balance" ? "active" : ""}`}
            onClick={() => setActiveTab("balance")}
          >
            Wallet Balance
          </button>
          <button 
            className={`tab-button ${activeTab === "tokens" ? "active" : ""}`}
            onClick={() => setActiveTab("tokens")}
          >
            Token Balances
          </button>
          <button 
            className={`tab-button ${activeTab === "nfts" ? "active" : ""}`}
            onClick={() => setActiveTab("nfts")}
          >
            NFT Balances
          </button>
          <button 
            className={`tab-button ${activeTab === "transactions" ? "active" : ""}`}
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </button>
        </div>

        <div className="action-section">
          {activeTab === "health" && (
            <button 
              className="api-button"
              onClick={handleHealthCheck}
              disabled={loading}
            >
              {loading ? "Checking..." : "Check API Health"}
            </button>
          )}

          {activeTab === "balance" && (
            <button 
              className="api-button"
              onClick={handleGetBalance}
              disabled={loading}
            >
              {loading ? "Fetching..." : "Get Wallet Balance"}
            </button>
          )}

          {activeTab === "tokens" && (
            <button 
              className="api-button"
              onClick={handleGetTokenBalances}
              disabled={loading}
            >
              {loading ? "Fetching..." : "Get Token Balances"}
            </button>
          )}

          {activeTab === "nfts" && (
            <button 
              className="api-button"
              onClick={handleGetNFTBalances}
              disabled={loading}
            >
              {loading ? "Fetching..." : "Get NFT Balances"}
            </button>
          )}

          {activeTab === "transactions" && (
            <button 
              className="api-button"
              onClick={handleGetTransactions}
              disabled={loading}
            >
              {loading ? "Fetching..." : "Get Recent Transactions"}
            </button>
          )}
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <h3>❌ Error</h3>
            <p>{error}</p>
          </div>
        )}

        {data && !loading && (
          <div className="response-section">
            {renderData()}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
