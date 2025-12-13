//Global Variables
var myEvents;
var idEvents = [];
var rightNow = new Date();

var offset = new Date().getTimezoneOffset();
console.log(offset);
var PST_offset = offset-420; //Switches between 420 and 480 based on DST
rightNow.setMinutes( rightNow.getMinutes()+PST_offset );

var days = new Array(7)
days[0] = "Sunday";
days[1] = "Monday";
days[2] = "Tuesday";
days[3] = "Wednesday";
days[4] = "Thursday";
days[5] = "Friday";
days[6] = "Saturday";

var months = new Array(12);
months[0] = "January";
months[1] = "February";
months[2] = "March";
months[3] = "April";
months[4] = "May";
months[5] = "June";
months[6] = "July";
months[7] = "August";
months[8] = "September";
months[9] = "October";
months[10] = "November";
months[11] = "December";

//EVENT HANDLERS
$(document).ready(function(){
	var xmlHttp = new XMLHttpRequest();
    
    var randomVar = Math.floor( Math.random() * ( 1000000000) );  //using this to bust caching of the JSON file(s)
    xmlHttp.open( "GET", "https://www.pianofight.com/internal/eventbrite-data/events-live-min2.JSON?v=" + randomVar , false )
    xmlHttp.send();
    myEvents = JSON.parse(xmlHttp.responseText);
    //console.log(myEvents);
    
    var queryParams = getJsonFromUrl();
    
    // Query params handlers
    if(queryParams["q"] != undefined){ $('#pfcal-search-box').val(queryParams["q"]); }
    if(queryParams["price"] === "Free"){ $("#cbox-freeEvents").prop('checked', true); }
    
    if(queryParams["category"] === "Comedy"){ $('#pfc2-categories').val("Comedy") }
    else if(queryParams["category"] === "Music"){ $('#pfc2-categories').val("Music") }
    else if(queryParams["category"] === "Theater"){ $('#pfc2-categories').val("Theater") }
    else if(queryParams["category"] === "Dance"){ $('#pfc2-categories').val("Dance") }
    else if(queryParams["category"] === "Film"){ $('#pfc2-categories').val("Film") }
    else if(queryParams["category"] === "Other"){ $('#pfc2-categories').val("Other") }
    else { $('#pfc2-categories').val("All") }
    
    feedIndexes();
    $('#pf-show-calendar2').width( $(window).width+1 );
	
	$("#pfc2-categories").on( "change", function(){
		feedIndexes();
	});
	
	$("#cbox-freeEvents").on( "change", function(){
		feedIndexes();
	});
	
	/*$("#pfc2-date-picker").on( "focus", function(){		
		this.blur();
	});*/
	
	$("#pfcal-search-box").on( "focus", function(){
		ga('send', 'event', 'pfcal_search_box', 'focus');
	});
	
	$("#pfcal-search-box").on( "blur", function(){
		ga('send', 'event', 'pfcal_search_box', 'blur', $("#pfcal-search-box").val() );
	});
	
	$("#pfcal-search-box").on( "input", function(){
		//$("#pfc2-date-picker-div").hide();
		$("#pfc2-date-picker").val("");
		feedIndexes();
	});
	
	$('#cbox-reset-date').on ( "click", function(){
		$("#pfc2-date-picker").val("");
		feedIndexes();
	});
	
	$("#pfc2-date-picker").on("focus",function(){
		ga('send', 'event', 'pfcal_datepicker', 'focus');
	});
	
	$("#pfc2-date-picker").on("change",function(){
		$("#pfcal-search-box").val("");	
		feedIndexes();
		
		var calDate = new Date( $("#pfc2-date-picker").val() );
		
		ga('send', 'event', 'pfcal_datepicker', 'blur', (gimmeADate(calDate) + " " + calDate.getFullYear() ) );
	});
	
	$( window ).resize(function(){
		feedIndexes();
		$('#pf-show-calendar2').width( $(window).width()+1 );
	});
});

function feedIndexes(){
	var eIndexes = [];
    for(i=0; i<myEvents.length; i++){
    	eIndexes.push(i);
    }
	
	filterResults(eIndexes);
}

// SEARCH & FILTERING FUNCTION
function filterResults(eIndexes){
	var eIndexesPrime = [];
	//var cboxValues = [];
	
	for (i=0; i<eIndexes.length; i++){
		if ( $('#pfcal-search-box').val() === "" || myEvents[eIndexes[i]]["name"].toLowerCase().indexOf($('#pfcal-search-box').val().toLowerCase() ) > -1 || myEvents[eIndexes[i]]["description"].toLowerCase().indexOf($('#pfcal-search-box').val().toLowerCase() ) > -1 || myEvents[eIndexes[i]]["category"].toLowerCase().indexOf($('#pfcal-search-box').val().toLowerCase() ) > -1 || myEvents[eIndexes[i]]["price"].toLowerCase().indexOf($('#pfcal-search-box').val().toLowerCase() ) > -1  ){
			eIndexesPrime.push(i);
		}
	}
	
	buildCalendarList(eIndexesPrime);
}

// LIST VIEW HTML BUILDER
function buildCalendarList(eIndexes){
	var html = "";
	
	if(eIndexes.length === 0){
		html += "<h1 style='text-align:center;'>No Results</h1>";
	}
	else{				
		if ($('#pfcal-search-box').val() === ""){
			
			// Set initial and final date range			
			if( $('#pfc2-date-picker').val() === ""){ var dateCounter = new Date(); dateCounter.setMinutes( dateCounter.getMinutes()+PST_offset ); }
			else{ var dateCounter = new Date ( $('#pfc2-date-picker').val() ); }
			dateCounter.setHours(0,0,0,0);
			var finalDisplayDate = new Date(myEvents[eIndexes[eIndexes.length-1]].start);
			
			finalDisplayDate.setMinutes(finalDisplayDate.getMinutes() + PST_offset);
			
			finalDisplayDate.setHours(0,0,0,0);
		
			var dateEvents = createDateArray(eIndexes);
			while(dateCounter <= finalDisplayDate){
				html += "<h3 style='text-align:center; background:#393138; color:#ddd; margin-bottom:6px; padding:6px 0px;'>" + gimmeADate(dateCounter) + "</h3>";
				
				if(dateCounter.getTime() in dateEvents){
					for(i=0; i< dateEvents[dateCounter.getTime()].length; i++){
						html += perShowHtmlList( dateEvents[dateCounter.getTime()][i] );
					}
				}
				else{
					html += "<div style='font-size:1.2em; text-align:center; margin-bottom:6px;'>Closed.</div>"
				}			
				
				dateCounter.setDate(dateCounter.getDate()+1);
			}
		}
		else{
			for (i=0; i<eIndexes.length; i++){
				eDate = new Date(myEvents[eIndexes[i]].start);
				eDate.setMinutes(eDate.getMinutes() + PST_offset);
				eDate.setHours(0,0,0,0);
				html += "<h3 style='text-align:center; background:#393138; color:#ddd; margin-bottom:6px; padding:6px 0px;'>" + gimmeADate(eDate) + "</h3>";
				html += perShowHtmlList(myEvents[eIndexes[i]]);
			}
		}
		
	}
	
	$('#pf-show-calendar2').html(html);
	
	//Google Analytics tagging
	var gaClientId;
	ga(function(tracker) {
		gaClientId = tracker.get('clientId');
	
		$('.gaTag').each(function(){
			$(this).attr("href", $(this).attr("href") + "?aff=pfcal&_eboga=" + gaClientId ) 
		});
	});
}

function perShowHtmlList (event){
	eDate = new Date(event.start)
	eDate.setMinutes(eDate.getMinutes() + PST_offset);
	
	var tempHtml = "";
	
	tempHtml += "<a href='" + event.url + "' class='gaTag'>";
		tempHtml += "<div style='text-align: center;' class='pfc2-button'>";
			tempHtml += "<div style='width:300px; height:150px; display: inline-block; vertical-align:top; margin-bottom: 0px; background:center center url(" + event.logo_url + "); background-size:cover; position:relative;' class='pfc2-full-width-mobile'>";
				tempHtml += "<div style='position:absolute; top:4px; left: 4px; color:#333; background-color:rgba(255,255,255,0.9); padding: 2px; line-height: 1em; font-weight:bold; font-size:1.4em;'>";
				
					tempHtml += searchHighlight(gimmeATime(eDate));
					
				tempHtml += "</div>";
				tempHtml += "<div style='position:absolute; top:4px; right: 4px; color:#333; background-color:rgba(255,255,255,0.9); padding: 2px; line-height: 1em; font-weight:bold;'>";
				
					tempHtml += searchHighlight(event.price);
					
				tempHtml += "</div>";
				tempHtml += "<div style='position:absolute; top:24px; right: 4px; color:#333; background-color:rgba(255,255,255,0.9); padding: 2px; line-height: 1em; font-weight:bold;'>#";
				
					tempHtml += searchHighlight(event.category);
					
				tempHtml += "</div>";
			tempHtml += "</div>";
	
			tempHtml += "<div style='display:inline-block; vertical-align:top; width:calc(100% - 300px); color:#333; height:150px; overflow:hidden; position:relative; min-width:300px; text-align: left;' class='pfc2-full-width-mobile'>";
				tempHtml += "<div style='font-weight:bold; display:inline-block; font-size:1.6em; line-height:1.1em; padding:0px 8px; text-align: left;'>";
		
					tempHtml += searchHighlight(event.name);
			
				tempHtml += "</div>";
				tempHtml += "<div class='pf2c-event-description' style='padding:0px 8px; text-align: left;'>";
				
					tempHtml += searchHighlight(event.description);
					
				tempHtml += "</div>";
				tempHtml += "<div class='pf2c-event-text-fade'></div>";
			tempHtml += "</div>";
		tempHtml += "</div>";
	tempHtml += "</a>";	
	
	return tempHtml;	
}

function searchHighlight(text){
	//SEARCH BOX DESCRIPTION HIGHLIGHTING CODE
	//if(!text){text=""}
	var searchHtml = "";
	var indexSubstring = text.toLowerCase().indexOf($('#pfcal-search-box').val().toLowerCase());
	var lenString = text.length;
	var lenSubstring = $('#pfcal-search-box').val().length;
	if( $('#pfcal-search-box').val() != "" && indexSubstring > -1){
		searchHtml += text.substring(0, indexSubstring);
		searchHtml += "<span style='background:#ffff99;'>";
		searchHtml += text.substring(indexSubstring, indexSubstring + lenSubstring);
		searchHtml += "</span>";
		searchHtml += text.substring(indexSubstring + lenSubstring, lenString);
	}
	else{
		searchHtml += text;
	}
	//END SEARCH BOX HIGHLIGHTING CODE
	return searchHtml;
}

function createDateArray(eIndexes){
	var dateEvents = new Object();
	
	for (i=0;i<eIndexes.length; i++){
		eDate = new Date(myEvents[eIndexes[i]].start);
		eDate.setMinutes(eDate.getMinutes() + PST_offset);
		eDate.setHours(0,0,0,0);
		
		if( !(eDate.getTime() in dateEvents) ){ dateEvents[eDate.getTime()] = []; }
		
		dateEvents[eDate.getTime()].push(myEvents[eIndexes[i]]);
	}
	
	return dateEvents;
}

// SUPPORT FUNCTIONS
function getJsonFromUrl() {
	var query = location.search.substr(1);
	var result = {};
	query.split("&").forEach(function(part) {
	var item = part.split("=");
		result[item[0]] = decodeURIComponent(item[1]);
	});
	return result;
}

function gimmeADate (myDate){
	var formattedDate = "";
	
	var today = new Date();
	today.setHours(0,0,0,0);
	var tomorrow = new Date();
	tomorrow.setHours(24,0,0,0);
	
	today.setMinutes(today.getMinutes() + PST_offset);
	tomorrow.setMinutes(tomorrow.getMinutes() + PST_offset);

	formattedDate += days[myDate.getDay()].substring(0,3) + " ";
	formattedDate += months[myDate.getMonth()] + " ";
	formattedDate += myDate.getDate();
	//formattedDate += myDate.getFullYear();
	
	if(myDate.getTime() === today.getTime()){ return("Today ("+formattedDate+")") }
	else if(myDate.getTime() === tomorrow.getTime()){ return("Tomorrow ("+formattedDate+")") }
	else { return(formattedDate) }
	//return(formattedDate);
}

function gimmeATime (myDate){
	var formattedTime = "";
	
	if (myDate.getHours() > 12){ formattedTime += (myDate.getHours()-12) }
	else { formattedTime += myDate.getHours() }
	
	formattedTime += ":"
	
	if (myDate.getMinutes() < 10){ formattedTime += "0"}
	formattedTime += myDate.getMinutes()
	
	if (myDate.getHours() > 12){ formattedTime += "PM" }
	else { formattedTime += "AM" }
	
	return formattedTime;
}