
/*************************
 *        READY
*************************/
document.onreadystatechange = function() {
	if (document.readyState != 'complete') {
		return;
	}
	
	aaumBack.src = "img/back.png";
	
	jQuery.support.cors = true; // force cross-site scripting (as of jQuery 1.5)
	
	AAUM.init();
}


/*************************
 *        AAUM
*************************/
var AAUM = function() {
	
	var config = {
		authors: "James Roberts, Hamradio, L. Sandery", //could load this from gadget manifest xml but don't want the extra overhead of doing that
		updateIntervalPeriod: 30, // Minutes between updates.
		settingsUI: 'settings.html',
		xmlURL: 'https://members.adam.com.au/api/',
		gadgetCheckURL: 'http://users.adam.com.au/galbraith/aaum/version.json',
		gadgetDownloadURL: 'http://users.adam.com.au/galbraith/aaum/AAUMv5.gadget'
	};
	
	var data = {
		quotaStartDate: '',
		planName: '',
		IPv4Address: '',
		ADSLInfo: ''
	}
	
	var username = 'fakename'; //not required but we need to use something other ajax request will fail
	var password = ''; //the users token
	var accountType = 'Auto'; //Account type to load, 'Auto' is a special value which always loads first account found in the xml
	var updateIntervalId = null;
	
	var working = false; //Is the AAUM working currently, has the xml successfully loaded
	var debugMode = true; //Enables exceptions to be thrown on certain errors
	
	var buckets = Array(); //Array of Bucket objects
	var ttMananger = null; //Tooltip Manager instance
	
	/*
	 * INIT
	*/
	var init = function() {
		
		System.Gadget.settingsUI = config.settingsUI;
		
		System.Gadget.Settings.writeString('authors', config.authors);
		
		displayError('no_cred', true);
		
		System.Gadget.onSettingsClosed = function(event) {
			
			if (event.closeAction != event.Action.commit) {
				return;
			}
			
			reset(false, false);
			
			//settings changed so update
			accountType = System.Gadget.Settings.readString('accountType');
			password = System.Gadget.Settings.readString('password');
			
			checkNewGadgetVersion();
		};
		
		// If we already have these vars availble it is probably due to a reboot
		// since System.Gadget.Settings are stored on reboot but not the local vars
		if (System.Gadget.Settings.readString('password') !== '') {
			
			accountType = System.Gadget.Settings.readString('accountType');
			password = System.Gadget.Settings.readString('password');
			
			reset(false, false);
			checkNewGadgetVersion();
		}
		
	}
	
	/*
	 * CHECK NEW GADGET VERSION
	*/
	//Check for a new version of the gadget if one is available display error, otherwise loadXml()
	//Version number must be in the form e.g. 5.0.0
	var checkNewGadgetVersion = function() {
		
		$.ajax({
			url: config.gadgetCheckURL,
			cache: false,
			dataType: 'json',
			crossDomain: true,
			error: function(jqxhr, statusText, exceptn) { 
				
				if(debugMode) {
					throw new Error("AAUM.checkNewGadgetVersion() Ajax Error: "+ jqxhr.status + ", "+ jqxhr.responseXML + ", "+ statusText +", "+ exceptn);
				}
				
				// something went wrong but lets assume everything is ok and allow the gadget to continue loading
				loadXML();
			},
			success: function(json, statusText, xhr) {
				
				//check and compare the gadget version with the current online version
				var parts1 = System.Gadget.version.split( "." );
				var parts2 = json.version.split( "." );
				/*if( parts1.length != parts2.length ){
					   return false;
				}*/
				
				for( var i = 0; i < parts1.length; i++ ) {
					var v1 = parseInt( parts1[ i ] );
					var v2 = parseInt( parts2[ i ] );
				   	if( v1 < v2 ) {
					   	displayError('blank', true, 'New Gadget Version Available <br /><a href="' + config.gadgetDownloadURL + '">Download Now</a>');
						return;
				   	}
				}
				loadXML();
				
			}
		});
	}
	
	/*
	 * LOAD XML
	*/
	var loadXML = function() {
		
		displayLoading();
		
		jQuery.support.cors = true; // force cross-site scripting (as of jQuery 1.5)
		
		$.ajax({
			url: config.xmlURL,
			cache: false,
			username: username,
			password: password,
			dataType: 'xml',
			crossDomain: true,
			type: 'GET',
			data: {
					ref: 'AAUM.gadget',
					rand: Math.floor(Math.random()*100001)
				  },
			error: function(jqxhr, statusText, exceptn) { 
				
				switch (statusText) {
					case 'timeout': // try again sooner
					case 'parsererror':
						displayError('data', true);
					case 'notmodified': // all good
						break;
					case 'error':
						if (jqxhr.status == 401) {
							displayError('auth', true);
							return;
						}
					default:
						displayError('none', false);
				}
				
				//error probably temporary, continue
				updateIntervalId = window.setInterval(loadXML, config.updateIntervalPeriod * 60 * 1000);
				
				if(debugMode) {
					throw new Error("AAUM.LoadXML() Ajax Error: "+ jqxhr.status + ", "+ jqxhr.responseXML + ", "+ statusText +", "+ exceptn);
				}
				
			},
			success: function(xml, statusText, xhr) {
				parseXML(xml);
			}
		});
		
	}
	
	/*
	 * PARSE XML
	*/
	var parseXML = function(xml) {
		
		reset(false, false);
		
		//if xml is a error response server could be having trouble, api error code 2 should not display since it'll be caught by the ajax request
		if($(xml).find('Error').length > 0) {
			
			displayError('blank', false, 'Adam Api Error Code '+$(xml).find('ErrorCode').text());
			
			if(debugMode) {
				throw new Error("AAUM.parseXML() API Error: "+ $(xml).text());
			}
			
			return;
		}
		
		
		if (accountType == "Auto" || accountType == "First") {
			var account = $(xml).find('Account').first();
		} else if (accountType == "AdamTalk") { //list the unsupported accountType's here, currently that's just AdamTalk
			//This account type uses a very different format so it isn't supported yet... :(
			displayError('blank', true, accountType + ' not supported :(');
			return;
		} else {
			var account = $(xml).find('Account[type="'+accountType+'"]');
			
			//The following error shouldn't happen since the account types are read from the xml directly but could be caused by a parsing error
			if(account.length < 1) {
				displayError('blank', true, 'Account Type Not Found');
				return;
			}
		}
		
		
		//////////////////////////////
		// Populate account options
		//////////////////////////////
		
		var accountOptions = Array('Auto');
		
		$(xml).find('Account').each(function() {
											 	accountOptions.push( $(this).attr('type') );
											 });
		
		System.Gadget.Settings.writeString('accountOptions', JSON.stringify(accountOptions));
		
		
		data.quotaStartDate = Date.parse( account.children('QuotaStartDate').text() ); //Slightly reparse the date string
		data.planName = account.children('PlanName').text(); //Store plan name
		
		data.IPv4Address = account.find('IPv4Address').first().text(); //just get the first IPv4address should be fine for most users
		System.Gadget.Settings.writeString('IPv4Address', data.IPv4Address);
		
		var adslBlock = account.find('ADSL'); //ref this part of the xml so we can use children() rather than find(), because children() is faster
		if(adslBlock.length > 0) {
			data.ADSLInfo = {
				SyncUP: 			adslBlock.children('SyncUp').text() / 1000000, //convert bits to mbits
				SyncDown: 			adslBlock.children('SyncDown').text() / 1000000,  //convert bits to mbits
				SNRUp: 				adslBlock.children('SNRUp').text(),
				SNRDown: 			adslBlock.children('SNRDown').text(),
				AttenuationUp: 		adslBlock.children('AttenuationUp').text(),
				AttenuationDown: 	adslBlock.children('AttenuationDown').text()
			}
			
			System.Gadget.Settings.writeString('ADSLInfo', JSON.stringify(data.ADSLInfo));
		}
		
		//////////////////////////////
		//Create days remaining bucket
		//////////////////////////////
		
		var quotaEndDate = data.quotaStartDate.clone().addMonths(1);
		var hoursInMonth = (quotaEndDate.getTime() - data.quotaStartDate.getTime()) / (1000*60*60);
		var hoursUsed = (Date.parse('now').getTime() - data.quotaStartDate.getTime()) / (1000*60*60);
		
		var daysBucket = new Bucket(hoursInMonth, hoursUsed, 0, "Days");
		
		//Override the default getTooltip() function for the days bucket
		daysBucket.getTooltip = function() {
			
			var descTxt;
			if( Math.ceil((this.quota - this.usage) / 24) > 1 ) {
				descTxt = this.getSideText().replace("d", "") + " days remaining"
			} else {
				descTxt = this.getSideText().replace("h", "");
				descTxt = (Math.ceil(this.quota - this.usage) == 1) ? descTxt + " hour remaining" : descTxt + " hours remaining";
			}
			
			//var titleTxt = data.planName.replace(/[0-9]*(MB|GB|TB)/g, ""); //Remove quota from plan name e.g. 250GB, 1000GB etc...
			var titleTxt = data.planName;
			
			//Replace 'Adam' in title only if it is the first word e.g. 'AdamEzyChoice' will become 'EzyChoice' but 'EzyAdamChoice' will not be changed.
			var titleTxt = (titleTxt.indexOf('Adam') == 0) ? titleTxt.replace('Adam', '') : titleTxt; 
			
			//Change the font-size if the string is too long
			if(titleTxt.length > 16) {
				var titleTxt = '<span style="font-size:11px">' + titleTxt + '</span>';
			}
			
			return { title: titleTxt, desc: descTxt, colour: "white" };
		};
		
		//Override the default getSideText() function for the days bucket
		daysBucket.getSideText = function() {
											 //if it is the last day then show days remaining otherwise show hours remaining
											 
											 if( Math.ceil((this.quota - this.usage) / 24) > 1 ) {
											 	return Math.ceil((this.quota - this.usage) / 24) + "d";
											 } else {
												return Math.ceil(this.quota - this.usage) + "h";
											 }
											};
		daysBucket.repaint(); //repaint to update the side text
		
		buckets.push( daysBucket );
		
		
		//////////////////////////////
		//Create data buckets
		//////////////////////////////
		
		$(account).children('Usage').children('Bucket').each( function(){
											 var datablocks = ($(this).children('Datablocks').length > 0) ? $(this).children('Datablocks').text() : 0; //datablocks field might not be in the xml, so set it to 0 if it isn't
											 
											 //create bucket and convert bytes to megabytes
											 buckets.push( new Bucket( $(this).children('Quota').text()/1000000, $(this).children('Usage').text()/1000000, datablocks/1000000, $(this).attr('desc') ));
											});
		
		//////////////////////////////
		//Create Tooltip Manager
		//////////////////////////////
		
		var tooltips = Array();
		
		$(buckets).each(function() {
			tooltips.push( this.getTooltip() );
		});
		
		ttMananger = new TooltipManager(tooltips);
		ttMananger.start();
		
		//////////////////////////////
		
		$('#error').hide(); //hide the error div
		working = true; //yay :D
		
		window.clearInterval(updateIntervalId);
		updateIntervalId = window.setInterval(loadXML, config.updateIntervalPeriod * 60 * 1000);
	}
	
	/*
	 * DISPLAY LOADING
	*/
	//Alias for displayError
	var displayLoading = function displayLoading() {
		displayError('loading', false);
	}
	
	/*
	 * DISPLAY ERROR
	*/
	var displayError = function displayError(eClass, fatal, errorText) {
		var $e = $('#error');
		
		$e.removeClass();
		
		if (!eClass) {
			$e.hide();
			return;
		}
		
		if(errorText) {
			$e.children('p').empty().html(errorText);
		} else {
			$e.children('p').empty().text('');
		}
		
		reset(!fatal, true);
		$e.addClass(eClass).show();
	}
	
	/*
	 * RESET
	*/
	var reset = function(allowUpdate, fromError) {
		working = false;
		
		if (!allowUpdate) {
			window.clearInterval(updateIntervalId);
		}
		if (!fromError) {
			displayError();
		}
		
		if(ttMananger != null) {
			ttMananger.stop();
			ttMananger.clear();
		}
		
		/*$(buckets).each(function() {
			this.remove();
		});*/
		
		$('.stat').empty().remove(); //remove the buckets
		
		buckets = new Array();
		ttMananger = null;
	}
	
	
	/*
	 * GET TOOLTIP MANAGER
	*/
	var getTooltipManager = function() {
		return ttMananger;
	}
	
	
	return {
    	init: init,
		getTooltipManager: getTooltipManager
  	};
} ();
