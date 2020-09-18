# JSlider

I wanted to make a versatile and multiuse slider for my own scenarios. I especially didn't want the slider to be limited to just the kind that sits boringly at the top of websites, but a boilerplate for a customizable slider with features at your fingertips.

## Update - No More Jquery

So, with ~~some jQuery (which I will be happy to go more vague from there)~~ I present JSlider.

The CSS is completely up to you to use.

## Setup

To include JSlider in your next project is super easy. Download the jslider.js and include it in the footer of your website before the closing `</body>` tag.

Then, add:

```html
<script type="text/javascript">
var slider = new JSlider({
    slider: '#mySlider', // Id of div you want to make the slider be
    autostart: true
});
</script>
```

And that's it, for the css I recommend looking at the examples/ folder to see different styles, but the css is really up to you.
The slider uses actual scrolling to move to the slide, so overflow: hidden; on the slider div is the way to go.

A simple example would be:
```css

.slider {
    display: flex;
    overflow: hidden;
    
}

.slides {
    flex-shrink: 0;
}

.slides img {
    width: 100%;
    height: auto;
    vertical-align: bottom;
}

```

And the HTML

```html
<div class="slider" id="mySlider">
    <div class="slide">
        <img src="image1.jpg">
    </div>
    <div class="slide">
        <img src="image2.jpg">
    </div>
    <div class="slide">
        <img src="image3.jpg">
    </div>
</div>
```

Using flex defaults to `flex-direction: rows;` which means the slides will all be next to each other. `display: inline;` or `display: inline-block;` could be used to accomplish the same thing.

### Options

The idea of being versatile means there are different things you can do when you instantiate the JSlider to have some features out of the box. Here's a list.

* `slider`
    - Setter wanting a string of the id of the div to be the slider. Example: `slider: '#dmyiv'`
* `timer`
    - Setter wanting the amount of time between the slide changing to the next. *Uses Miliseconds* Defaults to ```5000```. Example `timer: 7000 // 7 seconds`
* `nav`
    - Setter wanting a string of the id of the div to be used for navigation. Example `nav: '#navi'` | *Defaults to false* | See below for full details.
* `autostart`
    - Setter wanting a boolean as to whether the slider should start automatically. Example: `autostart: true`. | *Defaults to false*
* `gestures`
    - Setter wanting a boolean as to whether the slider should have touch controls activated for mobile usage. This allows for the user to trigger slide movement by dragging the slide left to right to either move to the next slide or back to the previous slide. Example `gestures: true` | * Defaults to false*

    ### Methods
    The JSlider has some built in methods that are handy for changing the usecase of the slider and simple to implement.

    * `JSlider.nextSlide(event)`
        - Moves the slider to the next slide.
    * `JSlider.prevSlide(event)`
        - Moves the slider to the previous slide.
    * `JSlider.goToSlide(slide)`
        - Move the slider to specific slide by 'slide-num'
    * `JSlider.startslider()`
        - Start the slider
    * `JSlider.stopSlider()`
        - Stop the slider
    * `JSlider.playing()`
        - Returns whether the slider will advance automatically to the next slide or not

### Method Usage

If autostart is set to true, the slider will move automatically through all the slides infinitely by using the function of `nextSlide()`. You can actually use these same functions outside of the slider to control it wherever on your site.

#### Example
Inline JS
```html
    <div class="slider" id="myslider">
        <!-- Slides -->
    </div>

    <button onclick="slider.nextSlide(event)">Next Slide</button>
    <button onclick="slider.prevSlide(event)">Previous Slide</button>
```

Listener
```html
    <div class="slider" id="myslider">
        <!-- Slides -->
    </div>

    <button id="goToNextSlide">Next Slide</button>
    <button id="GOBACK">Previous Slide</button>

    <script type="text/javascript">
        var gonext = document.getElementById('goToNextSlide') // document.querySelector('#goToNextSlide');
        var goback = document.querySelector('#GOBACK');
        gonext.addEventListener('click', slider.nextSlide);
        goback.addEventListener('click', slider.prevSlide);
    </script>
```

The intention behind writing things this way means that there's lots of customizing you can add too or implement easily. Such a sa play / pause toggle.

```html
<button id="toggleSlider">Play</button>
<script type="text/javascript">
var slideToggle = document.querySelector('#toggleSlider'); // jQuery also works but this is to show how easy it is with pure JS

slideToggle.addEventListener('click', function(){
    if(slider.playing == true) {
        slider.stopSlider();
        slideToggle.innerText = 'Play';
    } else {
        slider.startSlider();
        slideToggle.innerText = 'Pause';
    }
});
</script>
```

## Updates
I am still actively working to make this slider better, and moving towards a pure JS version without needing jquery. That repo will be listed as soon as it's available.
Feel free to request features, bring up issues, or contribute if you wish.

## Contact
If you have questions reaching me here on Github works. Or you can find me on Discord Saysora#3418
