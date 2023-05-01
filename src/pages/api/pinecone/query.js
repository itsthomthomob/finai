import { PineconeClient } from "@pinecone-database/pinecone";
const { spawn } = require('node:child_process');


export default async function handler(req, res) {

    let queryData = req.body.query;
    let vectorizedData;

    // TODO: Change so it's adjusted locally
    let pathToProcess = 'src/pages/api/pinecone/process.py'

    // Spawn a python process using Node child process
    const pythonProcess = spawn('python', [pathToProcess, queryData]);

    // Calls the VectorizeQuery method in process.py
    pythonProcess.stdout.on('data', (data) => {
        const vectorizedQuery = data.toString().trim();
        console.log(vectorizedQuery);
    });

    // Catch any errors if they exist
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    // Close the python process
    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

    // Pinecone client
    const pinecone = new PineconeClient();

    // Get body request
    // TODO
    
    try {
        
        // Initialize pinecone client
        await pinecone.init({
            environment: process.env.PINECONE_ENVIRONMENT,
            apiKey: process.env.PINECONE_API_KEY,
        });
        
        // Set index we query from
        let indexName = "financial-news";
        
        // Pinecone index
        const index = pinecone.Index({ indexName });

        let payload = {}

        res.status(200).json(payload);

    } catch (error) {
        console.log(error);

        res.status(200).json(error);
    }
}
