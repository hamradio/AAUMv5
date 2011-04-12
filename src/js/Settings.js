
document.onreadystatechange = function() {    
	if (document.readyState != 'complete') {
		return;
	}
	
	//username.value = System.Gadget.Settings.readString('username');
	password.value = System.Gadget.Settings.readString('password');
	
	var accountOptions = System.Gadget.Settings.readString('accountOptions'); //an array of account options e.g. ADSL, WiMAX, mobileBroadband, AdamTalk etc...
	var accountType = System.Gadget.Settings.readString('accountType');
	
	var ADSLInfo = System.Gadget.Settings.read('ADSLInfo');
	
	var IPv4Address = System.Gadget.Settings.readString('IPv4Address');	
	
	
	//Check vars and parse if needed
	if (accountOptions === '') {
		accountOptions = new Array('Auto');
	} else {
		accountOptions = JSON.parse(accountOptions);
	}
	
	if(accountType === '') {
		accountType = 'Auto'
	}
	
	//Populate the account select box
	$('#accountSelect').empty();
	
	$.each(accountOptions, function(key, value) {   
		 $('#accountSelect').append('<option value="' + value + '">' + value + '</option>'); 
	});
	
	//$("#accountSelect option[selected]").removeAttr("selected");
	$("#accountSelect option[value='"+accountType+"']").attr("selected", "selected"); 
	
	
	
	//$('#version').html('Version: ' + System.Gadget.version.replace(/\.\d+$/, ''));
	$('#version').html('Version: ' + System.Gadget.version);
	$('#authors').html('Authors: ' + System.Gadget.Settings.readString('authors'));
	
	
	if(IPv4Address === '') {
		$('#ipaddress').html('IP Address: n/a');
	} else {
		$('#ipaddress').html('IP Address: ' + IPv4Address);
	}
	
	
	if(ADSLInfo !== '') {
		ADSLInfo = JSON.parse(ADSLInfo);
		$('#sync').html('Sync (Up|Down): ' + ADSLInfo.SyncUP + ' | ' + ADSLInfo.SyncDown);
		$('#snr').html('SNR: ' + ADSLInfo.SNRUp + ' | ' + ADSLInfo.SNRDown);
		$('#attenuation').html('Attenuation: ' + ADSLInfo.AttenuationUp + ' | ' + ADSLInfo.AttenuationDown);
	}
	
	
	// Add click handler for the copy to clipboard button
	$('#copyinfo').click(function(){
								  	var infoString = $('#ipaddress').text() + '\n' + $('#sync').text() + '\n' + $('#snr').text() + '\n' + $('#attenuation').text();
								  	window.clipboardData.setData('Text', infoString);
								  });
};

System.Gadget.onSettingsClosing = function(event) {
	if (event.closeAction != event.Action.commit) {
		return;
	}
	
	System.Gadget.Settings.writeString('accountType', $("#accountSelect option:selected").val());
	
	//System.Gadget.Settings.writeString('username', $.trim(username.value));
	System.Gadget.Settings.writeString('password', password.value);
	
	event.cancel = false;
};
