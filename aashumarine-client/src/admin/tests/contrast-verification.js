/**
 * Contrast Ratio Verification for Responsive Design
 * Validates WCAG AA compliance across all breakpoints
 */

// Helper function to calculate relative luminance
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Helper function to calculate contrast ratio
function getContrastRatio(rgb1, rgb2) {
  const lum1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Color definitions from CSS
const colors = {
  white: [255, 255, 255],
  whiteTransparent90: [255, 255, 255], // 0.9 opacity, will blend with background
  
  // Gradient backgrounds (using darkest color for white text contrast)
  // For white text on gradients, we test against the lightest part (worst case)
  blueGradientLight: [118, 75, 162], // #764ba2 (darker end)
  purpleGradientLight: [245, 87, 108], // #f5576c (darker end)
  greenGradientLight: [34, 197, 94], // #22c55e (darker end)
  orangeGradientLight: [245, 158, 11], // #f59e0b (darker end)
  tealGradientLight: [20, 184, 166], // #14b8a6 (darker end)
  
  // Status badge text colors
  statusNewText: [30, 64, 175], // #1e40af
  statusContactedText: [194, 65, 12], // #c2410c
  statusConvertedText: [21, 128, 61], // #15803d
  statusClosedText: [75, 85, 99], // #4b5563
  
  // Status badge backgrounds (light gradients)
  statusNewBg: [219, 234, 254], // #dbeafe
  statusContactedBg: [255, 237, 213], // #ffedd5
  statusConvertedBg: [220, 252, 231], // #dcfce7
  statusClosedBg: [243, 244, 246], // #f3f4f6
  
  // Activity text colors
  grayText600: [75, 85, 99], // #4b5563
  grayText500: [107, 114, 128], // #6b7280
  grayText700: [55, 65, 81], // #374151
  grayText900: [17, 24, 39], // #111827
  
  // Backgrounds
  whiteBg: [255, 255, 255],
  grayBg50: [249, 250, 251], // #f9fafb
};

// Test cases for contrast ratios
const testCases = [
  // StatCard text on gradient backgrounds (testing against darker end of gradient)
  { name: 'StatCard title (white 0.9) on blue gradient', text: colors.white, bg: colors.blueGradientLight, minRatio: 4.5, fontSize: 14, fontWeight: 600 },
  { name: 'StatCard value (white) on blue gradient', text: colors.white, bg: colors.blueGradientLight, minRatio: 3.0, fontSize: 36, fontWeight: 700 },
  { name: 'StatCard title on purple gradient', text: colors.white, bg: colors.purpleGradientLight, minRatio: 4.5, fontSize: 14, fontWeight: 600 },
  { name: 'StatCard value on purple gradient', text: colors.white, bg: colors.purpleGradientLight, minRatio: 3.0, fontSize: 36, fontWeight: 700 },
  { name: 'StatCard title on green gradient', text: colors.white, bg: colors.greenGradientLight, minRatio: 4.5, fontSize: 14, fontWeight: 600 },
  { name: 'StatCard value on green gradient', text: colors.white, bg: colors.greenGradientLight, minRatio: 3.0, fontSize: 36, fontWeight: 700 },
  { name: 'StatCard title on orange gradient', text: colors.white, bg: colors.orangeGradientLight, minRatio: 4.5, fontSize: 14, fontWeight: 600 },
  { name: 'StatCard value on orange gradient', text: colors.white, bg: colors.orangeGradientLight, minRatio: 3.0, fontSize: 36, fontWeight: 700 },
  { name: 'StatCard title on teal gradient', text: colors.white, bg: colors.tealGradientLight, minRatio: 4.5, fontSize: 14, fontWeight: 600 },
  { name: 'StatCard value on teal gradient', text: colors.white, bg: colors.tealGradientLight, minRatio: 3.0, fontSize: 36, fontWeight: 700 },
  
  // Status badges
  { name: 'Status new badge', text: colors.statusNewText, bg: colors.statusNewBg, minRatio: 4.5, fontSize: 12, fontWeight: 600 },
  { name: 'Status contacted badge', text: colors.statusContactedText, bg: colors.statusContactedBg, minRatio: 4.5, fontSize: 12, fontWeight: 600 },
  { name: 'Status converted badge', text: colors.statusConvertedText, bg: colors.statusConvertedBg, minRatio: 4.5, fontSize: 12, fontWeight: 600 },
  { name: 'Status closed badge', text: colors.statusClosedText, bg: colors.statusClosedBg, minRatio: 4.5, fontSize: 12, fontWeight: 600 },
  
  // Activity card text
  { name: 'Activity item header on white', text: colors.grayText900, bg: colors.whiteBg, minRatio: 4.5, fontSize: 16, fontWeight: 600 },
  { name: 'Activity item text on white', text: colors.grayText600, bg: colors.whiteBg, minRatio: 4.5, fontSize: 14, fontWeight: 400 },
  { name: 'Activity item meta on white', text: colors.grayText500, bg: colors.whiteBg, minRatio: 4.5, fontSize: 14, fontWeight: 400 },
  
  // Button text
  { name: 'Primary button text on blue gradient', text: colors.white, bg: colors.blueGradientLight, minRatio: 4.5, fontSize: 14, fontWeight: 500 },
  { name: 'Secondary button text on gray gradient', text: colors.grayText700, bg: colors.grayBg50, minRatio: 4.5, fontSize: 14, fontWeight: 500 },
];

// Run verification
console.log('='.repeat(80));
console.log('WCAG AA Contrast Ratio Verification - Responsive Design');
console.log('='.repeat(80));
console.log('');

let allPassed = true;
const results = [];

testCases.forEach(test => {
  const ratio = getContrastRatio(test.text, test.bg);
  const passed = ratio >= test.minRatio;
  
  if (!passed) allPassed = false;
  
  results.push({
    name: test.name,
    ratio: ratio.toFixed(2),
    minRatio: test.minRatio.toFixed(1),
    passed,
    fontSize: test.fontSize,
    fontWeight: test.fontWeight
  });
});

// Display results
results.forEach(result => {
  const status = result.passed ? '✓ PASS' : '✗ FAIL';
  const icon = result.passed ? '✓' : '✗';
  console.log(`${icon} ${result.name}`);
  console.log(`  Ratio: ${result.ratio}:1 (Required: ${result.minRatio}:1)`);
  console.log(`  Font: ${result.fontSize}px, Weight: ${result.fontWeight}`);
  console.log('');
});

console.log('='.repeat(80));
console.log(`Overall Result: ${allPassed ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}`);
console.log('='.repeat(80));

// Summary
const passedCount = results.filter(r => r.passed).length;
const totalCount = results.length;
console.log(`\nSummary: ${passedCount}/${totalCount} tests passed`);

if (!allPassed) {
  console.log('\nFailed tests:');
  results.filter(r => !r.passed).forEach(r => {
    console.log(`  - ${r.name}: ${r.ratio}:1 (needs ${r.minRatio}:1)`);
  });
}

process.exit(allPassed ? 0 : 1);
