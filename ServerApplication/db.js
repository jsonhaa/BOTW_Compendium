const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://jasonha323:botwCompendium@cluster0.ba57xzk.mongodb.net/?retryWrites=true&w=majority';

async function insertData(data) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        await client.connect();

        const database = client.db('BOTW_Database');
        const collection = database.collection('BOTW_Collection');

        const result = await collection.insertOne(data);
        console.log(`Inserted ${data.name} into the collection.`);
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

module.exports = {
    insertData,
};