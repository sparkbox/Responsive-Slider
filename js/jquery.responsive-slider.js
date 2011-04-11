(function($) {
  $.fn.slider = function(options) {
      
    var settings = $.extend({
      auto: true,
      infinite: true,
      showNav: true,
      wait: 5000,
      animation: 'fadeIn',
      animation_func: 'reveal',
      animations: {
        reveal: function($current, $next, options) {
          var anim_settings = $.extend({
                speed: 500
              }, options);
        
          function post_animate() {
            $(this).removeClass('next')
              .addClass('current')
              .removeAttr('style')
              .css('zoom', 1);
            
            // remove .current form previous item
            var $parent = $current.parent();
            // $current.remove().removeClass('current').appendTo($parent);
            $current.removeClass('current');
          }
          $next[settings.animation](anim_settings.speed, post_animate);
        },      
        slide: function($current, $next, options) {
          var anim_settings = $.extend({
                speed: 2000
              }, options);
        
          function post_animate_next() {
            $(this).removeClass('next sliding')
              .addClass('current')
              .removeAttr('style')
              .css('zoom', 1);
            
            // remove .current form previous item
            var $parent = $current.parent();
            $current.removeClass('current');
          }
          
          function post_animate_current() {
            $(this).removeClass('sliding')
              .removeAttr('style');
          }
          
          $current.addClass('sliding').animate({
            left: -1 * $current.width()
          }, anim_settings.speed, post_animate_current);
          
          $next.addClass('sliding').animate({
            marginLeft: -1 * $current.width()
          }, anim_settings.speed, post_animate_next);
        }
      }
    },
    options);
   
    
    function _animate($current, $next, f) {
      // call the custom animation function
      settings.animations[settings.animation_func]($current, $next, options);
      
      // run the callback
      if (typeof(f) === 'function') {
        f();
      }
    }

    function _swap($container, $next) {
      var $current = $container.find('.current'),
          $controls = $('.swap-controls');
      
      // unless a next is specified, grab the next item available
        // using $next = $next || ternary here wouldn't wortk in iOS - weird??
      if (!$next) {
        $next = $current.next().length ? $current.next() : $container.children(':first-child');
      }      
      
      // alert($('.slider').html());
      // Fix the height of the container during the animation to prevent jumping
      //$container.data('savedHeight', $container[0].height).height($current.height(true));
      $container.height($current.height(true));      

      $next.addClass('next');
      
      // Run custom animation function
      _animate($current, $next, function() {
        $container.height('auto');
        
        // set current item indicator
        if ($controls.length) {
          $controls.find('.current').removeClass('current');
          $controls.find('[data-item=' + $next.data('item') + ']').parent().addClass('current');
        }
      });
    }
        
    return this.each(function() {
      var $self = $(this),
          timer;
      
      // Setup
      $self.children(':first-child').addClass('current');
      $self.children().each(function(i) {
        $(this).attr('data-item', i);
      });
      
      if (settings.showNav) {
        $self.wrap('<div class="slider-container"/>');
        var $container = $self.parent(),
            controls = '<div class="swap-controls"><ol style="left: ' + (-20 * $self.find('li').length / 2) + 'px">',
            current = ' current';
            
        // Create current item links
        $self.find('li').each(function(i) {
           controls += '<li class="swap-button ' + current + '"><a href="#" data-item="' + i + '">' + i + '</a></li>';
           current = '';
        });
        controls += "</ol></div>";
        
        // Append everything to the DOM
        $container.prepend('<a href="." class="slider-prev">prev</a>' + controls + '<a href="." class="slider-next">next</a>');
        
        $('.swap-button').find('a').bind('click', function(e) {
          _swap($self, $self.children('[data-item=' + $(e.target).data('item') +']'));
          clearInterval(timer);
          e.preventDefault();
        });
        $('.slider-next').bind('click', function(e) {

          var $next = $self.children('.current').next().length ?
            $self.children('.current').next() :
            $self.children(':first-child');
                    
          _swap($self, $next);
          clearInterval(timer);
          e.preventDefault();
        });
        $('.slider-prev').bind('click', function(e) {
          
          var $prev = $self.children('.current').prev().length ?
            $self.children('.current').prev() :
            $self.children(':last-child');
            
          _swap($self, $prev);
          clearInterval(timer);
          e.preventDefault();
        });
      }
      
      // Set up auto scroll
      if (settings.auto) {
        timer = setInterval(function() {
          _swap($self);
        }, settings.wait);
      }
      
    });  
   
  };
})(jQuery);