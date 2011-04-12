/*************************
 *    TOOLTIP MANAGER
*************************/
// Pass in array of tooltip objects [{title:"Download Data", desc: "123 of 123 MB", colour: "Blue"}, {}, {}, ...]

function TooltipManager(tt) {
	
	if(!(this instanceof TooltipManager)) {
    	throw { name: "Invalid call" };
	}
	
	//Displays the next tooltip in the array
	this.next = function() {
		var nextTT = this.iterator.next();
		
		var oInstance=this;
		
		//fade out existing tooltip first, then fade in new tooltip
		$('#info').fadeOut('slow', function() {
			oInstance.showInfo(nextTT);
			$(this).fadeIn('slow');
		});
	}
	
	//Updates the info divs
	this.showInfo = function(tooltip) {
		
		$('#info').html('').removeClass().addClass(tooltip.colour).html(
			'<h1>' + tooltip.title + '</h1><p>' + tooltip.desc + '</p>'
		);
		
	}
	
	//Forces the passed tooltip to be displayed, updates the iterator
	this.forceChange = function(nextTT) {
		//if tooltip is in the tooltip array then update iterator
		
		var ttIndex = -1;
		
		//find the specified tooltip
		$(this.tooltips).each(function(index, o) {
									if(o.title == nextTT.title) {
										ttIndex = index;
									}
								  });
		
		var itIndex = this.iterator.getIndex();
		
		if(ttIndex+1 == itIndex) {
			//restart the timer of the selected tooltip
			this.startTimer();
		} else if(ttIndex >= 0) {
			this.iterator.setIndex(ttIndex);
			this.showInfo(this.iterator.next());
			this.startTimer();
		}
	}
	
	//Resets the tooltip object
	this.updateTooltips = function(tt) {
		this.tooltips = tt;
		this.iterator = new Iterator(this.tooltips);
	}
	
	//Starts the TooltipManager and shows the first tooltip
	this.start = function() {
		
		$('#info').hide();
		this.showInfo(this.iterator.first());
		$('#info').fadeIn('slow');
		
		this.startTimer();
	}
	
	this.startTimer = function() {
		var oInstance=this;
		
		window.clearInterval(this.tooltipIntervalId);
		this.tooltipIntervalId = window.setInterval(function(){oInstance.next();}, this.tooltipIntervalPeriod * 1000);
	}
	
	//Stops the TooltipManager from showing any more tooltips and hides the current tooltip
	this.stop = function() {
		if(this.tooltipIntervalId != null) {
			window.clearInterval(this.tooltipIntervalId);
			this.tooltipIntervalId = null;
			$('#info').hide();
		}
	}
	
	//Stops the TooltipManager and resets the iterator and tooltips array
	this.clear = function() {
		this.stop();
		this.tooltips = null;
		this.iterator = null;
		$('#info').html('').removeClass();
	}
	
	this.tooltipIntervalPeriod = 10; // seconds between status rotations.
	this.tooltipIntervalId = null;
	this.rotateTime = 10000; //milliseconds between tooltip rotations
	this.tooltips = tt;
	this.iterator = new Iterator(this.tooltips, false);
}
