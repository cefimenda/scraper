var auditions = require( './node_auditions' );
var puppeteer = require('puppeteer');


let scrape = async () => {
    auditions.gettingBackstage=true;
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true}); //opens browser - headless false --> displays action on screen
    const page = await browser.newPage(); //opens page
    console.log("scrape begins")
    var auditionList = [];

    // Scrape
    for(var pageNum=1;pageNum<11;pageNum++){
        auditions.backstageProgress = pageNum/11*100
        console.log("scraping pageNum "+pageNum)
        await page.goto('https://www.backstage.com/casting/?gender=B&max_age=100&min_age=0&page='+pageNum+'&radius=50&sort_by=newest'); //goes to link
        await page.waitFor(1000); // waits for the page to load - not always necessary
        var result = await page.evaluate(() => {
            var auditionList = [];

            //get data from 12 audition items on page - sponsored/featured ones might get ignored
            for (var i=0 ; i<20 ; i++){
                
                //Get Title
                var titleElem = document.querySelector("#main__container > div > div > div:nth-child(3) > div > div:nth-child("+i+") > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > h3 > a");
                if (titleElem == undefined || titleElem == null){continue}
                var title = titleElem.innerText;

                //Get Tags
                var tags = []
                for(var n=1; n<12;n++){
                    var tagElem = document.querySelector("#main__container > div > div > div:nth-child(3) > div > div:nth-child("+i+") > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a:nth-child("+n+")");
                    if (tagElem == undefined || tagElem == null || tagElem.innerText =="PAID" || tagElem.innerText =="NONUNION" || tagElem.innerText =="UNION"|| tagElem.innerText =="UNION AND NONUNION"){break}
                    tags.push(tagElem.innerText[0].toUpperCase()+tagElem.innerText.toLowerCase().slice(1));
                }
                
                //Get Union
                var unionElem = document.querySelector("#main__container > div > div > div:nth-child(3) > div > div:nth-child("+i+") > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a.tag.union");
                if (unionElem == null || unionElem == undefined){
                    var union = "";
                }else{
                    var union = unionElem.innerText;
                }
                function getDate(bsDateString){
                    var days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]
                    var today = new Date();  
                    var dd = today.getDate();
                    var mm = today.getMonth()+1;
                    var yyyy = today.getFullYear();
                    var thisDay = days[today.getDay()];
                    var thisTime = today.getHours();
                    if(dd<10) {dd = '0'+dd}          
                    if(mm<10) {mm = '0'+mm} 
                    if(bsDateString.split(" ").indexOf("hours")>-1){
                        var bsTime = Number(bsDateString.split(": ")[1].split(" hours")[0]);
                        if (bsTime>thisTime){
                            bsDateString = "yesterday"
                        }
                        else{bsDateString = "now"}
                    }
                    if (bsDateString.split(" ").indexOf("minutes")>-1 ||bsDateString.split(" ").indexOf("seconds")>-1  || bsDateString.split(" ").indexOf("now")>-1 || bsDateString.split(" ").indexOf("moment")>-1){
                        return mm+"/"+dd+"/"+yyyy
                    }
                    if (bsDateString.split(" ").indexOf("yesterday")>-1 ){
                        var yesterday = new Date(today);
                        yesterday.setDate(today.getDate()-1);
                        var ydd = yesterday.getDate();
                        var ymm = yesterday.getMonth()+1;
                        var yyyyy= yesterday.getFullYear();
                        if(ydd<10){ydd='0'+ydd} 
                        if(ymm<10){ymm='0'+ymm} 
                        return ymm+"/"+ydd+"/"+yyyyy
                    }
                    for (var i in days){
                        if(bsDateString.toLowerCase().split(" ").indexOf(days[i])>-1){
                            var dayDiff = days.indexOf(thisDay) - i;
                            if (dayDiff > 0){dayDiff = dayDiff + 7};
                
                            var target = new Date(today);
                            target.setDate(today.getDate()-dayDiff);
                            var tdd = target.getDate();
                            var tmm = target.getMonth()+1;
                            var tyyyy= target.getFullYear();
                            if(tdd<10){tdd='0'+tdd} 
                            if(tmm<10){tmm='0'+tmm} 
                            return tmm+"/"+tdd+"/"+tyyyy
                        }
                    }
                }  
                //Get Date
                var dateElem = document.querySelector("#main__container > div > div > div:nth-child(3) > div > div:nth-child("+i+") > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-3.col-md-3.col-sm-12 > div");
                var date = getDate(dateElem.innerText);
                if (date == undefined){continue}

                //Get Link
                var link = titleElem.getAttribute("href") 

                //Get Paid
                var paidElem = document.querySelector("#main__container > div > div > div:nth-child(3) > div > div:nth-child("+i+") > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > div.row > div.col-lg-9.col-md-9.col-sm-12 > div > a.tag.paid")
                if (paidElem == null || paidElem == undefined){
                    var paid = "Unpaid"
                }else{
                    var paid = "Paid"
                }
                //Get Organization
                var organizationElem = document.querySelector("#main__container > div > div > div:nth-child(3) > div > div:nth-child("+i+") > div.col-lg-9.col-md-9.col-sm-12.casting__listing--prod > ul > li.info")
                var organization = organizationElem.innerText;

                //Get State
                var state ="";
                var locationList = organization.split(";");
                for (var j in locationList){
                    state+=locationList[j].split(",")[1];
                    state+=" ";
                }
                if(state ==="undefined "){
                    state="nationwide "
                }

                var audition={title,organization,state,tags,union,paid,date,link,identifier:'audition'+i,source:"Backstage"};
                auditionList.push(audition);
            }
            return auditionList;
        });
        for (var i in result){
            auditionList.push(result[i]);
        }
    }
    browser.close();     //close browser
    auditions.backstage = auditionList
    auditions.backstageProgress = 100

};  

module.exports={
    scrape
}