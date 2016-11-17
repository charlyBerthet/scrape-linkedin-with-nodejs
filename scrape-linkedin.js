var phantom = require('phantom');
var request = require('request');

//
// DEFAULT Config
//
const EMAIL = 'justforyou@kingkong.fr'; // login email > CAN BE CHANGED
const PASSWORD = 'iamsecured';          // login pwd > CAN BE CHANGED
const DEBUG = false;                    // set true to debug



//
// OBJECT
//
var ScrapeLinkedin = function(config){
    config = config || {};
    this.debug          = config.debug || DEBUG;
    // Token used to fetch user profiles
    this.linkedinToken = {
        'name'     : 'li_at',
        'value'    : config.liAt || config.token || '',
        'domain'   : '.www.linkedin.com',
        'path'     : '/',
        'httponly' : true,
        'secure'   : true,
        'expires'  : new Date("2217-11-11T18:24:17.000Z").getTime()
    };
    // Used to login to linkedin
    this.loginCsrf = config.loginCsrf || null;
    this.loginCookies = config.loginCookies || null;
    this.loginEmail     = config.loginEmail || EMAIL;
    this.loginPassword  = config.loginPassword || PASSWORD;
};




//
//	FETCH LINKEDIN PROFILE
//
ScrapeLinkedin.prototype.fetchLinkedinProfile = function(username){
    const self = this;
    return new Promise((resolve, reject) => {
        phantom.create().then(function(ph){
            ph.createPage().then( function(page){


                page.setting('javascriptEnabled', true);
                page.setting('cookiesEnabled', true);
                page.addCookie(self.linkedinToken);


                if(self.debug)
                    console.log("Fetch linkedin: " + username);
                return page.open("https://www.linkedin.com/in/" + username)
                    .then(function(status){

                        return page.evaluate(function(){
                            //
                            //  Query helpers
                            //
                            function getText(selector){
                                return get(selector) ? get(selector).textContent : "";
                            };

                            function get(selector){
                                return document.querySelector(selector) ? document.querySelector(selector) : false;
                            };
                            function getTextArray(mainSelector, textSelector){
                                var tmp = document.querySelectorAll(mainSelector);
                                var array = [];
                                if(tmp.length > 0){
                                    for(var k = 0 ; k < tmp.length ; k++){
                                        if(tmp[k].querySelector(textSelector))
                                            array.push(tmp[k].querySelector(textSelector).textContent);
                                        else
                                            array.push(tmp[k].textContent);
                                    }
                                }
                                return array;
                            };
                            function getJson(mainSelector, json){
                                var tmp = document.querySelectorAll(mainSelector);
                                var array = [];
                                if(tmp.length > 0){
                                    for(var k = 0 ; k < tmp.length ; k++){
                                        var jsonResult = {};
                                        for(var j in json){
                                            jsonResult[j] = tmp[k].querySelector(json[j]) ? tmp[k].querySelector(json[j]).textContent : "";

                                        }
                                        array.push(jsonResult);
                                    }
                                }
                                return array;
                            };
                            function getPicture(selector){
                                return document.querySelector(selector) ? document.querySelector(selector).getAttribute("src") : "";
                            };

                            //
                            //  Parsing -> can often change /!\
                            //
                            var user = {};
                            user.fullName 			= getText(".full-name");
                            user.title 				= getText(".title");
                            user.locality 			= getText(".locality");
                            user.industry 			= getText(".industry");
                            user.profilePicture		= getPicture(".profile-picture img");
                            user.curentCompany 		= getTextArray("#overview-summary-current li", "span");
                            user.previousCompanies 	= getTextArray("#overview-summary-past li", "span");
                            user.languages 			= getJson("#languages-view .section-item", {
                                "language":"h4",
                                "level":"div"
                            });
                            user.experiences 		= getJson("#background-experience > div", {
                                "title":"header h4",
                                "company":"header h5:not(.experience-logo)",
                                "since":".experience-date-locale time:nth-child(1)",
                                "until":".experience-date-locale time:nth-child(2)",
                                "location":".experience-date-locale .locality",
                                "description":".description"
                            });
                            user.skills 			= getJson("#profile-skills .skill-pill", {
                                "recommendations":".endorse-count",
                                "name":".endorse-item-name"
                            });
                            user.educations 		= getJson("#background-education .education", {
                                "title":"header h4",
                                "degree":"header h5 .degree",
                                "major":"header h5 .major",
                                "date":".education-date"
                            });
                            user.volonteers 		= getJson("#background-volunteering .experience", {
                                "title":"h4",
                                "association":"h5:not(.volunteering-logo)",
                                "major":"header h5 .major",
                                "since":".volunteering-date-cause time:nth-child(1)",
                                "until":".volunteering-date-cause time:nth-child(2)",
                                "location":".volunteering-date-cause .locality",
                                "description":".description"
                            });

                            return user;

                        })
                        .then(function(result){
                            resolve(result);
                            return ph.exit();
                        })
                        .catch(err => reject(err));
                    });
            });
        });
    });
};



//
//	LOG INTO LINKEDIN -> get token
//
ScrapeLinkedin.prototype.getToken = function(){
    const self = this;
    var form = {
        'loginCsrfParam':self.loginCsrf,
        'session_key':self.loginEmail,
        'session_password':self.loginPassword
    };
    var tokenOptions = {
        method: 'POST',
        url: 'https://www.linkedin.com/uas/login-submit',
        headers:
        {
            'cache-control': 'no-cache',
            'cookie': self.loginCookies,
            'accept-language': 'fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4',
            'accept-encoding': 'gzip, deflate',
            'referer': 'https://www.linkedin.com/',
            'accept': '*/*',
            'content-type': 'application/x-www-form-urlencoded',
            'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest',
            'origin': 'https://www.linkedin.com',
            'x-isajaxform': '1'
        },
        'form': form
    };

    return new Promise(function(resolve, reject){
        request(tokenOptions, function (error, response, body) {
            if (error) throw new Error(error);

            const cookies = response.headers["set-cookie"];
            var liAt = "";
            for(var i = 0; i<cookies.length; i++){
                if(/^li_at/.test(cookies[i])){
                    liAt = cookies[i];
                    break;
                }
            }
            if(liAt == ""){
                return reject("no token found");
            }

            liAt = liAt.split("=")[1].split(";")[0];
            return resolve(liAt);
        });
    });
};




//
//  If token is not set, update token
//
ScrapeLinkedin.prototype.updateTokenIfNeeded = function(){
    const self = this;
    return new Promise(function(resolve, reject){
        if(self.linkedinToken.value == ""){
            if(self.debug)
                console.log("fetch linkedin token");
            self.getToken()
                .then(function(res){
                    if(self.debug)
                        console.log("linkedin token received:", res);
                    self.linkedinToken.value = res;
                    resolve(res);
                })
                .catch(function(err){
                    reject(err);
                });
        }
    });
};








//
//  Get CSRF and Cookies if needed
//
var cookiesOptions = {
    method: 'GET',
    url: 'https://www.linkedin.com/uas/login-submit',
    headers:
    {
        'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding':'gzip, deflate, br',
        'Accept-Language':'fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4',
        'Cache-Control':'max-age=0',
        'Connection':'keep-alive',
        'Host':'www.linkedin.com',
        'Upgrade-Insecure-Requests':1,
        'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36'
    }
};

ScrapeLinkedin.prototype.fetchCsrfAndCookies = function(){
    return new Promise(function(resolve, reject){
        request(cookiesOptions, function (error, response, body) {
            if (error) throw new Error(error);

            const cookies = response.headers["set-cookie"];
            var strCookies = "";
            var csrf = null
            cookies.map(v =>{
                if(/bcookie=/.test(v))
                    csrf = v.split('"')[1].split("&")[1];
                strCookies += v.split(";")[0] +"; ";
            });
            resolve({
                cookies : strCookies,
                csrf : csrf
            });
        });
    });
};



//
//  Update cookie if needed
//
ScrapeLinkedin.prototype.updateCsrfAndCookiesIfNeeded = function(){
    const self = this;
    return new Promise((resolve, reject)=>{
        if(self.loginCsrf == null || self.loginCookies == null){
            if(self.debug)
                console.log("fetch default cookies and csrf");
            self.fetchCsrfAndCookies().then(json =>{
                self.loginCsrf = json.csrf;
                self.loginCookies = json.cookies;
                if(self.debug)
                    console.log("default cookies and csrf are:", json);
                resolve();
            }).catch(err => {
                reject(err);
            });
        }else{
            return resolve();
        }
    });
};




//
//  Login to linkedin if needed, get the token if needed and THEN fetch profile
//
ScrapeLinkedin.prototype.bindIfNeededThenfetch = function(username){
    const self = this;
   return new Promise((resolve, reject) => {
       self.updateCsrfAndCookiesIfNeeded().then()
       .then(()=>{
           self.updateTokenIfNeeded()
           .then(()=>{
               self.fetchLinkedinProfile(username).then(profile => resolve(profile)).catch(err => reject(err));
           })
           .catch(function(err){
               reject(err);
           });
       })
       .catch(err => {
           reject(err);
       });
   });

};
ScrapeLinkedin.prototype.now    = ScrapeLinkedin.prototype.bindIfNeededThenfetch;
ScrapeLinkedin.prototype.love   = ScrapeLinkedin.prototype.bindIfNeededThenfetch;
ScrapeLinkedin.prototype.get    = ScrapeLinkedin.prototype.bindIfNeededThenfetch;
ScrapeLinkedin.prototype.fetch  = ScrapeLinkedin.prototype.bindIfNeededThenfetch;
ScrapeLinkedin.prototype.scrape = ScrapeLinkedin.prototype.bindIfNeededThenfetch;
ScrapeLinkedin.prototype.kingkong = ScrapeLinkedin.prototype.bindIfNeededThenfetch;
ScrapeLinkedin.prototype.zidane   = ScrapeLinkedin.prototype.bindIfNeededThenfetch;




//
// Example of use
//
/*
    var scrapper = new ScrapeLinkedin();
    scrapper.fetch("charlyberthet").then(profile => console.log(profile)).catch(err => console.log(err));
*/


// EXPORT
module.exports = ScrapeLinkedin;







