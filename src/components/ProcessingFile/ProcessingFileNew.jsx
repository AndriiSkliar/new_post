import React, { useEffect, useState } from 'react';
import {read} from 'xlsx';

export const ProcessingFileNew = ({ selectedFile }) => {
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
        const workBook = read(data, { type: 'array' });
        const sheetName = workBook.SheetNames[0];
        const sheets = workBook.Sheets[sheetName];

        const allSheets = Object.keys(sheets).map((sheet) => {
          return {
							sheet,
							rows: sheets[sheet].v
						};
					});

        const fileInfo = {
          name: file.name,
          lastModifiedDate: file.lastModifiedDate.toLocaleDateString(),
          excelData: allSheets,
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
