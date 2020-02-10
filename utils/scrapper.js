const cheerio = require('cheerio');
const axios = require('axios');
const _ = require('lodash');

const getAuthorData = async (authorName) => {
    const wikiPage = `https://en.wikipedia.org/wiki/${authorName}`;

    const result = await axios.get(wikiPage);
    const $ = cheerio.load(result.data);

    const vcardInfo = [];
    $('.infobox.vcard tbody tr').map(function() {
        // Select the image
        if ($(this).has('img').length > 0 && !($(this).has('th').length > 0)) {
            vcardInfo.push({
                imageSrc: $(this).find('img').attr('src')
            })
        }

        // Select everything else except the name and the signature
        if ($(this).has('td').length > 0 && $(this).has('th').length > 0) {

            const key = $(this).find('th').text();
            const valuesArray = []
            $(this).find('td').children().map(function() {
                valuesArray.push($(this).text());
            });

            const value = valuesArray.filter(Boolean).join(', ');

            // TODO: Check if this is okay
            // Parse the date
            if (key === "Born" || key === "Died" ) {
                const regExp = /(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\s+\d{1,2}\s+\d{4}/;

                const dateValue = $(this).find('td').contents().filter(function() { 
                    return this.nodeType == 3; 
                }).text().replace(",", "").trim();

                vcardInfo.push({
                    [key]: _.isNull(dateValue.match(regExp)) ? dateValue : dateValue.match(regExp)[0]
                })

            } else if (key === "Signature") {
                vcardInfo.push({
                    [key]: $(this).find('img').attr('src')
                })
            } else {
                vcardInfo.push({
                    [key]: value
                })
            } 
        }
    })
    console.log(vcardInfo)
}

module.exports = getAuthorData