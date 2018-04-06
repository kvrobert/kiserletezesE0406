function CPICapturer( ) {

    var nodeUrel = "http://10.41.96.136";
    var webDriver = require('selenium-webdriver');
    var by = require('selenium-webdriver').By;
    var until = require('selenium-webdriver').until;
    var map = require('selenium-webdriver').promise.map;
    require('chromedriver');
    var fs = require('fs');

    var self = this;
    var driver;

    // to the HTMÉ capturing
    var queueQM = [];
    var CPIObjects = [];
    var ready = true;
    var closing = false;
    var isAuthenticated = false;
    var HTMLelements;
    var isReady = true;

    //this.driver = windowDriver;

    // open chrome
   // var driver = new webDriver.Builder().forBrowser('chrome').build();
    this.manageWindow = function( renderDriver, callback ){
    console.log("driver átjött...");
    this.driver = renderDriver;
    this.driver.manage().window().maximize();
    callback();
    }

    // use user:pass to enter 
    this.auth = function (nodeUrel, callback) {
        console.log('Authentication in progress...url: ' + nodeUrel);
        this.driver.get(nodeUrel).then(() => {
            //    driver.findElement( by.name('username') ).sendKeys('admin_user');
            //    driver.findElement( by.name('password') ).sendKeys('ericsson');
            this.driver.wait(until.elementLocated(by.name('username')), 1000);
           // console.log(driver.findElement(by.className('loginScreenOverlay')));
           this.driver.findElement(by.className('loginForm ng-untouched ng-pristine ng-valid')).submit();
           this.driver.wait(until.stalenessOf(this.driver.findElement(by.className('loginScreenOverlay')))).then(() => callback());

            // driver.wait( !until.elementLocated(by.className('loginScreenOverlay')), 2000).then( () => callback() );            
        });
    }

    // Capture the TITLE
    this.takeTitle = function ( callback ) {
        var titleCPI;
        this.driver.findElements(by.xpath("//*[contains(@class, 'title open-menu')]"))
            .then( (titlePromis) => {
                // map the Title element form promise                           // lehet, hogy az objektum push a mapp utáni thenbe kell..ígylehet promise megy át
                console.log("A title egy..:" + titlePromis );                   // map( promises, (elem) => elem  ).then( és akkor itt már elileg rendes HTML objektum lesz )
                map( titlePromis, ( title ) => {
                    CPIObjects.push(title);
                    title.getAttribute('innerHTML' ).then( (inner)=> { 
                        console.log("The tile..inner: " + inner );
                        titleCPI = inner;
                     });      
                }).then( () => callback( titleCPI ) );
            } );
    }

    // Click to show the CPI helps
    this.clickToShowHelp = function (callback) {
        this.driver.findElement(by.className('btn contextHelp')).click()
            .then(() =>  setTimeout( () => {
                callback();
            }, 2000) );
    }   

    //Collect the questionmarks to click to show the CPI help
    this.collectTheQuestionMarks = function (callback) {
       var cpiTexts = [];

       this.driver.findElements(by.xpath("//*[contains(@class, 'cpiHelp')]//*[contains(@class, 'icon-help')]|//*[@class='icon icon-help cpiHelp']"))
       .then((elements) => {
        //   console.log(elements);
           queueQM = elements;  // The questionMarks promises
           //callback( queueQM )
       })
       .then( () => {
            queueQM.forEach( (qestionMark) => { qestionMark.click()
                .then( () => {
                    this.driver.findElements(by.xpath("//*[contains(@class, 'tooltip overlayToolTip visible higher')]"))
                    .then( (cpiPromises)=> {
                        //console.log( "From CPI element: " + cpiPromises );
                        map( cpiPromises, elem => 
                        //    CPIObjects.push(elem);                                                // Egyenlőre nem kell az object
                        //    console.log( "Az objektum: " + CPIObjects.length );                        // lehet, hogy az objektum push a mapp utáni thenbe kell..ígylehet promise megy át
                            elem.getAttribute('innerHTML' )
                                     // map( promises, (elem) => elem  ).then( és akkor itt már elileg rendes HTML objektum lesz )                                 
                        
                        ).then( (inner) => {
                            cpiTexts.push( inner );
                            console.log( "Azu INNNER TÍPUSA: " +typeof(inner) );
                        } );            // a mappelés után kapom meg az objektet a PROMISE-ból        
                    });
                });                
             })        
       } ).then( () => {
        console.log("=======================================================================")
        console.log("Ez megy vissz a CPI Arrayban...: " + cpiTexts);   
        console.log("=======================================================================")
        callback( cpiTexts );
       } );       
    }



    // TODO...: DELETE IT
    function hasSomeParentTheClass(element, classname) {
        if (element.className.split(' ').indexOf(classname) >= 0) return true;
        return element.parentNode && hasSomeParentTheClass(element.parentNode, classname);
    }


    // Test for capturing HTML  CPI
    this.takeHTML = function takeHTML(url) {

        this.driver.get(url).then(() => {
            console.log('From take HTML...');
            var cpiElements = this.driver.findElements(by.className('message cpi blue'));
            console.log("Az elemek legyűjtve.");
        });
    }

}
