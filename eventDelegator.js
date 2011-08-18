
	/**
	 * EventDelegator
	 * 
	 * Event delegation made easy!!
	 * 
	 * It's a bit of a syntax diva, but once you get used to it, it's quite nice. 
	 * 
	 * Choose your delegator DOM object (what all events bubble up to), 
	 * then choose the events to watch for, 
	 * the child objects to watch for them on, and the functions to fire when 
	 * those child objects receive those events. 
	 * 
	 * There is an added bonus!! *****ALL FUNCTIONS ARE BOUND TO THIS OBJECT*****
	 * This means you can use the 'this' keyword in one event listener, and then
	 * access the values that you set through another listener. This allows you to 
	 * change properties of what would have been individual objects into arrays
	 * of those properties for the delegated setting. 
	 * 
	 * ***NOTE: Shorthand does not work with the binding. Can't figure out why. To
	 * use the 'this' keyword, you must use the {func: functionName} syntax, or add
	 * .bind(this) at the end of your function (anonymous or functionName). 
	 * 
	 * @param rootListener -the DOM object that is delegating events to its children
	 * @param events -an associative array of events where each key is an event name, 
	 * 		and each value is an associative array whose keys are DOM names, and whose
	 * 		values are the options and the function to run. Like so:
	 * 		{
	 * 			eventName: {
	 * 				DOMname: {
	 * 					func: yourFunction //required
	 * 					type: 'id' //optional. ['id'|'class']. defaults to 'class'
	 * 					stop: true //optional bool. defaults to false
	 * 				},
	 * 				DOMname: yourFunction //this is the shorthand if you want only the default options. if you want the binding, add .bind(this)
	 * 			},
	 * 			eventName:{...}
	 * 		}
	 * 
	 * 		So in the example below, 'slider' is the delegator DOM object that is
	 * 		watching for events. It watches for 'click', 'mouseover', 'mouseout',
	 * 		and 'keydown' events. When a 'click' fires it checks to see if the object
	 * 		clicked was of the class 'designIMG' or had the id 'finishCheckbox'. 
	 * 		If it was of class 'designIMG', then it calls 'loadPhotoDetails' and 
	 *		then calls e.stop() to stop event bubbling after the function returns. 
	 *		If it was id 'finishCheckbox' then it runs the anonymous function written 
	 * 		inline, and allows bubbling to continue. etc, etc. 
	 * 
	 * 		ed = new EventDelegator('slider', {
					click: {
						designIMG: {
							stop:true,
							func: loadPhotoDetails 
						},
						finishCheckbox: {
							type:'id',
							func: function(e){
								...
							}.bind(this)
						}
					},
					mouseover: {
						linkedPhoto_111: function(e){...}.bind(this)
					},
					mouseout: {
						designIMG: {type:'class', func: mouseoutTest, stop:false}
					},
					keydown:{
		
					}
			})
	 * 
	 * 
	 * @author kenstclair, contributed by 1stdibs.com
     * @license MIT license
     * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	 */
	var EventDelegator= Class.create({
		initialize: function(rootListener, events, options) {
			this.events = events;
			this.rootListener = $(rootListener);
			
			this.registerListeners();
		},
		registerListeners: function() {
//			alert(this);
			$H(this.events).each(function(eventpair){
				//bind all functions to this object
				$H(eventpair.value).each(function(dompair){
//					alert(this);
					if(dompair.value['func']) 
						dompair.value['func'] = dompair.value['func'].bind(this);
					else //allows for shorthand ** NOT WORKING??!! -krs -FIXME
						dompair['value'] = dompair['value'].bind(this);
				}.bind(this));
				
				this.rootListener.observe(eventpair.key, function(e){//observe this event
					el = e.element(); //the element the event happened to
					
					//now check which registered listener matches the obj the event happened to
					$H(eventpair.value).each(function(dompair){//for each registered object for this event
						if(dompair.value['type'] && dompair.value['type'] == 'id'){//check this obj based on id
							if(el.id == dompair.key){//this registered obj matches the clicked obj
								dompair.value['func'](e);//run its function
								if(dompair.value['stop']){//check if we should stop the bubbling
									e.stop();
								}
							}
						}else{//no need to check, just make this the default if(dompair.value['type'] == 'class'){//check this obj based on class
							if(el.hasClassName(dompair.key)){//this registered obj matches the clicked obj
								if(dompair.value['func'])
									dompair.value['func'](e);//run its function
								else
									dompair['value'](e);//if its shorthand
								if(dompair.value['stop']){//check if we should stop the bubbling
									e.stop();
								}
							}
						}
					});
				})//end rootListener.observe
			}.bind(this));
		}
	});