const superagent = require('superagent');
const base = 'https://botw-compendium.herokuapp.com/api/v2';

const getCategories = async (category) => {
    try {
        const res = await superagent.get(`${base}/category/${category}`);
        const entities = Object.values(res.body.data);
        return entities.filter((entity) => entity.category === category);
    } catch (error) {
        console.error(error);
    }
};

const getCreatures = async () => {
    try {
        const res = await superagent.get(`${base}/category/creatures`);
        const entities = Object.values(res.body.data);
        return entities.filter((entity) => entity.category === 'creatures');
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    getCategories,
    getCreatures,
};
