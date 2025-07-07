const express = require('express');
const path = require('path');
const multer = require('multer');
const { handlePrompt, getTasks, getTaskById, generateQuickReply, deleteTask   } = require('../controllers/taskController');

const router = express.Router();

// Configuração do multer para upload da logo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'logos'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Rotas
router.post('/', upload.single('logo'), handlePrompt);
router.post('/generate-reply', generateQuickReply);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.delete('/:id', deleteTask);

module.exports = router;
