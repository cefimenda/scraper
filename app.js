
var express = require("express");
var app = express();

let scrape = async () => {
    const browser = await puppeteer.launch({headless: false}); //opens browser - headless false --> displays action on screen
    const page = await browser.newPage(); //opens page

    await page.goto('http://www.playbill.com/job/listing'); //goes to link
    await page.waitFor(1000); // waits for the page to load - not always necessary
    // Scrape
    for (i = 0 ; i<15 ; i++){
        await page.waitFor(100); // waits for the page to load - not always necessary
        await page.click('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > button'); //click on anything with selector
    }
    const result = await page.evaluate(() => { //takes page and makes it accessible thru DOM
        let auditionList = {};
        //let elements = document.querySelectorAll('.product_pod');
       
        var i = 0
        while (document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr.row-'+i+' > td.col-0 > a > span')!=null || document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr:nth-child('+i+') > td.col-0 > a > span') != null){
       
        //for (i = 0 ; i<500 ; i++){
        //while ( document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr.row-'+i+' > td.col-0 > a > span')!=null ){
            
            if (i<50){
                var titleElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr.row-'+i+' > td.col-0 > a > span');
                var categoryElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr.row-'+i+' > td.col-1 > span');
                var organizationElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr.row-'+i+' > td.col-2 > span');
                var stateElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr.row-'+i+' > td.col-3 > span');
                var paidElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr.row-'+i+' > td.col-4  > span');
                var dateElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr.row-'+i+' > td.col-5  > span');
                var linkElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr.row-'+i+' > td.col-0 > a')
            }
            else {
                var titleElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr:nth-child('+i+') > td.col-0 > a > span');
                var categoryElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr:nth-child('+i+')> td.col-1 > span');
                var organizationElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr:nth-child('+i+')> td.col-2 > span');
                var stateElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr:nth-child('+i+') > td.col-3 > span');
                var paidElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr:nth-child('+i+') > td.col-4  > span');
                var dateElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr:nth-child('+i+') > td.col-5');
                var linkElem = document.querySelector('body > div.bsp-site-wrapper.listing.listing-event.bsp-onDomInsert-inserted-53.pb-trackevents-item > div.bsp-site.bsp-onDomInsert-inserted-58.pb-banner-item > div > div:nth-child(4) > div > div > div > div > div.bsp-component-content > div > div > div > div > div > table > tbody > tr:nth-child('+i+') > td.col-0 > a')
            }

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
            }else{
                var organization = organizationElem.innerText;
            }
            if (stateElem == null){
                var state = "";
            }else{
                var state = stateElem.innerText;
            }
            if (paidElem == null){
                var paid = "";
            }else{
                var paid = paidElem.innerText;
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

            var audition = {title,category,organization,state,paid,date,link,identifier:'audition'+i}
            auditionList['audition'+i] = audition
            i++
            if (i>=500){break}
        }
        return auditionList;
    });

    browser.close();     //close browser
    return result;
};

app.use(express.static('home'))


app.get("/scrape",(req,res)=> {

    scrape().then((value) => {
        res.send(JSON.stringify(value));
        res.end();
    })
});

app.listen("/", () => console.log('Example app listening on port 3000!'))
