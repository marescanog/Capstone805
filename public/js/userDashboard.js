// $('.autoplay').slick({
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     dots: true,
//     autoplaySpeed: 2000,
//   });

  $(document).ready(function() {
  // Count the number of carousel items
  var itemCount = $('.autoplay.slider').find('.slick-item').length;

  // Carousel settings
  var settings = {
    dots: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: itemCount > 1, // Enable centerMode only if more than one item
    infinite: false, // Disable infinite looping for a single item
    variableWidth: false
  };

  // Adjust settings based on the itemCount
  if (itemCount === 1) {
    // Set the padding to half the width of the container minus half the width of your item
    // This is an example, you'll need to adjust the value to fit your item size
    settings.centerPadding = 'calc(50% - 150px)'; // Adjust 150px to the width of your item
  } else if (itemCount > 1 && itemCount <= 3) {
    settings.slidesToShow = itemCount;
    settings.centerPadding = '0px';
  } else if (itemCount > 3) {
    settings.slidesToShow = 3;
  }

  // Initialize the carousel with the settings
  $('.autoplay.slider').slick(settings);
  });