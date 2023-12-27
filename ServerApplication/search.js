const api = require('../CustomModules/api');
const express = require('express');
const { insertData } = require('./db');

const { selections } = require('./app');
const { MongoClient } = require('mongodb');

const search = require('./server');
const history = require('./history');

const app = express();
const port = 8888;
const uri ='mongodb+srv://jasonha323:botwCompendium@cluster0.ba57xzk.mongodb.net/?retryWrites=true&w=majority';

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

connectToDatabase();

app.get('/history', async (req, res) => {
    try {
        const database = client.db('BOTW_Database');
        const searches = database.collection('BOTW_Collection');
        const result = await searches.find().toArray();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

async function getSelectedEntityData() {
    const selectedEntityData = await selections();
    if (selectedEntityData === null) {
        return null;
    }
    return {
        name: selectedEntityData.name,
        id: selectedEntityData.id,
        description: selectedEntityData.description,
        locations: selectedEntityData.locations ? selectedEntityData.locations : 'Unknown',
        drops: selectedEntityData.drops ? selectedEntityData.drops : 'Unknown',
        image: selectedEntityData.image
    };
}

app.get('/getEntity', async (req, res) => {
    try {
        const selectedEntityData = await getSelectedEntityData;
        if (selectedEntityData === null) {
            res.status(404).send('Selected entity data not found');
            return;
        };
        await insertData(selectedEntityData);
        res.redirect(`/search/${selectedEntityData.id}/details`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
  
app.get('/search/:id/details', async (req, res) => {
    try {
        const id = req.params.id;
        const selectedEntityData = await getSelectedEntityData();
        if (selectedEntityData === null) {
            res.status(404).send('Selected entity data not found');
            return;
        }
        const html = 
        `<head>
          <style>
            h1 {text-transform: capitalize;}
          </style>
        </head>
        <html>
          <body>
            <h1>${selectedEntityData.name} (ID: ${selectedEntityData.id})</h1>
            <p>Description: ${selectedEntityData.description}</p>
            <p>Common Locations: ${selectedEntityData.locations ? selectedEntityData.locations : 'Unknown'}</p>
            <p>Drops: ${selectedEntityData.drops ? selectedEntityData.drops : 'Unknown'}</p>
            <a href="${selectedEntityData.image}">Link to Image</a>
          </body>
        </html>`;
        await insertData(selectedEntityData);
        res.send(html);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});