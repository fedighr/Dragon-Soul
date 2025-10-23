// Mobile touch support for product cards
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (window.innerWidth < 1024) { // Only on mobile/tablet
                e.stopPropagation();
                // Remove active class from all other cards
                document.querySelectorAll('.product-card').forEach(otherCard => {
                    if (otherCard !== this) {
                        otherCard.classList.remove('mobile-active');
                    }
                });
                // Toggle active class on current card
                this.classList.toggle('mobile-active');
            }
        });
    });

    // Close product actions when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.product-card')) {
            document.querySelectorAll('.product-card').forEach(card => {
                card.classList.remove('mobile-active');
            });
        }
    });
});