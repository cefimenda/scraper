var puppeteer = require('puppeteer');

let scrape = async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true}); //opens browser - headless false --> displays action on screen
    const page = await browser.newPage(); //opens page

    await page.goto('http://www.playbill.com/job/listing'); //goes to link
    await page.waitFor(1000); // waits for the page to load - not always necessary
    // Scrape
    for (i = 0 ; i<15 ; i++){
        await page.waitFor(100); // waits for the page to load - not always necessary
        await page.click('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-54.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-59.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > button'); //click on anything with selector
    }
    const result = await page.evaluate(() => { //takes page and makes it accessible thru DOM
        let auditionList = {};
        //let elements = document.querySelectorAll('.product_pod');
        
        var i = 1
        var titleElem = ""
        while (titleElem != null || titleElem != undefined){
        
        //for (i = 0 ; i<500 ; i++){
        //while ( document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr.row-'+i+' > td.col-0 > a > span')!=null ){
            
            titleElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-54.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-59.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div:nth-child('+i+') > a > div > div.pb-tile-title');
            var categoryElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-54.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-59.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div:nth-child('+i+') > a > div > div.pb-tile-category');
            var organizationElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-54.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-59.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div:nth-child('+i+') > a > div > div.pb-tile-location');
            // var stateElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr.row-'+i+' > td.col-3 > span');
            var paidElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-54.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-59.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div:nth-child('+i+') > a > div > div.pb-tile-tags > div');
            var dateElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-54.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-59.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div:nth-child('+i+') > a > div > div.pb-tile-post-date');
            var linkElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-54.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-59.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div:nth-child('+i+') > a')
            
            
            if (titleElem == null){
                var title = "";  
            }else{
                var title = titleElem.innerText;
            }
            if (categoryElem == null){
                var category = "";
            }else{
                var category = categoryElem.innerText;
            }
            if (organizationElem == null){
                var organization = "";
                var state = ""
            }else{
                var organization = organizationElem.innerText;
                var orgSplit = organization.split(", ")
                var state = orgSplit[orgSplit.length-1]
            }
            // if (stateElem == null){
            //     var state = "";
            // }else{
            //     var state = stateElem.innerText;
            // }
            if (paidElem == null){
                var paid = "";
            }else{
                var paid = paidElem.innerText;
            }
            if (paid ==""){
                paid = "Unpaid"
            }
            if (dateElem == null){
                var date = "";
            }else{
                var date = dateElem.innerText;
            }
            if (linkElem == null){
                var link = "";
            }else{
                var link = linkElem.getAttribute("href")
            }
            var audition = {title,category,organization,state,paid,date,link,identifier:'audition'+i,source:"playbill"}
            auditionList['audition'+i] = audition
            i++
            if (i>=501){break}
        }
        return auditionList;
    });

    browser.close();     //close browser
    return result;
};

module.exports = {
    scrape
}
