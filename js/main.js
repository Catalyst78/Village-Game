var intervalCount = 0;

function init() {
	clearAllData()
	prepareTabs();
	clearConsole();

	if ((localStorage.getItem("save") !== null )) 
		loadGame();	
		
	// stop firefox from carrying over disabled tag on refresh
	// document.getElementById("territory_button").disabled = false;
	
  window.setInterval(function() {
		if (incrementMe.resource !== "") {
			modifyResource(incrementMe.resource, incrementMe.number);
			//showResourceText(incrementMe.resource);
		}
		if (intervalCount > 10) {
			saveGame() 
			intervalCount = 0;
		}
		intervalCount += 1;
	}, 1000);
}


// Main
var DEFAULT_RESOURCES = {
};
var resources = DEFAULT_RESOURCES;

var DEFAULT_INCREMENT_ME = {
	resource:"",
	number:0
}
var incrementMe = DEFAULT_INCREMENT_ME;

function incrementResource(resource, number) {
	incrementMe.resource = resource;
	incrementMe.number = number;
}

function modifyResource(resource, number) {
	resources[resource] += number;
	document.getElementById(resource).innerHTML = resources[resource];
}

function setResource(resource, number) {
	resources[resource] = number;
	document.getElementById(resource).innerHTML = resources[resource];
}

function hideResourceText(resource)	{
	if (resource != "")
		document.getElementById(resource + "_div").style.visibility = "hidden";
}

function showResourceText(resource)	{
	document.getElementById(resource + "_div").style.visibility = "visible";
}

function updateResourceText(resource) {
	document.getElementById(resource).innerHTML = resources[resource];
}

function updateAll() {
	//document.getElementById('cursorCost').innerHTML = Math.floor(10 * Math.pow(1.1, resources.cursors));
	for (resource in resources) {
		if (resources[resource] != 0) {
			document.getElementById(resource).innerHTML = resources[resource];
			updateResourceText(resource);
			showResourceText(resource);
		}
	}
}


// Buttons
var selectedButton = "";

function gridSpaceClick(buttonId) {
	buttonDeselect(selectedButton);
	selectedButton = "btn" + buttonId;
	
	document.getElementById(selectedButton).disabled = true;
	document.getElementById(selectedButton).src = "images/square2.png";
}

function explore() {
	buttonClicked("territory");
};

function buttonDeselect(buttonId) {
	if (buttonId != "") {
		document.getElementById(buttonId).src = "images/square.png";
	}
}

function buyCursor() {
	var cursorCost = Math.floor(10 * Math.pow(1.1,resources.cursors));  
	if(resources.territory >= cursorCost){                                 
		modifyResource("cursors", 1)                               
		modifyResource("territory", -cursorCost)                     
		document.getElementById('territory').innerHTML = resources.territory;  
	};
	var nextCost = Math.floor(10 * Math.pow(1.1,resources.cursors));      
	document.getElementById('cursorCost').innerHTML = nextCost; 
};


// Console
var consoleList = [];
var maxLines = 12;

function clearConsole() {
	for (var i = 0; i < maxLines; i++) 
		updateConsole(""); 
}

function setConsole(consoleLineList) {
	for (var a = consoleLineList.length - 1; a >= 0; a--)
		updateConsole(consoleLineList[a]);
}

function updateConsole(newLine) {
	consoleList.unshift(newLine);
	if (consoleList.length > maxLines)  
		consoleList.pop(); 
	var datConsoleText = "";
	for (var a = 0; a < consoleList.length; a++) 
		datConsoleText += consoleList[a] + "<br>";
	document.getElementById("bunnyConsole").innerHTML = datConsoleText;
}

// Save & Load
function saveGame() {
	var save = {
		consoleData: consoleList,
		territory: resources.territory
	}	
	localStorage.setItem("save",JSON.stringify(save));
	console.log("Saved");
}

function loadGame() {
	var saveGame = JSON.parse(localStorage.getItem("save"));
	if (typeof saveGame.consoleData !== "undefined") setConsole(saveGame.consoleData);
	if (typeof saveGame.territory !== "undefined") setResource("territory", saveGame.territory);
	updateAll();
	console.log("Loaded");
}

function clearAllData() {
	intervalCount = 0;
	clearConsole();
	
	buttonDeselect(selectedButton);
	for(var resource in resources) {
		resources[resource] = 0;
		hideResourceText(resource);
	}
	saveGame()
	
	updateAll();
	showTab("main_tab");
	console.log("Everything is gone!");
}


// Tabs
var tabLinks = new Array();
var contentDivs = new Array();
var defualtTab = 0;

function prepareTabs() {
	var tabListItems = document.getElementById('tabs').childNodes;
	for ( var i = 0; i < tabListItems.length; i++ ) {
		if ( tabListItems[i].nodeName == "LI" ) {
			var tabLink = getFirstChildWithTagName( tabListItems[i], 'A' );
			var id = getHash( tabLink.getAttribute('href') );
			tabLinks[id] = tabLink;
			contentDivs[id] = document.getElementById( id );
		}
	}
	tabSelect(tabLinks, defualtTab);
	tabContentHide(contentDivs);
}

function tabSelect(tabs, tab) {    
	var i = 0;
	for ( var id in tabs ) {
		tabs[id].onclick = tabClicked;
		tabs[id].onfocus = function() { this.blur() };
		if ( i == tab ) tabs[id].className = 'selected';
			i++;
	}    
}

function tabContentHide(content) {
	var i = 0;
	for ( var id in content ) {
		if ( i != defualtTab ) content[id].className = 'tabContent hide';
			i++;
	}
}

function tabClicked() {
	showTab(getHash(this.getAttribute('href')));
}

function showTab(tabId) {
	for ( var id in contentDivs ) {
		if ( id == tabId ) {
			tabLinks[id].className = 'selected';
			contentDivs[id].className = 'tabContent';
		} else {
			tabLinks[id].className = '';
			contentDivs[id].className = 'tabContent hide';
		}
	}
	return false;
}

function getFirstChildWithTagName(element, tagName) {
	for ( var i = 0; i < element.childNodes.length; i++ ) {
		if ( element.childNodes[i].nodeName == tagName ) 
			return element.childNodes[i];
	}
}

function getHash(url) {
	var hashPos = url.lastIndexOf ( '#' );
	return url.substring( hashPos + 1 );
}