import { PineconeClient } from "@pinecone-database/pinecone";

export default async function handler(req, res) {
    let queryData = req.body.query;

    // The following is grabbed from https://winkjs.org/wink-nlp/getting-started.html

    // Load wink-nlp package.
    const winkNLP = require("wink-nlp");

    // Load english language model — light version.
    const model = require("wink-eng-lite-web-model");

    // Load BM25 Vectorizer
    const BM25Vectorizer = require("wink-nlp/utilities/bm25-vectorizer");

    // Instantiate winkNLP.
    const nlp = winkNLP(model);

    // Obtain "its" helper to extract item properties.
    const its = nlp.its;

    // Obtain "as" reducer helper to reduce a collection.
    const as = nlp.as;

    // Instantiate a vectorizer with the default configuration — no input config
    // parameter indicates use default.
    const bm25 = BM25Vectorizer();

    // Returns the vector of "queryData"
    console.log("Learning: " + queryData);
    bm25.learn(nlp.readDoc(queryData).tokens().out(its.normal));
    let vectorizedQueryData = bm25.vectorOf(
        nlp.readDoc(queryData).tokens().out(its.normal)
    );

    for (let index = 0; index < 99; index++) {
        vectorizedQueryData.push(vectorizedQueryData[0])
    }

    console.log("Vector: ", vectorizedQueryData.length);

    // Pinecone clients
    const pinecone = new PineconeClient();

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
        
        const queryResponse = await index.query({
            query: {
              vector: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
              topK: 3,
              includeValues: true,
            },
        });

        console.log("Query Results \n" + JSON.stringify(queryResponse));

        let payload = {};

        res.status(200).json(payload);
    } catch (error) {
        console.log(error);

        res.status(200).json(error);
    }
}
