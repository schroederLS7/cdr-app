import express from 'express'
import cors from 'cors'
import path, { parse } from "path";
import multer from 'multer';
import fs from 'fs';
import { Status, CDRFileUploadResponse } from './interfaces/interfaces';
import { parseCDR } from './parser';
import { pgp, putCDR, getAll, runQuery } from './data';

const app = express();

const PORT = 3000;

app.use(cors());

//Setup file upload temp storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Files will be saved in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Limit file size to 10MB
});

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '../../client/dist'))); // Adjust path as needed

app.post('/api/upload', upload.single('uploadedFile'), (request, response) => {
    if (!request.file) {
        return response.status(400).send('No file uploaded.');
    }

    let apiResponse: CDRFileUploadResponse = { status: Status.Success, message: 'Data uploaded successfully.' };

    // Access the uploaded file information
    const filePath = request.file.path;
    const originalName = request.file.originalname;
    // Now read the file content using Node.js's fs module
    fs.readFile(filePath, 'utf8', async (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return apiResponse = { status: Status.Error, message: 'Error reading file.' };
        }
        const lines = data.split(/\r?\n/);
        console.log(`File ${originalName} uploaded with ${lines.length} lines of data.  Processing...`);

        const parseResults = lines.map((line) => {
            return parseCDR(line);
        });

        // Check each result for failure before moving on
        parseResults.forEach(element => {
            if (element.status == Status.Error) {
                apiResponse = element;
                response.send(apiResponse);
            }
        });

        if (apiResponse.status == Status.Success) {
            const putPromises = parseResults.map(async (result) => {
                if (result.CDR) { return await putCDR(result.CDR); }
            });

            Promise.all(putPromises).then((results) => {
                results.forEach(element => {
                    if (element && element.status == Status.Error) {
                        apiResponse = element;
                    }
                });

                if (apiResponse.status == Status.Success) {
                    apiResponse.message = `Data uploaded successfully.  ${results.length} records created.`;
                }
                response.send(apiResponse);
            }).catch(err => response.send({ status: Status.Error, message: `Error saving data - ${err}` }));
        }
    });


});

app.get('/api/getAll', async (request, response) => {
    const result = await getAll();
    response.send(result);
});

app.get('/api/runQuery', async (request, response) => {
    const queryString = request.query.query as string;
    if (queryString.length > 0) {
        const result = await runQuery(queryString);
        response.send(result);
    }
    else {
        response.send({ status: Status.Error, message: `Error running query - query param can not be empty` });
    }
});

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
});

// Close postgres pool connection
process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Initiating graceful shutdown...');
    // Perform cleanup operations here
    pgp.end();
});