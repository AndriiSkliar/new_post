import React, { useEffect, useState } from 'react';
import {read, utils} from 'xlsx';

export const ProcessingFiless = ({ selectedFile }) => {
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    const readFileData = async () => {
      const data = await readFile(selectedFile);
      setFileData(data);
    };

    readFileData();
  }, [selectedFile]);

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const excelData = utils.sheet_to_json(sheet, { header: 0 });
        // console.log('test: ', test);

        const fileInfo = {
          name: file.name,
          lastModifiedDate: file.lastModifiedDate.toLocaleDateString(),
          excelData: excelData,
        };

        resolve(fileInfo);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  };


  if (!fileData) {
    return <div>Loading...</div>;
  }

  const updatedFileData = () => {
    const data = fileData.excelData;

    if (data.length === 0) {
      alert("File is empty!")
      return
    }

    // console.dir(fileData);
  }
  updatedFileData()

   return (
    <>
      {fileData.excelData.length > 0 && (
        <div>
          <h2>File Information</h2>
          <ul>
            <li>Name: {fileData.name}</li>
            <li>Last Modified Date: {fileData.lastModifiedDate}</li>
          </ul>

          <h2>Excel Data</h2>
          <pre>{JSON.stringify(fileData.excelData, null, 2)}</pre>
        </div>
      )}
    </>
  );
};
