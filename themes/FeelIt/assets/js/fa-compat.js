// FontAwesome 6 compatibility layer
document.addEventListener('DOMContentLoaded', function() {
  // Map of old icon names to new ones in FontAwesome 6
  const iconMap = {
    // Brand icons that have changed
    'fa-telegram-plane': 'fa-telegram',
    'fa-twitter': 'fa-x-twitter',
    'fa-facebook-f': 'fa-facebook',
    'fa-youtube-play': 'fa-youtube',
    'fa-github-alt': 'fa-github',
    'fa-github-square': 'fa-square-github',
    'fa-twitter-square': 'fa-square-x-twitter',
    'fa-linkedin-square': 'fa-linkedin',
    
    // Add more mappings as needed for other icons
    'fa-address-book-o': 'fa-address-book',
    'fa-address-card-o': 'fa-address-card',
    'fa-arrow-circle-o-down': 'fa-circle-arrow-down',
    'fa-arrow-circle-o-left': 'fa-circle-arrow-left',
    'fa-arrow-circle-o-right': 'fa-circle-arrow-right',
    'fa-arrow-circle-o-up': 'fa-circle-arrow-up'
  };

  // Function to check if an element is using FontAwesome
  function isUsingFontAwesome(el) {
    return el.classList.contains('fa') || 
           el.classList.contains('fas') || 
           el.classList.contains('far') || 
           el.classList.contains('fab') || 
           el.classList.contains('fal') || 
           el.classList.contains('fad');
  }

  // Find all elements with FontAwesome classes
  document.querySelectorAll('i').forEach(function(el) {
    // Skip elements that have already been processed
    if (el.getAttribute('data-fa-processed') === 'true') {
      return;
    }
    
    if (isUsingFontAwesome(el)) {
      const classes = Array.from(el.classList);
      
      // Check each class to see if it needs to be updated
      classes.forEach(function(cls) {
        if (iconMap[cls]) {
          // Replace the old class with the new one
          el.classList.remove(cls);
          el.classList.add(iconMap[cls]);
          console.log('Replaced FontAwesome icon:', cls, 'with', iconMap[cls]);
        }
      });
      
      // Mark as processed
      el.setAttribute('data-fa-processed', 'true');
    }
  });
  
  console.log('FontAwesome compatibility layer initialized');
});
