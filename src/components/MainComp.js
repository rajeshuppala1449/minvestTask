import finnhubClient from "../utils/configureApi"; // Importing the finnhubClient for API requests
import { useEffect, useState } from 'react'; // Importing hooks from React
import Stock from "./Stock"; // Importing the Stock component

const MainComp = () => {
  const [prices, setPrices] = useState({}); // State to store the prices of the stocks
  const [selected, setSelected] = useState([]); // State to store the selected stocks
  const [diversityIndex, setDI] = useState(0); // State to store the diversity index

  // Array of Dow 30 stock symbols
  const dow30Symbols = [
    'AAPL', 'MSFT', 'JPM', 'V', 'JNJ', 'WMT', 'PG', 'UNH', 'HD', 'INTC',
    'VZ', 'DIS', 'MRK', 'CSCO', 'KO', 'BA', 'PFE', 'NKE', 'XOM', 'MCD',
    'IBM', 'AXP', 'GS', 'MMM', 'TRV', 'CAT', 'CVX', 'DOW', 'WBA', 'RTX'
  ];

  // Mapping of Dow 30 stocks to their respective sectors
  const dow30Sectors = {
    'AAPL': 'Information Technology',
    'MSFT': 'Information Technology',
    'JPM': 'Financials',
    'V': 'Information Technology',
    'JNJ': 'Health Care',
    'WMT': 'Consumer Staples',
    'PG': 'Consumer Staples',
    'UNH': 'Health Care',
    'HD': 'Consumer Discretionary',
    'INTC': 'Information Technology',
    'VZ': 'Communication Services',
    'DIS': 'Communication Services',
    'MRK': 'Health Care',
    'CSCO': 'Information Technology',
    'KO': 'Consumer Staples',
    'BA': 'Industrials',
    'PFE': 'Health Care',
    'NKE': 'Consumer Discretionary',
    'XOM': 'Energy',
    'MCD': 'Consumer Discretionary',
    'IBM': 'Information Technology',
    'AXP': 'Financials',
    'GS': 'Financials',
    'MMM': 'Industrials',
    'TRV': 'Financials',
    'CAT': 'Industrials',
    'CVX': 'Energy',
    'DOW': 'Materials',
    'WBA': 'Consumer Staples',
    'RTX': 'Industrials'
  };

  // Function to calculate the diversity index
  const caluclateIndex = () => {
    let allocation = {}; // Allocation of prices by sector
    let total = 0; // Total sum of prices
    for (const stock of selected) {
      const sector = dow30Sectors[stock];
      if (!allocation.hasOwnProperty(sector)) {
        allocation[sector] = 0;
      }
      allocation[sector] = allocation[sector] + prices[stock];
      total = total + prices[stock];
    }
    let sumOfWeights = 0;
    for (const sector of Object.keys(allocation)) {
      const alloc = allocation[sector];
      const w = alloc / total;
      sumOfWeights = sumOfWeights + w * w;
    }
    const DI = (1 - sumOfWeights) * 100;
    setDI(DI.toFixed(2));
  };

  // Effect to calculate the diversity index whenever selected stocks change
  useEffect(() => {
    caluclateIndex();
  }, [selected]);

  // Effect to load selected stocks from localStorage
  useEffect(() => {
    const storedSel = window.localStorage.getItem('selected');
    if (storedSel !== null && storedSel !== '') {
      setSelected(JSON.parse(storedSel));
    }
  }, [prices]);

  // Effect to fetch Dow 30 stock prices from API
  useEffect(() => {
    const fetchDow30Data = async () => {
      let results = {};
      for (const symbol of dow30Symbols) {
        finnhubClient.quote(symbol, (error, data, response) => {
          let currPrice = null;
          if (data) {
            currPrice = data.c;
          }
          results[symbol] = currPrice;
          if (Object.keys(results).length == 30) {
            setPrices(results);
          }
        });
      }
    };
    fetchDow30Data();
  }, []);

  // Function to add or remove a stock from the selected list
  const addremoveItem = (stock) => {
    const name = stock.name;
    let selStocks = selected;
    if (selected.includes(name)) {
      selStocks = selStocks.filter((item, index) => item !== name);
    } else {
      if (!selStocks.includes(name)) {
        selStocks = [...selStocks, name];
      }
    }
    window.localStorage.setItem('selected', JSON.stringify(selStocks));
    setSelected(selStocks);
  };

  return (
    <div className="container-fluid" style={{ marginTop: '50px' }}>
      <div className="row" style={{ margin: '10px 0px 0px 0px' }}>
        <div className="col-8" style={{ padding: '0px' }}>
          <div style={{ border: '2px solid black', height: '100%', backgroundColor: '#212020', margin: '10px', borderRadius: '20px', padding: '0px 15px 0px 15px' }}>
            <div style={{ margin: '10px 0px 0px 10px' }}>
              <span style={{ color: 'white', fontSize: '20px' }}><b>SELECTED STOCKS</b></span>
            </div>
            <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap' }}>
              {selected.map(item => <Stock key={item} sector={dow30Sectors[item]} handleClick={addremoveItem} selected={true} stock={{ 'name': item, 'price': prices[item] }} />)}
            </div>
          </div>
        </div>
        <div className="col-4" style={{ padding: '0px' }}>
          <div style={{ border: '2px solid black', padding: '10px', height: '100%', borderRadius: '20px', backgroundColor: '#212020', margin: '10px' }}>
            <div style={{ margin: '10px 0px 0px 10px' }}>
              <span style={{ color: 'white', fontSize: '20px' }}><b>DIVERSITY INDEX</b></span>
            </div>
            <br />
            <span style={{ color: 'white', margin: '10px', fontSize: '40px' }}>{diversityIndex}</span>
          </div>
        </div>
      </div>
      <div className="row" style={{ border: '2px solid black', borderRadius: '20px', padding: '0px 15px 10px 15px', height: '100%', margin: '20px 10px 10px 10px', backgroundColor: '#212020' }}>
        <div style={{ margin: '10px 0px 0px 10px' }}>
          <span style={{ color: 'white', fontSize: '20px' }}><b>DOW30 STOCKS</b></span>
        </div>
        <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {Object.keys(prices).map(item => <Stock key={item} handleClick={addremoveItem} sector={dow30Sectors[item]} selected={selected.includes(item)} stock={{ 'name': item, 'price': prices[item] }} />)}
        </div>
      </div>
    </div>
  );
}

export default MainComp;
