import React, { useEffect, useState } from 'react';
import { read, utils } from 'xlsx';

function sheet2arr(sheet) {
  console.log('sheet: ', sheet);
  const result = [];
  let row;
  let rowNum;
  let colNum;
  for (rowNum = sheet['!range'].s.r; rowNum <= sheet['!range'].e.r; rowNum++) {
    row = [];
    for (colNum = sheet['!range'].s.c; colNum <= sheet['!range'].e.c; colNum++) {
      const nextCell = sheet[utils.encode_cell({ r: rowNum, c: colNum })];
      if (typeof nextCell === 'undefined') {
        row.push(void 0);
      } else {
        row.push(nextCell.w);
      }
    }
    result.push(row);
  }
  return result;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export const Master = ({ selectedFile }) => {
  const [sheets, setSheets] = useState(null);
  const [currentSheet, setCurrentSheet] = useState(null);

  useEffect(() => {
    const readFileData = async () => {
      try {
        const data = await readFile(selectedFile);
        setSheets(data);
      } catch (error) {
        console.error(error);
      }
    };

    readFileData();
  }, [selectedFile]);

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workBook = read(data, { type: 'array' });
          const sheetName = workBook.SheetNames[0];
          const sheets = workBook.Sheets[sheetName];
          const allSheets = Object.keys(sheets).map((sheet) => {
            const sheetData = {
              sheet,
              rows: sheet2arr(sheets[sheet]),
            };
            return sheetData;
          });

          if (allSheets.length === 0 || allSheets[0].rows.length === 0) {
            throw new Error("Empty table in Excel file");
          }

          setSheets(allSheets);
          setCurrentSheet(allSheets[0]);

          const fileInfo = {
            name: file.name,
            lastModifiedDate: file.lastModifiedDate.toLocaleDateString(),
            excelData: allSheets,
          };
          resolve(fileInfo);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  if (!sheets) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {currentSheet.excelData.length > 0 && (
        <div>
          <h2>File Information</h2>
          <ul>
            <li>Name: {currentSheet.name}</li>
            <li>Last Modified Date: {currentSheet.lastModifiedDate}</li>
          </ul>

          <h2>Excel Data</h2>
          <pre>{JSON.stringify(currentSheet.excelData, null, 2)}</pre>
        </div>
      )}
    </>
  );
};
