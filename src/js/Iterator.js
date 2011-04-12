/*************************
*        ITERATOR
*************************/
// see http://stackoverflow.com/questions/2644966/javascript-iterator-class

function Iterator(o, keysOnly) {
	
    if(!(this instanceof arguments.callee)) {
    	return new arguments.callee(o, keysOnly);
	}
	  
    var index = 0;
	var keys = [];
	
    if(!o || typeof o != "object") return;
	
    if('splice' in o && 'join' in o) {
        while(keys.length < o.length) keys.push(keys.length);
    } else {
        for(p in o) if(o.hasOwnProperty(p)) keys.push(p);
    }
	
	//Returns first item and resets the index to the start
	this.first = function first() {
		this.setIndex(0);
		var key = keys[index++];
		return keysOnly ? key : o[key];
	};
	
    this.next = function next() {
        if(index < keys.length) {
            var key = keys[index++];
            return keysOnly ? key : o[key];
        } else {
			//return to beginning
			return this.first();
		}
    };
	
    this.hasNext = function hasNext() {
        return index < keys.length;
    };
	
	this.setIndex = function setIndex(ni) {
		index = ni;
	};
	
	this.getIndex = function getIndex() {
		return index;
	};
}
