var nodeUrel = "http://10.41.96.136";
var webDriver = require('selenium-webdriver');
var by = require('selenium-webdriver').By;
var until = require('selenium-webdriver').until;
var map = require('selenium-webdriver').promise.map;
require('chromedriver');
var fs = require('fs');

var self = this;
var driver = new webDriver.Builder().forBrowser('chrome').build();


var cpiQMElements = []; // innerHTML
var cpiBody = [];
var cpiObject = []; // CPI webObjects
var pictures = [];
var bodyHTML = "";
var cpiHTML = "";
isAuthenticated = false;

var url = "http://10.41.96.136/status/NE_Overview";

var webCapturer = new WebCapturer();
var cpicapturer = new CPICapturer();

webCapturer.initialDriver( driver, () => console.log("PhotoCapture has been initialised") );
cpicapturer.manageWindow( driver, () => render() );

//webCapturer.auth("http://10.41.96.135");
//isAuthenticated = cpicapturer.auth("http://10.41.96.135");

 function render (){
    cpicapturer.auth( url, (some) => {        
        cpicapturer.takeTitle( (titleState) => {             
            console.log("The state of takeTitle: " + titleState);
            cpiBody.push(titleState);
            takePhoto( url, ( pictureHtmlCode ) => {
                cpiBody.push( pictureHtmlCode );
                console.log("A kép HTML Kódja" + pictureHtmlCode);
                cpicapturer.clickToShowHelp( () => {
                    cpicapturer.collectTheQuestionMarks( (qms) => {
                        //cpiBody.push( qms );
                        qms.forEach( ( qmsPiece ) => {
                            var contet = qmsPiece.pop();
                            cpiBody.push(contet);
                            console.log( "A CONTET: " + contet);
                        } );
                    //    console.log( "From render...Element to collect: " + qms + " hossz: " + qms.length );
                        generateDocumentation( () => writeHtmlFile() );  
                    });
                                               
                });
            } );
            
        })
        
    });
}

function takePhoto( url, callback ){
    var res = url.split("/");
    var filename = res.pop();
    webCapturer.takePhoto( url, filename + ".png", function(){ 
                                                            console.log("Photo is Ready");
                                                            var picureHtmlCode = "<img src="+ filename +".png>"
                                                            callback(picureHtmlCode);
                                                           // webCapturer.close(); 
                                                        } );
}

function generateDocumentation( callback ){
  //  console.clear();   
    console.log("================================================================================================== ");
    console.log("================================================================================================== ");
    console.log( cpiBody );
    console.log("======================================== H T M L ================================================= ");
    
    cpiBody.forEach( (elem ) => {
        console.log( elem );
        console.log( "Az elem típusa:::::::::::::::" + typeof(elem) );
        bodyHTML = bodyHTML + elem;
    } );
 /*   cpiHTML.concat( startHTML );
    cpiHTML.concat( bodyHTML );             //Not works   WHY???
    cpiHTML.concat( endHTML ); */
    console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::")
    console.log("A startHTLMtartalma: " + startHTML);
    console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::")
    cpiHTML += startHTML;
    cpiHTML += bodyHTML;
    cpiHTML += endHTML;



    console.log("======================================== H T M L    B O D Y  ================================================= ");
    console.log( bodyHTML );
    callback();
}

function writeHtmlFile( name ){
    fs.writeFileSync( 'NL_Dock.html', cpiHTML, 'utf8' );
}



var startHTML = ` <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>CPI Document</title>
</head>
<body> `;

var endHTML = ` </body>
</html> `


/*
//webCapturer.takePhoto( "http://10.41.96.135/status/NE_Overview", "node.png", function(){ console.log("NODE Capture HTML Ready"); } );

/*webCapturer.takePhotos([
    { url: "http://favoritweb.hu/", file: "favoritweb.png" },
    { url: "http://lap.hu/",        file: "lap.png" },
    { url: "http://freemail.hu/",        file: "freemail.png" },
    { url: "http://google.com/",    file: "google.png" }
    ], function(){ console.log("All Ready");
        webCapturer.close(); }); */

//htmlCapturer.takeHTMLIndex( "https://index.hu/" );

//webCapturer.close();
