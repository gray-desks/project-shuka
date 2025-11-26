# Header Design Update Walkthrough

## Overview
This update addresses the layout issues in the header, specifically preventing the logo from wrapping in English mode and optimizing the season selector for future scalability.

## Changes

### 1. Logo Layout Fix
- **Issue**: The logo "秀歌 - Shuka" was wrapping to two lines when the language was set to English, breaking the header layout.
- **Fix**: Applied `white-space: nowrap` and `flex-shrink: 0` to the `.logo` class in `assets/css/main.css`. This ensures the logo always stays on one line regardless of the available space or language.

### 2. Season Selector Redesign (Desktop)
- **Issue**: The horizontal list of season buttons took up too much space and wouldn't scale well if more buttons were added.
- **Fix**: Converted the season selector into a **Dropdown Menu** on desktop screens (min-width: 768px).
    - **Trigger Button**: Added a "Current Season" button that displays the selected season's icon and name.
    - **Dropdown**: The season options now appear in a vertical dropdown menu when hovering over the trigger.
    - **Mobile**: On mobile devices, the season selector remains a list/grid within the hamburger menu for easy touch access.

### 3. JavaScript Updates
- **Logic**: Updated `assets/js/main.js` to dynamically update the Trigger Button's text and icon whenever a season is selected.
- **i18n**: Ensured the Trigger Button's text supports internationalization by updating the `data-i18n` attribute dynamically.

## Files Modified
- `assets/css/main.css`: Added styles for the dropdown and logo fix.
- `index.html`: Restructured the season selector HTML.
- `assets/js/main.js`: Updated the `updateActive` method to handle the dropdown trigger.

## Verification
- **Desktop**: Verify that hovering over the Season button reveals the dropdown. Selecting a season should update the button text. The logo should not wrap.
- **Mobile**: Verify that the season buttons are still visible and functional inside the hamburger menu.
