import React, {useState} from 'react';
import './App.css';

function FileUpload({className, handleFileUpload, label}){
  return (
    <div className={className}>
      <label>
        {label}
        <input
          type="file"
          id="file-input"
          onChange={(e) => handleFileUpload(e)}
          accept=".csv"
        />
      </label>
    </div>
  );
}

function App() {
  const limit = 5;
  let [processedData, setProcessedData] = useState(null);
  let [offset, setOffset] = useState(0);


  function handleFileUpload(e){
    let [file] = e.target.files;
    getText(file,fileReadHandler, errorHandler);
  }
  
  function getText(file, fileReadHandler, errorHandler){
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = fileReadHandler;
    reader.onerror = errorHandler;
  
  }
  
  function fileReadHandler(event){
    let csvData = event.target.result;
    let processedData = processCSVData(csvData);
    
    setProcessedData(processedData);
  }
  
  function errorHandler(){
    alert('Error in reading file')
  }
  
  function processCSVData(data){
    
    let rows = data.split(/\n|\r/);
    
  
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/gm;
  
    let fields = rows[0].split(regex);
    
  
    let formattedData = rows.slice(1).reduce((finalData, row) => {
      
      let dataPoint = row.split(regex).reduce((dp, value, index) => {
        let fieldValue = fields[index];
        if(fieldValue){
          dp[fieldValue.trim()] = value;
        }
        return dp;
      }, {})
      return [...finalData, dataPoint]
    }, []);


  
    return formattedData
  }

  return (
    <div className={!processedData ? 'wrapper' : 'table-wrapper' }>
      {!processedData ? <FileUpload className={"file-upload1"} handleFileUpload={handleFileUpload} label={'Upload Csv File'} /> : null}
      {processedData && processedData[0] ? (
        <>
          <FileUpload className={"file-upload2"} handleFileUpload={handleFileUpload} label={'Upload Another File'} />
          <div className="button-container">
            <button
              onClick={() => setOffset(offset - limit)}
              disabled={offset === 0}
            >
              Prev
            </button>
            <button
              onClick={() => setOffset(offset + limit)}
              disabled={offset >=  Object.keys(processedData[0]).length}
            >
              Next
            </button>
          </div>
          <table>
            <thead>
              <tr>
                {Object.keys(processedData[0])
                  .slice(offset, limit + offset)
                  .map((key) => (
                    <th>{key}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {processedData.map((dataPoint) => (
                <tr>
                  {Object.keys(dataPoint)
                    .slice(offset, limit + offset)
                    .map((key) => {
                      return <td>{dataPoint[key]}</td>;
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
    </div>
  );
}

export default App;
