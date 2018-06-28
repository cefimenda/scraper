var puppeteer = require('puppeteer');

let scrape = async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true}); //opens browser - headless false --> displays action on screen
    const page = await browser.newPage(); //opens page


    // Scrape
    var auditionList = {};
    for(var pageNum=1;pageNum<11;pageNum++){

        await page.goto('https://www.backstage.com/casting/?gender=B&max_age=100&min_age=0&page='+pageNum+'&radius=50&sort_by=newest'); //goes to link
        await page.waitFor(1000); // waits for the page to load - not always necessary
        var result = await page.evaluate(() => {
            let auditionList = {};
            //get data from 12 audition items on page - sponsored/featured ones might get ignored
            for (var i=0 ; i<12 ; i++){
                
                //Get Title
                var titleElem = document.querySelector("#main__container > div > div > div:nth-child(3) > div > div:nth-child("+i+") > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > h3 > a");
                if (titleElem == undefined || titleElem == null){continue}
                var title = titleElem.innerText;

                //Get Tags
                var tags = {}
                for(var n=1; n<12;n++){
                    var tagElem = document.querySelector("#main__container > div > div > div:nth-child(3) > div > div:nth-child("+i+") > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a:nth-child("+n+")");
                    if (tagElem == undefined || tagElem == null){break}
                    tags["tag"+n]= tagElem.innerText;
                }
                
                //Get Union
                var unionElem = document.querySelector("#main__container > div > div > div:nth-child(3) > div > div:nth-child("+i+") > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a.tag.union");
                if (unionElem == null || unionElem == undefined){
                    var union = "";
                }else{
                    var union = unionElem.innerText;
                }

                //Get Date
                var dateElem = document.querySelector("#main__container > div > div > div:nth-child(3) > div > div:nth-child("+i+") > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-3.col-md-3.col-sm-12 > div");
                var date = dateElem.innerText;

                //Get Link
                var link = titleElem.getAttribute("href") 

                //Get Paid
                var paidElem = document.querySelector("#main__container > div > div > div:nth-child(3) > div > div:nth-child("+i+") > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a.tag.paid")
                if (paidElem == null || paidElem == undefined){
                    var paid = "unpaid"
                }else{
                    var paid = "paid"
                }

                var audition={title,tags,union,paid,date,link,identifier:'audition'+i,source:"backstage"}
                auditionList[audition.identifier] = audition
            }
            return auditionList;
        });

        //In order to get the correct identifier with respect to the full auditionList
        //find item with largest identifier number in existing auditionList
        var numberList=[]
        if (Object.keys(auditionList).length<1){
            largestIndex = 0
        }
        else{
            for(auditionNumber in auditionList){
                var auditionIndex = Number(auditionList[auditionNumber].identifier.split("audition")[1]);
                numberList.push(auditionIndex);
            }
            numberList.sort((a,b) => b-a);
            largestIndex = numberList[0];
        }
        //add largest number in previous auditionList to each number in the new auditionList
        for(auditionNumber in result){
            audition = result[auditionNumber]
            var auditionIndex = Number(audition.identifier.split("audition")[1]);
            auditionIndex = Number(auditionIndex) + Number(largestIndex);
            audition.identifier = "audition"+String(auditionIndex);
            //add auditions with correct global identifier into the auditionList
            auditionList[audition.identifier] = audition          
        }

    }
    browser.close();     //close browser
    return auditionList;
};

module.exports = {
    scrape
}



/*
sponsored audition title:
#main__container > div > div > div:nth-child(3) > div > div.row.casting__listing.sponsored > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > h3 > a

featured audition title:
#main__container > div > div > div:nth-child(3) > div > div.row.casting__listing.featured > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > h3 > a

Regular audition title:
#main__container > div > div > div:nth-child(3) > div > div:nth-child(2) > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > h3 > a
#main__container > div > div > div:nth-child(3) > div > div:nth-child(5) > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > h3 > a
#main__container > div > div > div:nth-child(3) > div > div:nth-child(6) > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > h3 > a
#main__container > div > div > div:nth-child(3) > div > div:nth-child(13) > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > h3 > a

Tags:

sponsored item:
#main__container > div > div > div:nth-child(3) > div > div.row.casting__listing.sponsored > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a:nth-child(1)
#main__container > div > div > div:nth-child(3) > div > div.row.casting__listing.sponsored > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a:nth-child(2)
#main__container > div > div > div:nth-child(3) > div > div.row.casting__listing.sponsored > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a:nth-child(3)

regular item:
#main__container > div > div > div:nth-child(3) > div > div:nth-child(2) > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a:nth-child(1)
#main__container > div > div > div:nth-child(3) > div > div:nth-child(2) > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a.tag.union

featured item:
#main__container > div > div > div:nth-child(3) > div > div.row.casting__listing.featured > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a:nth-child(1)
#main__container > div > div > div:nth-child(3) > div > div.row.casting__listing.featured > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a:nth-child(2)
#main__container > div > div > div:nth-child(3) > div > div.row.casting__listing.featured > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a:nth-child(3)
#main__container > div > div > div:nth-child(3) > div > div.row.casting__listing.featured > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a.tag.union

regular item:
#main__container > div > div > div:nth-child(3) > div > div:nth-child(5) > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a:nth-child(1)
#main__container > div > div > div:nth-child(3) > div > div:nth-child(5) > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a:nth-child(2)
#main__container > div > div > div:nth-child(3) > div > div:nth-child(5) > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a.tag.union

*/
