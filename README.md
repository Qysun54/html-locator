# HTML Locator

HTML Locator is a tiny helper for static HTML prototypes, design demos, and AI-generated pages. It adds a visual locator mode so you can hover over an element, see a human-readable path, and copy that path for precise follow-up edits.

It is useful when the problem is not "which CSS selector matches this element?" but "which visible section should I ask an assistant or teammate to change?"

## What It Does

- Adds a floating `L` button to the page.
- Click `L` to enable locator mode.
- Hover any element to highlight it and preview its logical path.
- Press `C` to copy the current path.
- Builds paths from `data-section` attributes, element ids, and short text labels.

Example path:

```text
Main-Workspace > Card-Usage > "Upgrade"
```

## Quick Use

Copy `locator.js` next to your HTML file and add this before `</body>`:

```html
<script src="locator.js"></script>
```

Then open the HTML file in a browser:

1. Click the blue `L` button in the lower-left corner.
2. Hover over the target element.
3. Press `C` to copy the locator path.

## Better Paths With `data-section`

HTML Locator works best when meaningful containers have `data-section` attributes:

```html
<main data-section="Main-Workspace">
  <section data-section="Card-Usage">
    <button>Upgrade</button>
  </section>
</main>
```

Use names that describe visible product areas, not implementation details. Good examples:

- `Nav-Primary`
- `Sidebar-Customers`
- `View-Dashboard`
- `Card-BillingHealth`
- `Modal-InviteUser`
- `Table-RecentOrders`

## Slash Command Template

The file [commands/add-locator.md](commands/add-locator.md) contains a reusable slash-command style workflow for asking an AI coding assistant to:

- inspect a target HTML file,
- add meaningful `data-section` attributes,
- create or reuse `locator.js`,
- inject the script before `</body>`,
- report what changed.

## Example

Open [examples/demo.html](examples/demo.html) in a browser to try the locator.

## Scope

This is intended for local prototypes, static HTML demos, visual QA, and AI-assisted UI iteration. It is not meant as production analytics, a test selector system, or a replacement for accessibility labels.

## License

MIT
