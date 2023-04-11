import { PineconeClient } from "@pinecone-database/pinecone";

export default async function handler(req, res) {
    const pinecone = new PineconeClient();

    try {
        await pinecone.init({
            environment: process.env.PINECONE_ENVIRONMENT,
            apiKey: process.env.PINECONE_API_KEY,
        });

        //const indices = await pinecone.listIndexes();
        let indexName = "financial-news";

        const index = pinecone.Index({ indexName });
        const description = await pinecone.describeIndex({
            indexName: indexName,
        });

        console.log("Description: \n" + JSON.stringify(description));

        let payload = {
            message: "Success",
            indexData: description,
        }

        res.status(200).json(payload);
    } catch (error) {
        console.log(error);

        res.status(200).json(error);
    }
}
