import React, { useRef, useState } from 'react';
import './UploadFile.css';
import { ProcessingFile } from 'components/ProcessingFile/ProcessingFile';

const hostUrl = '/upload';
// onUploadProgress и onDownloadProgress в axios
export const UploadFile = () => {
  const filePicker = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploaded, setUploaded] = useState();

  const handleChange = (evt) => {
    const currentFile = evt.target.files[0];

    if (!currentFile) return;

    const checkEndOfName = currentFile.name.endsWith(".xlsx") || currentFile.name.endsWith(".xls");

    if (!checkEndOfName) {
      alert("Please select xlsx or xls file!")
      return
    }

    setSelectedFile(currentFile)
  };

  const handlePick = () => {
    filePicker.current.click();
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file!")
      return
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    const res = await fetch(hostUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    setUploaded(data);
  }

  return (
    <>
      <button onClick={handlePick}>Pick file</button>

      <input
        className='hidden'
        type="file"
        ref={filePicker}
        onChange={handleChange}
        accept=".xlsx, .xls"
      />

      <button onClick={handleUpload}>Upload now</button>

      {selectedFile && (
        <ProcessingFile selectedFile={selectedFile} />
      )}

      {uploaded && (
        <div>
          <h2>{uploaded.fileName}</h2>
          <h3>{uploaded.filePath}</h3>
        </div>
      )}
    </>
  );
};

