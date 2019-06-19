function JSlider(options) {
		var _ = this;
		// Setup attributes to take an options object
		_.slider = $(options.slider);
		_.slideHold = $(options.slideHold);
		_.slides = _.slideHold.children();
		_.controls = options.controls ? $(options.controls) : false ;
		_.timer = options.timer ? options.timer : 5000;
		_.timing;
		_.nav = options.nav ? $(options.nav) : false;
		_.autoStart = options.autoStart ? true : false;
		_.gestures = options.gestures ? options.gestures : false;
		_.isNav = _.nav ? true : false;
		_.playing = _.autoStart ? true : false;

		var slider = $(_.slider);
		if(_.slideHold) {
			_.slideHold.css('position', 'relative');
		}
		// Set our First Slide
		_.active = _.slides.first();
		_.active.addClass('active');
		
		// Use Functions

		// Go to Next Slide
		_.nextSlide = function(e) {

			// Check if there is another slide, if not, start at the beginning.
			if(e) {
				if(!$(e.target).hasClass('used')) {
					$(e.target).addClass('used');
						setTimeout(function(){
							$(e.target).removeClass('used');
						}, 750);
				} else {
					return;
				}
			}

				if(_.active.next().length) {
					
					//Remove the active class since we use it to help manage which slide is active.
					_.active.removeClass('active');
					// Make the next slide from the current active be the one fitting the active variable.
					_.active = _.active.next();
					//Apply that active class
					_.active.addClass('active');
					// Animate the scroll for the slider to reach that slide particularly
					_.slideHold.animate({
						scrollLeft: '+=' + _.active.position().left
					}, 'slow');

					

					// If the nav bubbles option is turned on, make this light up to represent the active slide.
					
				} else {
					// Same format as above just on reset
					_.active.removeClass('active');
					_.active = _.slides.first();
					_.active.addClass('active');
					_.slideHold.animate({
						scrollLeft: '+=' + _.active.position().left
					}, 'slow');
					
					
				}

				if(_.playing == true) {
					_.stopSlider();
					_.startSlider();
				}

				if(_.isNav) {
					_.nav.find('.bubble').removeClass('active');
					_.nav.find('.bubble').filter('[data-go="' + $(_.active).data('slide') + '"]').addClass('active');
				}

				
		}

		// Same as next slide, just in reverse.
		_.prevSlide = function(e) {
			
			if(e) {
				if(!$(e.target).hasClass('used')) {
					$(e.target).addClass('used');
						setTimeout(function(){
							$(e.target).removeClass('used');
						}, 750);
				} else {
					return;
				}
			}
			
				if(_.active.prev().length) {
					_.active.removeClass('active');
					_.active = _.active.prev();
					_.active.addClass('active');
					_.slideHold.animate({
						scrollLeft: '+=' + _.active.position().left
					}, 'slow');

				} else {
					_.slideHold.animate({
						scrollLeft: (_.active.position().left + 50)
					},50).animate({
						scrollLeft: _.active.position().left
					},50)
				}

				if(_.playing == true) {
					_.stopSlider();
					_.startSlider();
				}

				if(_.isNav) {
					_.nav.find('.bubble').removeClass('active');
					_.nav.find('.bubble').filter('[data-go="' + $(_.active).data('slide') + '"]').addClass('active');
				}
		}

		// Special function only used with the Bubbles. Technically could be used outside too if you're smart.
		_.goToSlide = function(slide) {
			// Do the same active passing, removing it from the current slide.
			_.active.removeClass('active');
			// Every bubble has a data-go statement, which points to it's related slide. The slide variable is data-slide. If they match, set that slide to be our active slide.
			_.active = _.slideHold.find('.slide').filter('[data-slide="' + slide +'"]');
			// Give that slide the active class
			_.active.addClass('active');
			// Animate it.
			_.slideHold.animate({
					scrollLeft: '+=' + _.active.position().left
				}, 'slow');

			// Same Bubble active class passing, no if statement because this function should only work if that is on anyways.
			_.nav.find('.bubble').removeClass('active');
			_.nav.find('.bubble').filter('[data-go="' + $(_.active).data('slide') + '"]').addClass('active');
			if(_.playing == true) {
				_.stopSlider();
				_.startSlider();
			}
		}

		_.startSlider = function() {
			// Tell our slider it is playing, so we can check it for interaction
			_.playing = true;
			//Start the slider interval using our provided time in the construction
			_.timing = setInterval(_.nextSlide, _.timer);
		}
		_.stopSlider = function() {
			// Tell our slider it's not running 
			_.playing = false;
			// Stop the timer
			clearInterval(_.timing);
		}
		
		// Auto creates the controls event binding based upon if the proper ids are in the 'control' element we pass in the constructor.
		_.setupControls = function() {
			var childControls = _.controls.children();

			// Map the event for starting the slider
			childControls.filter('#start').on('click', function(){
			  _.startSlider();
			});
			// Map the event for stopping the slider
			childControls.filter('#stop').on('click', function(){
				_.stopSlider();
			});
			// Map the event for clicking next for the slider
			childControls.filter('#next').on('click', function(){
				// If we want the slider to be autoplaying, we want the user to reset the timer if they take control. So we check if it's playing. But if the slider isn't supposed to be playing, then we just move to the next slide.
				if(_.playing == true) {
					_.stopSlider();
					_.nextSlide(e);
					_.startSlider();
				} else {
					_.nextSlide(e);
				}
			
			});
			// Map the event for clicking previous for the slider
			childControls.filter('#prev').on('click', function(){
				// See above func
				if(_.playing == true) {
					_.stopSlider();
					_.prevSlide(e);
					_.startSlider();
				} else {
					_.prevSlide(e);
				}
			});
		}
		
		// Makes our bubbles for navigation
		_.makeNav = function() {
			// Get the slides and create a control div that we'll populate.
			var slides = _.slides;
			var controlNav = $('<div class="control-nav"></div>');
			slides.each(function(index) {
				// For each slide we need a bubble, so we make one and give it the proper data-go to reference the slides data-slide
				controlNav.append('<div class="bubble" data-go="slide-' + index + '"></div>');
			});

			//Actually adds the bubbles to that div and puts it in our slider controls section
			_.nav.append(controlNav);

			_.nav.find('.bubble').each(function(index){
				// Sets the first bubble to be active since this only fires on creation.
				if(index == 0) {
					$(this).addClass('active');
				}
				// This binds the go to slide function to each bubble and users that bubbbles data-go to reach the slide with the corresponding data-slide value.
				$(this).on('click', function(){
					_.goToSlide($(this).data('go'));
				});
			});
		}

		// This adds the data-slide value to each child div that is in the provided slides element.
		_.setupSlides = function() {
			$(_.slides).each(function(index) {
				$(this).attr('data-slide', 'slide-' + index);
			});
		}

		_.setGestures = function() {
			var touchStart;
			var dist;
			var x1;
			var scrollPos = 0;
			
			_.slideHold.on('touchstart', function(e){
				var firstTouch = e.changedTouches[0];
				touchStart = firstTouch.clientX;
				scrollPos = _.slideHold.scrollLeft();
				
			});

			_.slideHold.on('touchmove', function(e){
				var firstTouch = e.changedTouches[0];
				x1 = scrollPos + (touchStart - firstTouch.clientX);
				dist = touchStart - firstTouch.clientX;
				_.slideHold.scrollLeft(x1);
				
			});

			_.slideHold.on('touchend', function(e){
				if(dist > 150) {
					_.nextSlide(e);
				} else if (dist < -150) {
					_.prevSlide(e);
				} else {
					_.slideHold.animate({
						scrollLeft: '+=' + _.active.position().left
						}, 'fast');
				}
			});
				
		}

		// Stole this handy script
		var doit;
		function resizedw(){
		  _.slideHold.animate({
		    scrollLeft: '+=' + _.active.position().left
		    }, 'fast');
		}
		window.onresize = function() {
		    clearTimeout(doit);
		    doit = setTimeout(function() {
		        resizedw();
		    }, 100);
		};

		//Setup the controls when instantiated.
		if(_.controls) {
			_.setupControls();
		}
		//Check if nav is true then make the nav and connect the slides to the bubble nav.
		if(_.isNav) {
			_.makeNav();
			_.setupSlides();
		}
		// Check if we want the slider to be started automatically.
		if(options.autoStart == true) {
			_.startSlider();
		}
		if(options.gestures == true) {
			_.setGestures();
		}
		
	}
