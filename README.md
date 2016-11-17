

# scrape-linkedin-with-nodejs
Scrape Linkedin profiles has never been so simple with nodejs :D !


 * Npm page: [scrape-linkedin](https://www.npmjs.com/package/scrape-linkedin).

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

## Result
```javascript
{
    curentCompany: ['Sopra Steria'],
    educations: [{
        date: '2014 – 2017',
        degree: 'Engineer’s Degree, ',
        major: 'IT and Networking',
        title: 'Engineering school CPE, Lyon, France'
    }],
    experiences: [{
        company: 'Sopra Steria',
        description: 'Project management (scrum). Conception, Development and Qualification of Android, Spring/AngularJS and Ionic applications. Use of Design patterns.',
        location: 'Région de Lyon, France',
        since: 'septembre 2014',
        title: 'IT Engineering, half studying at CPE Lyon, half working at Sopra Steria',
        until: ''
    }, {
        company: 'Culinarian',
        description: 'Joined an amazing american start up. Worked in a team of designers, data analysts and developers. I was charged to develop the web application using ReactJS, Redux and NodeJS.',
        location: 'Région de Greater Los Angeles, États-Unis',
        since: 'juillet 2016',
        title: 'IT Internship in USA, conception and development from scratch, ReactJS WebApp',
        until: 'septembre 2016'
    }, {
        company: 'Entrepreneur',
        description: 'Running a company and prospecting clients. It was not so easy !',
        location: 'France',
        since: 'janvier 2015',
        title: 'IT Entrepreneur in Web and Mobile Application development',
        until: 'décembre 2015'
    }],
    fullName: 'Charly Berthet',
    industry: 'Logiciels informatiques',
    languages: [{
        language: 'Anglais',
        level: 'Capacité professionnelle complète'
    }, {
        language: 'Francais',
        level: 'Bilingue ou langue natale'
    }, {
        language: 'Espagnol',
        level: 'Compétence professionnelle limitée'
    }],
    locality: 'Région de Lyon, France',
    previousCompanies: ['Culinarian', 'Entrepreneur, ', 'NTN-SNR'],
    profilePicture: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAWiAAAAJGVmZWZhMjUzLTY5NDItNGNlNS04MjMxLTE3ODYzYWRhY2ViZA.jpg',
    skills: [{
        name: 'Mobile app',
        recommendations: '10'
    }, {
        name: 'SDK Android',
        recommendations: '8'
    }, {
        name: 'Node.js',
        recommendations: '2'
    }, {
        name: 'Java',
        recommendations: '25'
    }, {
        name: 'JavaScript',
        recommendations: '13'
    }],
    title: 'IT Engineering student doing a dual learning course',
    volonteers: [{
        association: '4L Trophy',
        description: 'I love helping people, in 2014 I participated in the 4L Trophy, a humanitarian cross-country drive in Africa to help poor children.',
        location: 'Aide humanitaire et secours en cas de catastrophes',
        major: '',
        since: 'février 2014',
        title: 'Copilot / Treasurer',
        until: ''
    }, {
        association: 'Red Bull',
        description: 'Athletes support during the Red Bull Element of 2013 and 2012.',
        location: '',
        major: '',
        since: 'septembre 2013',
        title: 'Athletes support',
        until: ''
    }]
}
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
