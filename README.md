

# scrape-linkedin-with-nodejs
Scrape Linkedin profiles has never been so simple with nodejs :D !


 * Npm page: [scrape-linkedin](https://github.com/jbt/markdown-editor).

## Get started

1.Download the module
```
npm install scrape-linkedin
```
2.Use the module
```javascript
// Import the module in your file
var ScrapeLinkedin = require("scrape-linkedin");

// Create the scraper object
var scrapper = new ScrapeLinkedin();

// Fetch a profile
scrapper.fetch("charlyberthet")
// Handle the result
.then(profile => console.log(profile))
// Handle an error
.catch(err => console.log(err));
```


## Customization


You can customize the scraper by passing your configuration. 
```javascript
// Import the module in your file
var ScrapeLinkedin = require("scrape-linkedin");

// Create the scraper object
var scrapper = new ScrapeLinkedin({
	debug : true, // optional, boolean
    token : "<li_at cookie set by linkedin servers>", // optional, string
    loginCsrf : "<csrf form value send by linkedin login page>", // optional, string
    loginCookies : "<default cookies send by linkedin login page>", // optional, string
    loginEmail : "<linkedin mail>", // optional, string
    loginPassword : "<linkedin pwd>" // optional, string
});

```

## Thanks to

* [phantom](https://github.com/amir20/phantomjs-node)
* [request](https://github.com/request/request)


And you ! <3
