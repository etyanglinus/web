// react-slick breakpoint:X meant "apply for width <= X" (descending); these
// Swiper breakpoints mean "apply for width >= X" (ascending) - shifted by +1.
// 901 is an inserted breakpoint (carrying forward the slidesPerView already in
// force there) purely to switch the gap to the desktop value from that width.
export const NEW_ARRIVAL_STORES_BREAKPOINTS = {
  341: { slidesPerView: 1.4 },
  481: { slidesPerView: 2 },
  761: { slidesPerView: 3 },
  901: { slidesPerView: 3, spaceBetween: 20 },
  1025: { slidesPerView: 4, spaceBetween: 20 },
};

// FoodNewArrivalImageBox is a fixed-size box (93px / 75px mobile), so this
// slider sizes slides to the card's real content width via "auto" rather
// than a computed fractional cell.
export const FOOD_NEW_ARRIVAL_GAP_BREAKPOINTS = {
  901: { spaceBetween: 20 },
};
