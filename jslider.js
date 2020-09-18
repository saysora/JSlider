function JSlider(options) {
  var _ = this;
  // Setup attributes to take an options object
  _.slider = document.querySelector(options.slider);
  _.slideHold = document.querySelector(options.slideHold);
  _.slides = _.slideHold.querySelectorAll(".slide");
  _.controls = options.controls
    ? document.querySelector(options.controls)
    : false;
  _.timer = options.timer ? options.timer : 5000;
  _.timing;
  _.nav = options.nav ? document.querySelector(options.nav) : false;
  _.autoStart = options.autoStart ? true : false;
  _.gestures = options.gestures ? options.gestures : false;
  _.isNav = _.nav ? true : false;
  _.playing = _.autoStart ? true : false;

  // var slider = document.querySelector(_.slider);
  if (_.slideHold) {
    _.slideHold.style.position = "relative";
  }
  // Set our First Slide
  _.active = _.slides[0];
  _.active.classList.add("active");

  // Use Functions

  // Go to Next Slide
  _.nextSlide = function (e) {
    // Check if there is another slide, if not, start at the beginning.
    if (e) {
      if (!e.target.classList.contains("used")) {
        e.target.classList.add("used");
        setTimeout(function () {
          e.target.classList.remove("used");
        }, 750);
      } else {
        return;
      }
    }

    if (_.active.nextElementSibling) {
      //Remove the active class since we use it to help manage which slide is active.
      _.active.classList.remove("active");
      // Make the next slide from the current active be the one fitting the active variable.
      _.active = _.active.nextElementSibling;

      //Apply that active class
      _.active.classList.add("active");
      // Animate the scroll for the slider to reach that slide particularly

      _.active.scrollIntoView({ behavior: "smooth", inline: "nearest" });

      // If the nav bubbles option is turned on, make this light up to represent the active slide.
    } else {
      // Same format as above just on reset
      _.active.classList.remove("active");
      _.active = _.slides[0];
      _.active.classList.add("active");
      _.active.scrollIntoView({ behavior: "smooth", inline: "nearest" });
    }

    if (_.playing == true) {
      _.stopSlider();
      _.startSlider();
    }

    if (_.isNav) {
      document.querySelector(".bubble.active").classList.remove("active");
      _.nav
        .querySelector('.bubble[data-go="' + _.active.dataset.slide + '"]')
        .classList.add("active");
    }
  };

  // Same as next slide, just in reverse.
  _.prevSlide = function (e) {
    if (e) {
      if (!e.target.classList.contains("used")) {
        e.target.classList.add("used");
        setTimeout(function () {
          e.target.classList.remove("used");
        }, 750);
      } else {
        return;
      }
    }

    if (_.active.previousElementSibling) {
      _.active.classList.remove("active");
      _.active = _.active.previousElementSibling;
      _.active.classList.add("active");

      _.active.scrollIntoView({ behavior: "smooth", inline: "end" });
    } else {
      _.active.classList.remove("active");
      _.active = _.slides[_.slides.length - 1];
      _.active.classList.add("active");
      _.active.scrollIntoView({ behavior: "smooth", inline: "end" });
    }

    if (_.playing == true) {
      _.stopSlider();
      _.startSlider();
    }

    if (_.isNav) {
      document.querySelector(".bubble.active").classList.remove("active");
      _.nav
        .querySelector('.bubble[data-go="' + _.active.dataset.slide + '"]')
        .classList.add("active");
    }
  };

  // Special function only used with the Bubbles. Technically could be used outside too if you're smart.
  _.goToSlide = function (slide) {
    // Do the same active passing, removing it from the current slide.
    _.active.classList.remove("active");
    // Every bubble has a data-go statement, which points to it's related slide. The slide variable is data-slide. If they match, set that slide to be our active slide.
    _.active = _.slideHold.querySelector('.slide[data-slide="' + slide + '"]');
    // Give that slide the active class
    _.active.classList.add("active");
    // Animate it.
    _.active.scrollIntoView({ behavior: "smooth" });

    // Same Bubble active class passing, no if statement because this function should only work if that is on anyways.
    document.querySelector(".bubble.active").classList.remove("active");
    _.nav
      .querySelector('.bubble[data-go="' + _.active.dataset.slide + '"]')
      .classList.add("active");

    if (_.playing == true) {
      _.stopSlider();
      _.startSlider();
    }
  };

  _.startSlider = function () {
    // Tell our slider it is playing, so we can check it for interaction
    _.playing = true;
    //Start the slider interval using our provided time in the construction
    _.timing = setInterval(_.nextSlide, _.timer);
  };
  _.stopSlider = function () {
    // Tell our slider it's not running
    _.playing = false;
    // Stop the timer
    clearInterval(_.timing);
  };

  // Makes our bubbles for navigation
  _.makeNav = function () {
    // Get the slides and create a control div that we'll populate.
    var slides = _.slides;
    var controlNav = document.createElement("div");
    controlNav.classList.add("control-nav");

    _.slides.forEach((slides, index) => {
      // For each slide we need a bubble, so we make one and give it the proper data-go to reference the slides data-slide
      controlNav.innerHTML +=
        '<div class="bubble" data-go="slide-' + index + '"></div>';
    });

    //Actually adds the bubbles to that div and puts it in our slider controls section
    _.nav.append(controlNav);

    _.nav.querySelectorAll(".bubble").forEach((bubble, index) => {
      // Sets the first bubble to be active since this only fires on creation.
      if (index == 0) {
        bubble.classList.add("active");
      }
      // This binds the go to slide function to each bubble and users that bubbbles data-go to reach the slide with the corresponding data-slide value.
      bubble.addEventListener("click", function () {
        _.goToSlide(bubble.dataset.go);
      });
    });
  };

  // This adds the data-slide value to each child div that is in the provided slides element.
  _.setupSlides = function () {
    _.slides.forEach((slide, index) => {
      slide.setAttribute("data-slide", "slide-" + index);
    });
  };

  _.setGestures = function () {
    var touchStart;
    var dist;
    var x1;
    var scrollPos = 0;
    var ogPos = 0;

    _.slideHold.addEventListener("touchstart", function (e) {
      ogPos = _.slideHold.scrollLeft;
      var firstTouch = e.changedTouches[0];
      touchStart = firstTouch.clientX;
      scrollPos = _.slideHold.scrollLeft;
    });

    _.slideHold.addEventListener("touchmove", function (e) {
      var firstTouch = e.changedTouches[0];
      x1 = scrollPos + (touchStart - firstTouch.clientX);
      dist = touchStart - firstTouch.clientX;
      _.slideHold.scrollLeft = x1;
    });

    _.slideHold.addEventListener("touchend", function (e) {
      if (dist > 150) {
        _.nextSlide(e);

        _.slideHold.scroll({
          left: _.active.offsetLeft,
          behavior: "smooth"
        });
      } else if (dist < -150) {
        _.prevSlide(e);

        _.slideHold.scroll({
          left: _.active.offsetLeft,
          behavior: "smooth"
        });
      } else {
        _.slideHold.scrollLeft = ogPos;
      }
    });
  };

  // Stole this handy script
  var doit;
  function resizedw() {
    _.active.scrollIntoView({ behavior: "smooth", inline: "end" });
  }
  window.onresize = function () {
    clearTimeout(doit);
    doit = setTimeout(function () {
      resizedw();
    }, 100);
  };

  //Setup the controls when instantiated.
  if (_.controls) {
    _.setupControls();
  }
  //Check if nav is true then make the nav and connect the slides to the bubble nav.
  if (_.isNav) {
    _.makeNav();
    _.setupSlides();
  }
  // Check if we want the slider to be started automatically.
  if (options.autoStart == true) {
    _.startSlider();
  }
  if (options.gestures == true) {
    _.setGestures();
  }
}
