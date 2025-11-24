# Mobile Loading Screen Update

## Goal
Update the mobile loading screen to match the PC version's visual style and behavior.

## Changes

### 1. Unified Loader Image
- **File**: `assets/css/loader.css`
- **Change**: Removed the `@media (max-width: 767px)` block that swapped the background image to `ローディング-スマホ版.webp`.
- **Result**: The mobile version now uses `ローディング.webp` (the PC image), ensuring a consistent visual experience across devices.

### 2. Updated Critical CSS
- **File**: `index.html`
- **Change**: Removed the corresponding mobile image override in the inline `#critical-loader-css` block.
- **Result**: The initial paint on mobile devices now also uses the PC image, preventing any flash of different content.

### 3. Optimized Preloading
- **File**: `index.html`
- **Change**: Updated `<link rel="preload">` tags.
  - Removed the preload for `ローディング-スマホ版.webp`.
  - Changed the preload for `ローディング.webp` to apply to all devices (removed `media="(min-width: 768px)"`).
- **Result**: The correct image is preloaded for all users, improving performance.

## Verification
- Checked `assets/css/loader.css` and `index.html` to ensure no other mobile-specific overrides for the loader exist.
- Confirmed that the `ink` animation in `loader.css` uses `vmax` units, ensuring it remains responsive and works correctly on mobile devices with the PC image.
