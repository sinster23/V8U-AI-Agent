const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const XLSX = require('xlsx');
const Tesseract = require('tesseract.js');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

const parseFileToText = async (buffer, ext) => {
  switch (ext) {
    case '.pdf':
      const pdfData = await pdfParse(buffer);
      return pdfData.text;

    case '.docx':
      const docxResult = await mammoth.extractRawText({ buffer });
      return docxResult.value;

    case '.xlsx':
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      let text = '';
      workbook.SheetNames.forEach(sheet => {
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { header: 1 });
        rows.forEach(row => text += row.join(' ') + '\n');
      });
      return text;

    case '.txt':
      return buffer.toString('utf-8');

    case '.png':
    case '.jpg':
    case '.jpeg':
      const ocr = await Tesseract.recognize(buffer, 'eng');
      return ocr.data.text;

    default:
      throw new Error('Unsupported file type');
  }
};

router.post('/upload-file', upload.single('file'), async (req, res) => {
  try {
    const ext = path.extname(req.file.originalname).toLowerCase();
    const buffer = fs.readFileSync(req.file.path);
    const text = await parseFileToText(buffer, ext);

    fs.unlinkSync(req.file.path); // Clean up

    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to extract file text' });
  }
});

module.exports = router;
