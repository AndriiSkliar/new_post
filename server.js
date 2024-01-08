const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.post('/upload', (req, res) => {
  if (!req.files) {
    return res.status(400).json({
      msg: 'No file uploaded',
    });
  }

  const file = req.files.file;

  if (!file)
    return res.json({
      error: 'Incorrect input name',
    });

  const newFileName = encodeURI(Date.now() + '-' + file.name);

  file.mv(`${__dirname}/public/uploads/${newFileName}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    console.log('file was uploaded');

    res.json({
      fileName: file.name,
      filePath: `/uploads/${newFileName}`,
    });
  });
});

app.listen(5000, () => console.log('Server Started...'));
