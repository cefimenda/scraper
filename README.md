# Scavenger

Scavenger is a scraper built on Puppeteer that collects audition listings from the two most popular websites in the artist community - www.backstage.com, www.playbill.com

I have started building this project when I first started learning javascript and over time implemented the new tools that I learned into it. 

Currently it uses 
-A mysql database (with sequelize) to hold audition data, 
-A mongo database (with mongoose) to hold comments specific to auditions provided by users,
-Puppeteer to run a headless chromium instance that navigates pages and collects data,
-An express server.

Weaknesses and known issues:
-Audition filtering is done on the client side, making filtering slow and taxing for the client side device.
    --> Planning on restructuring api end points to get the filtering and heavy lifting done through db queries.
-UI responsivity issue on XL screen sizes, causing the loading and audition cards to overlap with the fixed filterbar.
    --> Looking into adding pagination so that the filters bar will no longer need to be fixed on the screen since height of auditions will not be larger than the height of the filterbar.