
$(function () {
	
	var oGadgetDocument = System.Gadget.document.parentWindow;
	
	if(System.Gadget.Flyout.show == true) {
		return;
	}
	
	var usageData = oGadgetDocument.AAUM.getUsageData();
	
	var columnsPerDay = 1;
	
	$.plot($("#graph_placeholder"), [
        {
            data: usageData.usageGraphData,
            bars: { show: true, barWidth: ((24 * 60 * 60 * 1000) * 0.8) / columnsPerDay }
        }
		],
		{ 
		   xaxis: { 
			  mode: "time",  
			  minTickSize: [1, "day"]
		  },
		  yaxis: {
			  tickFormatter: function (val, axis) { 
			  									if(val > 1000000000) {
													return (val/1000000000).toFixed() + "GB";
												} else if(val <= 0) {
													return 0;
												} else {
													return (val/1000000).toFixed() + "MB";
												}
											}
		  }
		}
	);
});
