const routes = require('express').Router();
const axios = require('axios');
const getAuthorData = require('../../utils/scrapper');
const { permute } = require('../../utils/util-functions');

// Get author information from wikipedia page
routes.get('/author', async (req, res) => {
    if (!req.query.name) return res.status(400).json({ error: "Please write a name" });
    const possibleNames = permute(req.query.name.split(' '));
    console.log(possibleNames);

    try {
        // Check if page/author exists, try all possible name combinations until found
        for (let i = 0; i < possibleNames.length; i++) {
            console.log("Trying this name: " + possibleNames[i].join('_'));
            const response = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${possibleNames[i].join(' ')}`);

            console.log(response.data.query.pages)
            if (Object.keys(response.data.query.pages)[0] === "-1") {
                continue;
            } else if (Object.keys(response.data.query.pages)[0] !== "-1") {
                break;
            } else {
                return res.status(404).json({ error: "Could not find author" });
            }
        }

        // Scrape the information about the author from the author's Wikipedia page
        const authorPageData = await getAuthorData(req.query.name);
        // return res.json({authorPageData});
        return res.json({done: "done"});

    } catch (error) {
        // console.log(error)
        console.log("WHEN DOES THIS FIRE?");
        return res.status(404).json({error})
    }
})

module.exports = routes