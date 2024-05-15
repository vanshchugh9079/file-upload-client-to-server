import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';

// Load environment variables
dotenv.config();
let { PORT } = process.env;

const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Ensure the 'uploads' directory exists
const uploadsDir = './uploads';

// Set up Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
    }
});

const upload = multer({ storage: storage });

// Define a POST route for file uploads
app.post('/file', upload.single('file'), (req, res) => {
    const filePath = path.resolve(uploadsDir, req.file.filename)
    res.sendFile(filePath,(err)=>{
        if(err){
            console.log(err);
            res.status(500).send(err);
        }
    })
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
