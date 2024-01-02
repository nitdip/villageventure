// store resources
const guildStockpile = {};
const resourcesConfig = {
    wood: {delay: 3000, minAmount: 3, maxAmount: 5}, 
    stone: {delay: 3000, minAmount: 3, maxAmount: 5},
    rabbit: {delay: 0, minAmount: 1, maxAmount: 1}
};

// function to initialize a server's stockpile
function initStockpile(guildId) {
    if (!guildStockpile[guildId]) {
        guildStockpile[guildId] = {
            wood: 0,
            stone: 0,
            food: 0
        };
    }
}

// function to get the guild's stockpile
function getStockpile(guildId) {
    if (!guildStockpile[guildId]) initStockpile(guildId);

    // return the stockpile for the user
    return guildStockpile[guildId];
}

// function to store resources
function storeResources(guildId, resourceType, amount) {
    // check to see if a server has a stockpile initialized
    if (!guildStockpile[guildId]) initStockpile(guildId);

    // 
    if (typeof(guildStockpile[guildId][resourceType]) === 'number') {
        guildStockpile[guildId][resourceType] += amount;
        return true;
    } 
    // if resource type is invalid return false
    return false;
}

// gather resoures
function gatherResources(userId, guildId, resourceType) {
    return new Promise((resolve, reject) => {
        // check if the supplied resource is valid
        const resourceConfig = resourcesConfig[resourceType];
        if (!resourceConfig) {
            reject(new Error('Invalid resource type'));
            return;
        }

        // set delay timer for gathering resources
        setTimeout(() => {
            const amountToGather = getRandomInt(resourceConfig.minAmount, resourceConfig.maxAmount);
            const success = storeResources(guildId, resourceType, amountToGather);
            if (success) {
                resolve({
                    success: true,
                    amount: amountToGather,
                    resourceType: resourceType
                });
            } else {
                reject(new Error('Failed to add resouces to stockpile'));
            }
        }, resourceConfig.delay);
    });
}

// helper to check if a resource is valid
function isValidResource(resourceType) {
    const validResourceType = ['wood', 'stone', 'food'];
    return validResourceType.includes(resourceType)
}

// get random integers
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// export the function
module.exports = { gatherResources, getStockpile }