const rp = require('request-promise');
const cheerio = require('cheerio');

const pokemonList = [];
var firstUrl = 'https://www.backstage.com/casting/?gender=B&max_age=100&min_age=0&page=1&radius=50&sort_by=newest';
var counter = 0;

function scraper(url) {

    return new Promise(function (resolve, reject) {

        rp(url, function (err, resp, html) {
            const $ = cheerio.load(html);
            auditionList = [];
            if (err) {
                reject(err);
            }
            else {
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
                    auditionList.push(audition)
                }
                var nextUrl = 'https://www.backstage.com/casting/?gender=B&max_age=100&min_age='+String(Number(counter)+Number(1))+'&page=1&radius=50&sort_by=newest';

                resolve(auditionList);
                counter++;
                if (counter < 12) { scraper(nextUrl) }
                else {
                    console.log("bitti sanki")
                    console.log(auditionList)
                }
            }
        });
    });
}
scraper(firstUrl);