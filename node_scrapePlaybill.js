var puppeteer = require('puppeteer');
var auditions = require('./node_auditions');
const db = require("./models")
const auditionsDB = db.audition
var recentlyScraped;

let scrape = async () => {
    //Find the item on the database that was most recently added
    auditionsDB.findAll({
        limit: 1, where: {
            source: "Playbill",
        }, order: [["createdAt", "DESC"]]
    }).then(function (result) {
        recentlyScraped = result[0]
    });

    auditions.gettingPlaybill = true;
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true }); //opens browser - headless false --> displays action on screen

    const page = await browser.newPage(); //opens page
    page.setDefaultNavigationTimeout(60000)


    await page.goto('http://www.playbill.com/job/listing'); //goes to link
    await page.waitFor(1000); // waits for the page to load - not always necessary
    // Scrape
    for (i = 0; i < 13; i++) {
        auditions.playbillProgress = (i / 13) * 100
        await page.waitFor(200); // waits for the page to load - not always necessary
        await page.click('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-54.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-59.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > button'); //click on anything with selector
    }

    const result = await page.evaluate((recentlyScraped) => { //takes page and makes it accessible thru DOM
        let auditionList = [];
        var i = 1
        var titleElem = ""
        while (titleElem != null || titleElem != undefined) {
            titleElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-54.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-59.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div:nth-child(' + i + ') > a > div > div.pb-tile-title');
            var categoryElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-54.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-59.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div:nth-child(' + i + ') > a > div > div.pb-tile-category');
            var organizationElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-54.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-59.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div:nth-child(' + i + ') > a > div > div.pb-tile-location');
            // var stateElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr.row-'+i+' > td.col-3 > span');
            var paidElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-54.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-59.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div:nth-child(' + i + ') > a > div > div.pb-tile-tags > div');
            var dateElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-54.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-59.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div:nth-child(' + i + ') > a > div > div.pb-tile-post-date');
            var linkElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-54.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-59.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div:nth-child(' + i + ') > a')

            if (titleElem == null) {
                var title = "";
            } else {
                var title = titleElem.innerText;
            }
            if (categoryElem == null) {
                var category = "";
            } else {
                var category = categoryElem.innerText;
            }
            if (organizationElem == null) {
                var organization = "";
                var state = ""
            } else {
                var organization = organizationElem.innerText;
                var orgSplit = organization.split(", ")
                var state = orgSplit[orgSplit.length - 1]
            }
            // if (stateElem == null){
            //     var state = "";
            // }else{
            //     var state = stateElem.innerText;
            // }
            if (paidElem == null) {
                var compensation = "Unpaid";
            } else if (paidElem.innerText.toLowerCase() == "paid") {
                var compensation = "Paid"
            } else {
                var compensation = "Unpaid"
            }
            if (dateElem == null) {
                var date = "";
            } else {
                var date = dateElem.innerText;
            }
            if (linkElem == null) {
                var link = "";
            } else {
                var link = "http://www.playbill.com" + linkElem.getAttribute("href")
            }
            if (recentlyScraped) {
                if (recentlyScraped.link === link) {
                    console.log("ITEM NUMBER " + i + " IS A DUPLICATE")
                    break
                }
            }
            var audition = { title, category, organization, state, compensation, date, link, source: "Playbill" }
            auditionList.push(audition)
            i++
            if (i >= 501) { break }
        }
        return auditionList;
    }, recentlyScraped);

    browser.close();     //close browser
    sendAuditionsToDB(result)
};

function sendAuditionsToDB(auditions) {
    auditionsDB.bulkCreate(auditions).then(function (success) {
        updateAuditionsObj()


    })
}
function updateAuditionsObj() {
    auditionsDB.findAll({ where: { source: "Playbill" }, limit: 500, order: [["createdAt", "DESC"]] }).then(function (auditionItems) {
        auditions.playbill = auditionItems
        auditions.playbillProgress = 100;
    })
}
module.exports = {
    scrape
}