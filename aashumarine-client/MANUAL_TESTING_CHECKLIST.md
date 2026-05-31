# Manual Testing Checklist
**Task 18.1: Verify all requirements are implemented**

This checklist provides step-by-step instructions for manually verifying all requirements across different browsers and devices.

---

## Testing Environment Setup

### Browsers to Test:
- [ ] Chrome (latest version)
- [ ] Firefox (latest version)
- [ ] Safari (latest version)
- [ ] Edge (latest version)

### Devices/Viewports to Test:
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px - 1920px)
- [ ] Large Desktop (1920px+)

### Accessibility Tools:
- [ ] Screen reader (NVDA/JAWS/VoiceOver)
- [ ] Keyboard-only navigation
- [ ] Browser DevTools Accessibility Inspector

---

## Requirement 1: Home Page Product Display

### Test Steps:
1. Navigate to home page (/)
2. Scroll to "OUR PRODUCTS" section

### Verification:
- [ ] Exactly 6 products are displayed
- [ ] Each product card shows:
  - [ ] Product name
  - [ ] Engine type (category)
  - [ ] Manufacturer
  - [ ] Product image
- [ ] Product cards do NOT show:
  - [ ] Long descriptions
  - [ ] Additional information
  - [ ] Price
- [ ] "View All Products" button is visible below products
- [ ] Clicking "View All Products" navigates to /products page
- [ ] Clicking a product card navigates to product detail page

**Expected Result:** ✅ 6 products displayed with simplified cards, navigation works

---

## Requirement 2: Why Choose Us Section Enhancement

### Test Steps:
1. Navigate to home page (/)
2. Scroll to "WHY US?" section

### Verification:
- [ ] Section displays 3-4 key points (currently shows 5 - minor deviation)
- [ ] Each card has:
  - [ ] Large icon (visually appears ≥48px)
  - [ ] Large heading text (visually appears ≥24px)
  - [ ] Description text
- [ ] Cards animate when scrolled into view (fade-in effect)
- [ ] Animation duration feels smooth (≤800ms)
- [ ] With prefers-reduced-motion enabled:
  - [ ] Cards appear instantly without animation

**Expected Result:** ✅ Large icons and headings with smooth entrance animations

---

## Requirement 3: Testimonials Display Optimization

### Test Steps:
1. Navigate to home page (/)
2. Scroll to "TESTIMONIALS" section

### Verification:
- [ ] Testimonials are displayed in slider layout
- [ ] Each testimonial shows:
  - [ ] Customer name
  - [ ] Company name
  - [ ] Testimonial text (≤24 words)
  - [ ] Star rating
- [ ] Long testimonials are truncated with "..."
- [ ] Testimonial cards are ≤300px wide
- [ ] Navigation controls are visible:
  - [ ] Previous button (‹)
  - [ ] Next button (›)
  - [ ] Dot indicators
- [ ] Clicking navigation buttons changes visible testimonials
- [ ] Keyboard arrow keys navigate testimonials (when slider focused)

**Expected Result:** ✅ Testimonials display in slider with 24-word limit and navigation

---

## Requirement 4: Testimonial Submission Form Layout

### Test Steps:
1. Navigate to home page (/)
2. Scroll to "SHARE YOUR EXPERIENCE" section

### Verification:
- [ ] Form is displayed in two-column layout (desktop)
- [ ] Left column contains:
  - [ ] Form fields (name, company, testimonial, rating)
- [ ] Right column contains:
  - [ ] Descriptive text about testimonials
- [ ] Form fields are functional:
  - [ ] Name input
  - [ ] Company input
  - [ ] Testimonial textarea
  - [ ] Rating selection
  - [ ] Submit button
- [ ] On mobile (<768px):
  - [ ] Columns stack vertically
  - [ ] Form remains usable

**Expected Result:** ✅ Two-column layout with functional form

---

## Requirement 5: Company Statistics Counter

### Test Steps:
1. Navigate to home page (/)
2. Scroll to counter section (between Why Us and Testimonials)

### Verification:
- [ ] Counter section is visible
- [ ] Four statistics are displayed:
  - [ ] Years of Experience (25+)
  - [ ] Satisfied Customers (500+)
  - [ ] Parts Delivered (10000+)
  - [ ] Global Ports Served (150+)
- [ ] Counters animate from 0 to target value when scrolled into view
- [ ] Animation completes in ~2 seconds
- [ ] Animation only triggers once per page load
- [ ] With prefers-reduced-motion enabled:
  - [ ] Counters show final values instantly

**Expected Result:** ✅ Animated counters display company statistics

---

## Requirement 6: About Us Page Visual Enhancement

### Test Steps:
1. Navigate to About Us page (/about)
2. Scroll through the page

### Verification:
- [ ] Page displays 2-3 images (currently 3)
- [ ] Images are high quality and relevant
- [ ] Sections use alternating layout:
  - [ ] Section 1: Image on left, text on right
  - [ ] Section 2: Text on left, image on right
  - [ ] Section 3: Image on left, text on right
- [ ] Sections animate when scrolled into view
- [ ] Animation types include:
  - [ ] Fade-in
  - [ ] Slide-in (left/right)
- [ ] Animation duration is 600-1000ms
- [ ] On mobile (<768px):
  - [ ] Images and text stack vertically

**Expected Result:** ✅ 3 images with alternating layout and smooth animations

---

## Requirement 7: Product Listing Page Enhancement

### Test Steps:
1. Navigate to Products page (/products)

### Verification:
- [ ] Products are displayed in card-based grid layout
- [ ] Filter panel is visible with:
  - [ ] Engine Type dropdown
  - [ ] Manufacturer dropdown
  - [ ] Search input
  - [ ] Clear Filters button (when filters active)
- [ ] Selecting engine type filter:
  - [ ] Updates product list within 300ms
  - [ ] Shows only matching products
  - [ ] Updates URL query parameter
- [ ] Selecting manufacturer filter:
  - [ ] Updates product list within 300ms
  - [ ] Shows only matching products
  - [ ] Updates URL query parameter
- [ ] Selecting both filters:
  - [ ] Shows products matching ALL criteria (AND logic)
- [ ] Typing in search:
  - [ ] Filters products by name
  - [ ] Debounced (doesn't update on every keystroke)
- [ ] Clicking "Clear Filters":
  - [ ] Resets all filters
  - [ ] Shows all products
- [ ] On mobile (<768px):
  - [ ] Filter panel is collapsible
  - [ ] Shows active filter count badge

**Expected Result:** ✅ Functional filtering with debounced updates

---

## Requirement 8: Product Detail Page Simplification

### Test Steps:
1. Navigate to any product detail page (/products/:id)

### Verification:
- [ ] Product information is displayed:
  - [ ] Product name
  - [ ] Category (engine type)
  - [ ] Manufacturer
  - [ ] Model
  - [ ] Condition
  - [ ] Description
- [ ] "Additional Information" section is NOT present
- [ ] Related Products section is displayed
- [ ] Related Products shows 2-3 products
- [ ] Related products match:
  - [ ] Same engine type OR
  - [ ] Same manufacturer
- [ ] Clicking related product navigates to that product's page

**Expected Result:** ✅ Simplified detail page with 2-3 related products, no Additional Info

---

## Requirement 9: Product Image and Video Gallery

### Test Steps:
1. Navigate to any product detail page (/products/:id)
2. Interact with product gallery

### Verification:
- [ ] Gallery displays product images
- [ ] Multiple images are supported (if product has multiple)
- [ ] Gallery has navigation controls:
  - [ ] Previous arrow
  - [ ] Next arrow
  - [ ] Thumbnail navigation (if multiple images)
- [ ] Auto-scroll advances images every 5 seconds
- [ ] Clicking navigation arrows:
  - [ ] Changes displayed image
  - [ ] Pauses auto-scroll
- [ ] Clicking an image:
  - [ ] Opens lightbox (full-screen modal)
  - [ ] Shows larger version of image
- [ ] In lightbox:
  - [ ] Can navigate between images
  - [ ] Can close with X button or ESC key
  - [ ] Background is dimmed
- [ ] Keyboard navigation works:
  - [ ] Arrow keys navigate images
  - [ ] ESC closes lightbox

**Expected Result:** ✅ Multi-image gallery with auto-scroll, navigation, and lightbox

---

## Requirement 10: Contact Us Page Enhancement

### Test Steps:
1. Navigate to Contact Us page (/contact)

### Verification:
- [ ] Page uses two-column layout (desktop)
- [ ] Left column contains:
  - [ ] Contact information with icons:
    - [ ] Location icon + address
    - [ ] Email icon + email address
    - [ ] Phone icon + phone number
  - [ ] Google Map embed
- [ ] Right column contains:
  - [ ] Contact form with fields:
    - [ ] Name
    - [ ] Email
    - [ ] Subject
    - [ ] Message
    - [ ] Submit button
- [ ] Icons are ≥24px (visually)
- [ ] Spacing between contact elements is consistent (16px)
- [ ] Map is interactive (can zoom, pan)
- [ ] On mobile (<768px):
  - [ ] Columns stack vertically
  - [ ] Contact info appears above form

**Expected Result:** ✅ Two-column layout with icons, map, and form

---

## Requirement 11: Performance Standards

### Test Steps:
1. Open browser DevTools (Network tab)
2. Navigate to home page (/)
3. Scroll through entire page

### Verification:
- [ ] Initial page load completes quickly (<2s on good connection)
- [ ] Images below the fold load as you scroll (lazy loading)
- [ ] Animations run smoothly at 60fps (check Performance tab)
- [ ] Images are compressed (check file sizes in Network tab)
- [ ] Images use modern formats (AVIF/WebP when supported)
- [ ] Video (if present) doesn't auto-load on page load
- [ ] No layout shifts during page load (check Lighthouse CLS score)

### Performance Metrics to Check:
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] First Input Delay (FID) < 100ms
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Time to Interactive (TTI) < 3.8s

**Expected Result:** ✅ Fast page loads, lazy loading, smooth animations

---

## Requirement 12: Responsive Design Standards

### Test Steps:
1. Test on multiple viewport sizes using browser DevTools

### Verification:

#### Mobile (320px - 767px):
- [ ] All content is visible and readable
- [ ] No horizontal scrolling
- [ ] Text is legible (not too small)
- [ ] Touch targets are ≥44px (buttons, links)
- [ ] Navigation menu is hamburger style
- [ ] Forms are single-column
- [ ] Images scale appropriately
- [ ] Filter panels are collapsible

#### Tablet (768px - 1023px):
- [ ] Layout adapts to medium screen
- [ ] Two-column layouts may become single-column
- [ ] Navigation is full menu or hamburger
- [ ] Product grids show 2-3 items per row

#### Desktop (1024px+):
- [ ] Full multi-column layouts
- [ ] Navigation is full horizontal menu
- [ ] Product grids show 3-4 items per row
- [ ] All features are accessible

### Specific Breakpoint Tests:
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone X)
- [ ] 768px (iPad portrait)
- [ ] 1024px (iPad landscape)
- [ ] 1920px (Desktop)
- [ ] 2560px (Large desktop)

**Expected Result:** ✅ Responsive layouts work across all viewport sizes

---

## Requirement 13: Accessibility Standards

### Test Steps:
1. Use keyboard-only navigation (no mouse)
2. Enable screen reader
3. Check color contrast
4. Enable prefers-reduced-motion

### Verification:

#### Keyboard Navigation:
- [ ] Tab key moves focus through all interactive elements
- [ ] Focus indicator is visible on all elements
- [ ] Enter/Space activates buttons and links
- [ ] Arrow keys navigate sliders and galleries
- [ ] ESC closes modals and dropdowns
- [ ] No keyboard traps (can always navigate away)

#### Screen Reader:
- [ ] All images have descriptive alt text
- [ ] Headings are properly structured (h1 → h2 → h3)
- [ ] Form labels are associated with inputs
- [ ] ARIA labels are present on icon-only buttons
- [ ] Dynamic content changes are announced
- [ ] Skip navigation link works

#### Color Contrast:
- [ ] Text has ≥4.5:1 contrast ratio
- [ ] Large text has ≥3:1 contrast ratio
- [ ] Interactive elements have sufficient contrast
- [ ] Focus indicators are visible

#### Reduced Motion:
- [ ] Enable prefers-reduced-motion in OS settings
- [ ] Animations are disabled or reduced
- [ ] Counters show final values instantly
- [ ] Page transitions are instant
- [ ] Functionality still works without animations

### Accessibility Tools to Use:
- [ ] WAVE browser extension
- [ ] axe DevTools
- [ ] Lighthouse Accessibility audit
- [ ] Screen reader (NVDA/JAWS/VoiceOver)

**Expected Result:** ✅ Fully accessible with keyboard, screen reader, and reduced motion support

---

## Cross-Browser Testing

### Chrome:
- [ ] All features work
- [ ] Animations are smooth
- [ ] Images load correctly
- [ ] Forms submit successfully

### Firefox:
- [ ] All features work
- [ ] Animations are smooth
- [ ] Images load correctly
- [ ] Forms submit successfully

### Safari:
- [ ] All features work
- [ ] Animations are smooth (check Intersection Observer)
- [ ] Images load correctly (check lazy loading)
- [ ] Forms submit successfully
- [ ] AVIF images fallback to WebP/JPEG if not supported

### Edge:
- [ ] All features work
- [ ] Animations are smooth
- [ ] Images load correctly
- [ ] Forms submit successfully

---

## User Flow Testing

### Flow 1: Browse and View Product
1. [ ] Land on home page
2. [ ] Scroll to "OUR PRODUCTS" section
3. [ ] Click on a product card
4. [ ] View product details
5. [ ] Click on related product
6. [ ] View new product details

### Flow 2: Filter and Find Product
1. [ ] Navigate to Products page
2. [ ] Select engine type filter
3. [ ] Select manufacturer filter
4. [ ] View filtered results
5. [ ] Click on a product
6. [ ] View product details

### Flow 3: Submit Testimonial
1. [ ] Land on home page
2. [ ] Scroll to "SHARE YOUR EXPERIENCE" section
3. [ ] Fill out testimonial form
4. [ ] Submit form
5. [ ] See success message

### Flow 4: Contact Company
1. [ ] Navigate to Contact page
2. [ ] View contact information
3. [ ] Interact with map
4. [ ] Fill out contact form
5. [ ] Submit form
6. [ ] See success message

---

## Bug Reporting Template

If you find any issues during testing, document them using this template:

```
**Bug Title:** [Brief description]

**Requirement:** [Which requirement is affected]

**Severity:** [Critical / High / Medium / Low]

**Browser:** [Chrome / Firefox / Safari / Edge]

**Device:** [Desktop / Tablet / Mobile]

**Viewport Size:** [e.g., 375px]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happens]

**Screenshots:**
[Attach screenshots if applicable]

**Additional Notes:**
[Any other relevant information]
```

---

## Testing Sign-Off

### Tester Information:
- **Name:** ___________________________
- **Date:** ___________________________
- **Browser Versions Tested:**
  - Chrome: ___________________________
  - Firefox: ___________________________
  - Safari: ___________________________
  - Edge: ___________________________

### Overall Assessment:
- [ ] All requirements verified and working
- [ ] Minor issues found (documented above)
- [ ] Major issues found (documented above)
- [ ] Ready for production deployment

### Signature: ___________________________

---

## Notes

- This checklist should be completed for each major browser
- Test on real devices when possible (not just DevTools emulation)
- Pay special attention to Safari as it often has unique behavior
- Document any deviations from requirements
- Take screenshots of any issues found
- Retest after fixes are applied

**Estimated Testing Time:** 2-3 hours per browser/device combination
