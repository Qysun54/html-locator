# /add-locator - Add a Visual Locator to Static HTML

Add locator mode to a target HTML file so future UI edits can reference exact visible areas. Locator mode highlights hovered elements, shows a logical path, and copies the path when the user presses `C`.

## Arguments

- `$ARGUMENTS`: Optional path to an HTML file. If omitted, ask the user which HTML file to update.

## Steps

### 1. Choose the Target File

- If the user provided a file path, use that path.
- If no path was provided, ask which HTML file should be processed.
- Confirm the file exists and appears to be HTML.

### 2. Add Semantic `data-section` Attributes

Read the full HTML file and identify meaningful visible regions. Add `data-section` attributes to containers and controls that help someone locate UI areas later.

Prioritize:

- Primary navigation or tab bars, including each item.
- Sidebars, including each menu item.
- Main content containers and each major view or page.
- Cards, modules, metrics, and configuration blocks.
- Dialogs, drawers, popovers, toast regions, and panels.
- Forms, field groups, tables, toolbars, and repeated list items.

Naming rules:

- Use readable names that describe the visible product area.
- Prefer the format `Area-Name`, with additional levels separated by `-`.
- Match the language already used in the page when practical.
- Do not add duplicate `data-section` attributes to elements that already have one.
- Avoid implementation-only names such as framework component names unless no visible label exists.

Examples:

```html
<nav data-section="Nav-Primary">
<aside data-section="Sidebar-Customers">
<main data-section="Main-Workspace">
<section data-section="View-Dashboard">
<article data-section="Card-BillingHealth">
<form data-section="Form-InviteUser">
```

### 3. Add the Locator Script

- If the HTML already includes a locator script, do not inject another one.
- Check the target HTML directory for `locator.js`.
- If `locator.js` does not exist, create it using the repository version of `locator.js`.
- Add this before `</body>` if it is missing:

```html
<script src="locator.js"></script>
```

If the HTML file lives in a nested directory or needs a different relative path, use the correct relative script path.

### 4. Report the Result

Tell the user:

- How many `data-section` attributes were added.
- Which areas were covered.
- Whether `locator.js` was created, reused, or already present.
- Whether the script tag was injected or already present.
- How to use it: open the HTML in a browser, click `L`, hover an element, then press `C` to copy the path.
