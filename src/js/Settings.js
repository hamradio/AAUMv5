
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
		$('#ipaddress').html('n/a');
	} else {
		$('#ipaddress').html(IPv4Address);
	}
	
	
	if(ADSLInfo !== '') {
		ADSLInfo = JSON.parse(ADSLInfo);
		var imgDown = '<span class="arrow_down"></span>';
		var imgUp = '<span class="arrow_up"></span>';
		
		$('#sync_down').html(ADSLInfo.SyncDown + imgDown);
		$('#sync_up').html(ADSLInfo.SyncUP + imgUp);
		$('#snr_down').html(ADSLInfo.SNRDown + imgDown);
		$('#snr_up').html(ADSLInfo.SNRUp + imgUp);
		$('#attenuation_down').html(ADSLInfo.AttenuationDown + imgDown);
		$('#attenuation_up').html(ADSLInfo.AttenuationUp + imgUp);
	} else {
		$('#sync_down').html('n/a');
		$('#sync_up').empty();
		$('#snr_down').html('n/a');
		$('#snr_up').empty();
		$('#attenuation_down').html('n/a');
		$('#attenuation_up').empty();
	}
	
	
	// Add click handler for the copy to clipboard button
	$('#copyinfo').click(function(){
								  	var infoString = 'Ip Address: '+$('#ipaddress').text()+'\r\n'+
													 'Sync (down|up): '+$('#sync_down').text()+' | '+$('#sync_up').text()+'\r\n'+
													 'SNR: '+$('#snr_down').text()+' | '+$('#snr_up').text()+'\r\n'+
													 'Attenuation: '+$('#attenuation_down').text()+' | '+$('#attenuation_up').text();
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
