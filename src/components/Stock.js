import React from 'react';

const Stock = ({ stock, handleClick,selected,sector}) => {
    let action = 'add'
    if(selected){
        action = 'remove'
    }
  return (
    <div style={{ backgroundColor: 'black', color: 'white', margin:'10px',borderRadius:'5px'}}>
      <div >
        <div style={{ padding: "10px" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize:'20px', margin:'10px' }}>{stock.name}</span>
          <br />
          <span style={{ color: 'green', margin:'10px', fontSize:'20px' }}>{stock.price}</span>
          <br />
          </div>
          <span style={{ color: 'white', margin:'0px 0px 5px 10px', fontSize:'12px' }}>{sector}</span>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <button 
            onClick={() => handleClick(stock)}  
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '5px 20px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              alignContent:'center'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            {action}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stock;
