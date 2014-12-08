function getNav() {
  var mainNav = $('ul.main-navigation, ul[role=main-navigation]').before('<fieldset class="mobile-nav">')
  var mobileNav = $('fieldset.mobile-nav').append('<select>');
  mobileNav.find('select').append('<option value="">Navigate&hellip;</option>');
  var addOption = function(i, option) {
    mobileNav.find('select').append('<option value="' + this.href + '">&raquo; ' + $(this).text() + '</option>');
  }
  mainNav.find('a').each(addOption);
  $('ul.subscription a').each(addOption);
  mobileNav.find('select').bind('change', function(event) {
    if (event.target.value) { window.location.href = event.target.value; }
  });
}

function addSidebarToggler() {
  if(!$('body').hasClass('sidebar-footer')) {
    $('#content').append('<span class="toggle-sidebar"></span>');
    $('.toggle-sidebar').bind('click', function(e) {
      e.preventDefault();
      if ($('body').hasClass('collapse-sidebar')) {
        $('body').removeClass('collapse-sidebar');
      } else {
        $('body').addClass('collapse-sidebar');
      }
    });
  }
  var sections = $('aside.sidebar > section');
  if (sections.length > 1) {
    sections.each(function(index, section){
      if ((sections.length >= 3) && index % 3 === 0) {
        $(section).addClass("first");
      }
      var count = ((index +1) % 2) ? "odd" : "even";
      $(section).addClass(count);
    });
  }
  if (sections.length >= 3){ $('aside.sidebar').addClass('thirds'); }
}

function testFeatures() {
  // Extracted from Modernizr.testAllProps
  // http://modernizr.com/docs/#testallprops
  function testAllProps(prop) {
    var cssomPrefixes = ['Webkit', 'Moz', 'O', 'ms'];
    var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1);
    var props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

    var modElem = document.createElement('modernizr');
    var mStyle = modElem.style;

    for (var i in props) {
      var prop = props[i];
      if (mStyle[prop] !== undefined) {
        return true;
      }
    }
    return false;
  }

  if (testAllProps('maskImage')) {
    $('html').addClass('maskImage');
  } else {
    $('html').addClass('no-maskImage');
  }

  if ("placeholder" in document.createElement("input")) {
    $('html').addClass('placeholder');
  } else {
    $('html').addClass('no-placeholder');
  }
}

function wrapFlashVideos() {
  $('object').each(function(i, object) {
    if( $(object).find('param[name=movie]').length ){
      $(object).wrap('<div class="flash-video">')
    }
  });
  $('iframe[src*=vimeo],iframe[src*=youtube]').wrap('<div class="flash-video">')
}

$('document').ready(function() {
  testFeatures();
  wrapFlashVideos();
  getNav();
  addSidebarToggler();
});
