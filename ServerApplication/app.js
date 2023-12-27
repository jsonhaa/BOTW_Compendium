const api = require('../CustomModules/api');
const prompts = require('prompts');

const categories = async (entity) => {
    const displayCategories = entity.map((list) => {
        return { title: list.value, value: list.code };
    });

    return await prompts([
        {
            type: 'select',
            name: 'entity',
            message: 'Select a category',
            choices: displayCategories,
        },
    ]);
};

const searchEntities = async (args) => {
    try {
        let entries;
        if (args.category === 'creatures') {
            entries = await api.getCreatures();
        } else {
            entries = await api.getCategories(args.category);
        }

        const selectedEntity = await prompts({
            type: 'select',
            name: 'entity',
            message: 'Select an entity',
            choices: entries.map((entity) => ({
                title: entity.name,
                value: entity.id,
            })),
        });

        const selectedEntityData = entries.find(
            (entity) => entity.id === selectedEntity.entity
        );

        if (selectedEntityData) {
            console.log(`Selected entity: ${selectedEntityData.name}`);
            return selectedEntityData;
        } else {
            console.log('Selected entity data not found');
            return null;
        }

    } catch (error) {
        console.error(error);
        return null;
    }
};

const selections = async () => {
    const entities = [
        //{ value: 'Creatures', code: 'creatures' },    our creatures entity doesn't work
        { value: 'Equipment', code: 'equipment' },
        { value: 'Materials', code: 'materials' },
        { value: 'Monsters', code: 'monsters' },
        { value: 'Treasure', code: 'treasure' },
    ];
    const result = await categories(entities);
    const selectedEntity = entities.find((entity) => entity.code === result.entity);
  
    const selectedEntityData = await searchEntities({ category: result.entity });
    return selectedEntityData;
};

module.exports = {
    selections
};
