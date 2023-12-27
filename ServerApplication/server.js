const superagent = require('superagent');

async function getById(id) {
    try {
        const response = await superagent.get(`https://botw-compendium.herokuapp.com/api/v2/entry/${id}`);
        const data = response.body.data;
        const details = {
            name: data.name,
            category: data.category,
            display: data.description,
            image: data.image
        };
        return details;
    } catch (error) {
        console.error(error);
        return null;
    }
}