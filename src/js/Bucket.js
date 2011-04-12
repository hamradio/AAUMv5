/*************************
*        BUCKET
*************************/
//<div class="stat fill_orange" id="newsgroups">
//	<span class="bar"></span><img src="img/bar_overlay.png" /><span class="summary"></span>
//</div>

function Bucket(q, u, db, t) {
	
	if(!(this instanceof Bucket)) {
    	throw { name: "Invalid call" };
	}
	
	//Creates the visual appearance of the bucket
	this.paint = function() {
		var bucket_count = $('.stat').length;
		$('#error').before('<div class="stat fill_' + this.colour + '" id="' + this.id + '"><span class="bar"></span><img src="img/bar_overlay.png" /><span class="summary"></span></div>');
		var newPos = parseInt($('#'+this.id).css('top'))+(bucket_count*this.bucketOffset) + "px";
		$('#'+this.id).css('top', newPos);
		
		var oInstance=this;

		$('#'+this.id).hover(function() {
										AAUM.getTooltipManager().forceChange(oInstance.getTooltip());
										});
		
		this.repaint();
	}
	
	//Updates the visual appearance of the bucket
	this.repaint = function() {
		$('#' + this.id + ' .bar').width( Math.ceil((this.usage / this.quota) * 95) );
		$('#' + this.id + ' .summary').html( this.getSideText() );
	}
	
	//Removes this object from DOM
	this.remove = function() {
		$(this.id).remove();
		//delete this;
	}
	
	//Returns usage as a percentage
	this.getPercentage = function() {
		return Math.round( (this.usage / this.quota) * 100); 
	}
	
	//Returns usage as a percentage
	this.getSideText = function() {
		return this.getPercentage() + "%"; 
	}
	
	//Returns tooltip object {title:"Download Data", desc: "123 of 123 MB", colour: "Blue"}
	this.getTooltip = function() {
		
		var rTitle = (this.title.indexOf("Usage") == -1) ? this.title + " Usage" : this.title; //Append "Usage" to title if it doesn't already contain it e.g. Download Usage or Newsgroups Usage
		
		var descText = '';
		//if it is a terabyte or larger plan then reformat the desc text
		if(this.quota >= 1000000) {
			var descText = this.addCommas( Math.round(this.usage / 1000) ) + " of " + this.addCommas( Math.round(this.quota / 1000) ) + " GB";
		} else {
			var descText = this.addCommas(this.usage) + " of " + this.addCommas(this.quota) + " MB";
		}
		
		return { title: rTitle, desc: descText, colour: this.colour };
	}
	
	this.addCommas = function(num) {
		num += '';
		var r = /(\d+)(\d{3})/;
		while (r.test(num)) {
			num = num.replace(r, '$1,$2');
		}
		return num;
	}
	
	this.getColour = function() {
		
		switch (this.title) {
			  case 'Total':
			  case 'Download':
			  case 'Peak Usage':
			  case 'Peak Download':
			  		return 'blue';
					break;
			  case 'Newsgroups':
			  		return 'grey';
					break;
			  case 'Upload':
			  		return 'green';
					break;
			  case 'Off-Peak Usage':
			  case 'Off-Peak Download':
			  		return 'orange';
					break;
			  case 'Days':
			  default:
				  return 'white';
		  }
		
	}
	
	this.bucketOffset = 14; //offset position distance between buckets in px
	this.quota = Math.round(q); 
	this.usage = Math.round(u);
	this.datablocks = Math.round(db);
	
	this.quota = this.quota + this.datablocks;
	
	//this.startDateTime = sdt;,
	this.title = t; //e.g. Newsgroups
	this.id = this.title.toLowerCase().replace(/[^a-z0-9]/g, '-'); //only allowing alphanumeric
	this.colour = this.getColour();
	
	this.paint();
}
