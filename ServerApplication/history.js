const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://jasonha323:botwCompendium@cluster0.ba57xzk.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log('Connected to database');
    } catch (error) {
        console.error(error);
    }
};

const addToHistory = async (command, resultCount) => {
    try {
        const db = client.db();
        const history = db.collection('history');
        const result = await history.insertOne({
            command: command,
            resultCount: resultCount,
            timestamp: new Date(),
        });
        console.log(`Added to history: ${JSON.stringify(result.ops[0])}`);
    } catch (error) {
        console.error(error);
    }
};

const getHistory = async () => {
    try {
        const db = client.db();
        const history = db.collection('history');
        const result = await history
            .find({})
            .sort({ timestamp: -1 })
            .limit(10)
            .toArray();
        console.log(`History: ${JSON.stringify(result)}`);
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    connectToDatabase,
    addToHistory,
    getHistory,
};