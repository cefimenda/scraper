var auditions = require('./node_auditions');
var puppeteer = require('puppeteer');
const db = require("./models")
const auditionsDB = db.audition
var recentlyScraped;

let scrape = async () => {
    auditions.gettingBackstage = true;
    var foundMostRecent = false;
    var tester;
    auditionsDB.findAll({
        limit: 1, where: {
            source: "Backstage",

        }, order: [["createdAt", "DESC"]]
    }).then(function (result) {
        recentlyScraped = result[0]
        console.log("LOGGING")
        console.log(recentlyScraped)
        console.log("^ THIS WAS SCRAPED RECENTLY ^")
    })

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true }); //opens browser - headless false --> displays action on screen

    console.log("scrape begins")
    var auditionList = [];
    const page = await browser.newPage(); //opens page  

    // Scrape
    for (var pageNum = 1; pageNum < 31; pageNum++) {
        console.log(tester)
        console.log(foundMostRecent)
        if (foundMostRecent) { break }
        page.setDefaultNavigationTimeout(60000)
        await page.goto('https://www.backstage.com/casting/?gender=B&max_age=100&min_age=0&page=' + pageNum + '&radius=50&sort_by=newest'); //goes to link
        await page.waitFor(1000); // waits for the page to load - not always necessary

        const result = await page.evaluate((recentlyScraped) => {
            var auditionList = [];
            var duplicate;
            //backstage has jquery so we can use jquery while evaluating the page.
            var auditionCard = $(".casting__listing")

            //get data from 12 audition items on page - sponsored/featured ones might get ignored
            for (let i = 1; i < auditionCard.length; i++) {
                //check if it is sponsored
                var elem = document.querySelector("#main__container > div > div > div:nth-child(3) > div > div:nth-child("+i+")")
                console.log(elem.className.includes("sponsored"))
                if (elem.className.includes("sponsored")) {

                    continue
                }

                //Get Title
                var titleElem = document.querySelector("#main__container > div > div > div:nth-child(3) > div > div:nth-child(" + i + ") > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > h3 > a");
                if (titleElem == undefined || titleElem == null) { continue }
                var title = titleElem.innerText;

                //Get Tags
                var tags = []
                for (var n = 1; n < 12; n++) {
                    var tagElem = document.querySelector("#main__container > div > div > div:nth-child(3) > div > div:nth-child(" + i + ") > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a:nth-child(" + n + ")");
                    if (tagElem == undefined || tagElem == null || tagElem.innerText == "PAID" || tagElem.innerText == "NONUNION" || tagElem.innerText == "UNION" || tagElem.innerText == "UNION AND NONUNION") { break }
                    tags.push(tagElem.innerText[0].toUpperCase() + tagElem.innerText.toLowerCase().slice(1));
                }
                tags = tags.join(", ")

                //Get Union
                var unionElem = document.querySelector("#main__container > div > div > div:nth-child(3) > div > div:nth-child(" + i + ") > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a.tag.union");
                if (unionElem == null || unionElem == undefined) {
                    var isUnion = "";
                } else {
                    var isUnion = unionElem.innerText;
                }
                function getDate(bsDateString) {
                    var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1;
                    var yyyy = today.getFullYear();
                    var thisDay = days[today.getDay()];
                    var thisTime = today.getHours();
                    if (dd < 10) { dd = '0' + dd }
                    if (mm < 10) { mm = '0' + mm }
                    if (bsDateString.split(" ").indexOf("hours") > -1) {
                        var bsTime = Number(bsDateString.split(": ")[1].split(" hours")[0]);
                        if (bsTime > thisTime) {
                            bsDateString = "yesterday"
                        }
                        else { bsDateString = "now" }
                    }
                    if (bsDateString.split(" ").indexOf("minutes") > -1 || bsDateString.split(" ").indexOf("seconds") > -1 || bsDateString.split(" ").indexOf("now") > -1 || bsDateString.split(" ").indexOf("moment") > -1) {
                        return mm + "/" + dd + "/" + yyyy
                    }
                    if (bsDateString.split(" ").indexOf("yesterday") > -1) {
                        var yesterday = new Date(today);
                        yesterday.setDate(today.getDate() - 1);
                        var ydd = yesterday.getDate();
                        var ymm = yesterday.getMonth() + 1;
                        var yyyyy = yesterday.getFullYear();
                        if (ydd < 10) { ydd = '0' + ydd }
                        if (ymm < 10) { ymm = '0' + ymm }
                        return ymm + "/" + ydd + "/" + yyyyy
                    }
                    for (var i in days) {
                        if (bsDateString.toLowerCase().split(" ").indexOf(days[i]) > -1) {
                            var dayDiff = days.indexOf(thisDay) - i;
                            if (dayDiff > 0) { dayDiff = dayDiff + 7 };

                            var target = new Date(today);
                            target.setDate(today.getDate() - dayDiff);
                            var tdd = target.getDate();
                            var tmm = target.getMonth() + 1;
                            var tyyyy = target.getFullYear();
                            if (tdd < 10) { tdd = '0' + tdd }
                            if (tmm < 10) { tmm = '0' + tmm }
                            return tmm + "/" + tdd + "/" + tyyyy
                        }
                    }
                }
                //Get Date
                var dateElem = document.querySelector("#main__container > div > div > div:nth-child(3) > div > div:nth-child(" + i + ") > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-3.col-md-3.col-sm-12 > div");
                var date = getDate(dateElem.innerText);
                if (date == undefined) { continue }

                //Get Link
                var link = "http://www.backstage.com" + titleElem.getAttribute("href")

                //Get Paid
                var paidElem = document.querySelector("#main__container > div > div > div:nth-child(3) > div > div:nth-child(" + i + ") > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a.tag.paid")
                if (paidElem == null || paidElem == undefined) {
                    var compensation = "Unpaid"
                } else {
                    var compensation = "Paid"
                }
                //Get Organization
                var organizationElem = document.querySelector("#main__container > div > div > div:nth-child(3) > div > div:nth-child(" + i + ") > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > ul > li.info")
                var organization = organizationElem.innerText;

                //Get State
                var state = "";
                var locationList = organization.split(";");
                for (var j in locationList) {
                    state += locationList[j].split(",")[1];
                    state += " ";
                }
                if (state === "undefined ") {
                    state = "nationwide "
                }
                if (recentlyScraped) {
                    if (recentlyScraped.link === link) {
                        duplicate = true
                        break
                    }
                }
                var audition = { title, organization, state, tags, isUnion, compensation, date, link, source: "Backstage" };
                auditionList.push(audition);
            }
            return [auditionList, duplicate];
        }, recentlyScraped);
        console.log("RESULTING")
        console.log(result)
        if (result[1]) {
            foundMostRecent = true
            tester = "FOUND IT"
        }
        for (var i in result[0]) {
            auditionList.push(result[0][i]);
        }
        auditions.backstageProgress = auditionList.length / (30 * 12) * 100
    }
    await page.close()

    // await Promise.all(funcList); //--> to run all scraping simultaneously

    browser.close();     //close browser
    console.log(auditionList)
    auditionsDB.bulkCreate(auditionList).then(function (success) {
        console.log(success)
        auditionsDB.findAll({ where: { source: "Backstage" }, limit: 500 }).then(function (auditionItems) {
            auditions.backstage = auditionItems
            auditions.backstageProgress = 100
        })
    })
};



module.exports = {
    scrape
}