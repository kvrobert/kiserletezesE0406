function removeStyleAttributesFromHTL( html )
{
    var pattern = /style=".*?"/i;           // ennek az összesnek csinálok egy service.js -t..oda bele... megcsinálja..visszaadja...stb
    do
    {
        html = html.replace( pattern, '' );
    }
    while( html.search(pattern) >= 0 );

    return html;
}

console.log( "Device: "+Config.device );

var html = `
<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <meta http-equiv="X-UA-Compatible" content="ie=edge">
   <title>CPI Document</title>
</head>
<body> Network element
                   <span class="subtitle"></span>
                   <!---->
               <img src=NE_Overview.png>
       <span class="message cpi blue" style="white-space: initial; cursor: pointer; position: absolute; left: 0px; top: 0px; width: 500px;">Displays status parameters for the NE.<ul><li><b>NE Status</b> — Displays the status of the NE.<ul><li><b>In Service</b> — The NE is operating properly.</li><li><b>Reduced Service</b> — Traffic is running, but the management functionality is reduced or unavailable.</li><li><b>Out of Service</b> — The NE is not operating.</li></ul></li><li><b>NTP Status</b> — Displays the operational status of an NTP service. Only available if the NE is configured to use an NTP server.<ul><li><b>Up</b> — Contact established with NTP server.</li><li><b>Down</b> — Contact lost with NTP server.</li><li><b>Server Not Configured</b> — An NTP server is not configured.</li></ul></li><li><b>SW Status</b> — Displays whether a software upgrade is in progress.</li><li><b>Notifications</b> — Displays if notifications are enabled or disabled.</li></ul></span>
       <span class="toolTab blue left" style="white-space: initial; cursor: pointer; left: 500px; top: 115px;"></span>
   
       <span class="message cpi blue" style="white-space: initial; cursor: pointer; position: absolute; left: 0px; top: 0px; width: 500px;">Displays status parameters for the NE.<ul><li><b>Node Uptime</b> — Displays the time since the network management part of the system was last re-initialized.</li><li><b>Node Date and Time</b> — Displays the date and time of the NE.</li><li><b>Software Baseline</b> — Displays the software baseline of the NE.</li><li><b>Telecom Standard</b> — Displays which standard (ANSI or ETSI) the NE supports.</li><li><b>DCN-Mode</b> — Displays the DCN mode.<br>The possible values are as follows:<ul><li><b>VLAN</b> — DCN over VLAN</li><li><b>Routed</b> — Routed DCN</li></ul></li></ul></span>
       <span class="toolTab blue left" style="white-space: initial; cursor: pointer; left: 500px; top: 107px;"></span>
   
       <span class="message cpi blue" style="white-space: initial; cursor: pointer; position: absolute; left: 0px; top: 0px; width: 500px;">Displays the overall NE license status.<ul><li><b>NE License Status</b> — Displays the NE license status.<br>The displayed information is one of the following:</li><ul><li><b>OK</b> — There is no warning or degradation for any of the licensed features.</li><li><b>Warning</b> — There are one or more warnings but there are no degradations for the licensed features.</li><li><b>Degraded</b> — There are one or more degradations for the licensed features.</li></ul><li><b>NE License Mode</b> — Displays the NE license mode. Displayed value is <b>Unlocked</b> or <b>Locked.</b></li><li><b>Unlocked Reason</b> — Displays the reason of entering an unlocked period.<br>The displayed value is one of the following:<ul><li><b>Integration Unlock</b> — The NE enters an unlocked period due to network roll-out. The operator can activate this unlocked mode.</li><li><b>Maintenance Unlock</b> — The NE enters an unlocked period due to an urgent maintenance issue. The operator can activate this unlocked mode.</li><li><b>Emergency Unlock</b> — The NE enters an unlocked period due to an emergency issue. The operator can activate this unlocked mode.</li><li><b>RMM Missing</b> — The NE enters an unlocked period due to missing or faulty RMM. The system automatically activates this unlocked mode.</li><li><b>Software Upgrade</b> — The NE enters an unlocked period due to software upgrade. The system automatically activates this unlocked mode.<br>The following software upgrades can activate an unlocked period:<ul><li>Upgrading from an unlocked mode SW release to a locked mode SW release.</li><li>Upgrading from a locked mode SW release to a new main locked mode SW release.</li></ul></li><li><b>N/A</b> — The NE has not entered an unlocked period.</li></ul></li><li><b>Left Unlocked Time</b> — Displays the time left for unlocked mode. If the NE operates in locked mode, MINI-LINK Craft displays <b>N/A.</b></li><li><b>Latest Unlocked Period Entered</b> — Displays the date and time when the NE entered the latest unlocked period. If the NE operates in locked mode, MINI-LINK Craft displays <b>N/A.</b></li></ul></span>
       <span class="toolTab blue left" style="white-space: initial; cursor: pointer; left: 500px; top: 115px;"></span>
   
       <span class="message cpi blue" style="white-space: initial; cursor: pointer; position: absolute; left: 0px; top: 0px; width: 500px;">Displays the accumulated status of each unit in the enclosure. MMUs are shown together with their radios.</span>
       <span class="toolTab blue left" style="white-space: initial; cursor: pointer; left: 500px; top: 17px;"></span>
   
       <span class="message cpi blue" style="white-space: initial; cursor: pointer; position: absolute; left: 0px; top: 0px; width: 366.266px;">Displays the NE alarms. See also the applicable alarm descriptions.</span>
       <span class="toolTab blue left" style="white-space: initial; cursor: pointer; left: 366.266px; top: 9px;"></span>
    </body>
</html>  `;
        

console.log( removeStyleAttributesFromHTL(html) );

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

var nodeUrel = "http://10.41.96.136";
var url = "http://10.41.96.136/status/NE_Overview"; //  ===> szetszedve: nodUrel+url ...igy lesz a teljes cim 
                                                    // mondjuk a ciklust végző callback function adná őket vissza..kiszedve a config-ból

//var webCapturer = new WebCapturer();
var cpicapturer = new CPICapturer(driver);

//webCapturer.initialDriver( driver, () => console.log("PhotoCapture has been initialised") );
cpicapturer.manageWindow( null, () => render() );

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
                        generateDocumentation( () => writeHtmlFile() );  // itt egy plusz callback... megnézi van e még URL, 
                    });                                                 // ha igen, rekurzívan meghívja magát.. ha nincs, doksi generálás
                                               
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
