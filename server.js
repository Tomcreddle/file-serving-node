const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;


const storage = multer.diskStorage({
    destination: './uploads/', 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif|pdf|txt/; 
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type!'));
        }
    }
}).single('file'); 


app.use(express.static('public'));


app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).send({ message: err.message });
        } else {
            if (!req.file) {
                res.status(400).send({ message: 'No file uploaded' });
            } else {
                res.send({ message: 'File uploaded successfully!', file: req.file.filename });
            }
        }
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
