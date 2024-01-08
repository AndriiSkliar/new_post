import React, { useEffect, useState } from 'react';
import { read, utils } from 'xlsx';
import './ProcessingFile.css';

export const ProcessingFile = ({ selectedFile }) => {
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    const readFileData = async () => {
      const data = await readFile(selectedFile);
      setFileData(data);
    };
    readFileData();
  }, [selectedFile]);

  const readFile = (file) => {
    return new Promise((resolve) => {
      let reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = read(data, { type: 'array' });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const allSheets = utils.sheet_to_json(worksheet).slice(6);
        resolve(allSheets);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <>
      <div className="viewer">
        {fileData && fileData.length > 0 ? (
          <div className="table-responsive">

            <table className="table">
              <thead>
                <tr>
                  {Object.keys(fileData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {fileData.map((individualFileData, index) => (
                  <tr key={index}>
                    {Object.keys(individualFileData).map((key) => (
                      <td key={key}>{individualFileData[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        ) : (
          <div>No File is uploaded yet!</div>
        )}
      </div>
    </>
  );
};
