


function getColumnColour(title) {
		
	switch (title) {
		  case 'Total':
		  case 'Download':
		  case 'Peak Usage':
		  case 'Peak Download':
				return '#40B3D9'; //blue
				break;
		  case 'Upload':
				return '#B3D941'; //green
				break;
		  case 'Off-Peak Usage':
		  case 'Off-Peak Download':
				return '#FFAF36'; //orange
				break;
		  case 'Newsgroups':
		  case 'Days':
		  default:
			  return '#999999'; //grey
	  }
	
}

function parseUsage(val, decimalPlaces) {
    if(val > 1000000000) {
		return (val/1000000000).toFixed(decimalPlaces) + "GB";
	} else if(val <= 0) {
		return 0;
	} else {
		return (val/1000000).toFixed(decimalPlaces) + "MB";
	}
}

function numKeys(obj) {
    var count = 0;
    for(var prop in obj) {
        count++;
    }
    return count;
}

$(function () {
			
    flyoutBack.src = "img/flyout-back.png";
	
	var oGadgetDocument = System.Gadget.document.parentWindow;
	
	if(System.Gadget.Flyout.show == true) {
		return;
	}
	
	var usageData = oGadgetDocument.AAUM.getUsageData();
	
	var columnsPerDay = numKeys(usageData.usageGraphData);
	var numberOfDays = 7 + 2; //why 2 who knows???
	
	var graphData = Array();
	
	$.each(usageData.usageGraphData, function(key, val) {
        val.color = getColumnColour(key);
		val.bars = { show: true, align:'center', barWidth: ((24 * 60 * 60 * 1000) * 0.8) / columnsPerDay };
		graphData.push(val);
    });
	
	var xAxisTicks = Array();
	var i = numberOfDays;
	
	while(i > 0) {
		xAxisTicks.push(Date.today().addDays(-i).getTime());
		i--;
	}	
	
	$.plot($("#graph_placeholder"), graphData,
		  { 
		   xaxis: { 
			  ticks: xAxisTicks,
			  color: "#bbbbbb",
			  min: Date.today().getTime() - (((24 * 60 * 60 * 1000) * 0.8) * numberOfDays), //today minus certain number of days
			  tickFormatter: function (val, axis) {
				                                    var d = new Date();
												    d.setTime(val)
				  						            return d.getDate();
		      									  }
		  },
		  yaxis: {
			  color: "#bbbbbb",
			  tickFormatter: function (val, axis) { 
													return parseUsage(val, 0);
											      }
		  },
		  legend: {
			  show: false
	      },
		  grid: { 
		      hoverable: true ,
			  borderColor: "#bbbbbb"
		  },
		  multiplebars: true
		}
	);
	
	var previousPoint = null;
	$("#graph_placeholder").bind("plothover", function (event, pos, item) {									
		if (item) {
			if (previousPoint != item) {
				previousPoint = item;
				
				var x = item.datapoint[0];
				var y = item.datapoint[1];
				
				var usage = parseUsage(y, 1);
				
				$("#column_info").stop(true).css('filter', 'inherit').css('opacity', 'inherit');
				$("#column_info").html('<span style="color:'+getColumnColour(item.series.label)+'">'+item.series.label+"</span> "+usage);
				$("#column_info").fadeIn();
			}
		}
		else {
			$("#column_info").fadeOut(function(){ 
											   $("#column_info").empty();
											   });
			previousPoint = null;
		}
    });
	
});
