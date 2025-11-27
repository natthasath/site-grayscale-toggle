=== Site Grayscale Toggle ===
Contributors: natthasath
Tags: grayscale, accessibility, ui, toggle, filter, csp, widget
Tested up to: 6.8
Stable tag: 1.1.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

CSP-safe plugin that applies a site-wide grayscale filter with a front-end toggle. Control intensity (0–100) and whether to show a floating toggle button. Includes a shortcode to place the switch anywhere.

== Description ==
**Site Grayscale Toggle** lets you turn your entire site grayscale and give visitors a clear on/off switch. It's built to be **CSP-friendly (no inline JS)** and to avoid a flash-of-unstyled-content by injecting the initial state on the server side.

**Features:**
- **Grayscale filter site-wide** via `html.is-grayscale { filter: grayscale(var(--sgt-level)); }`.
- **Intensity control (0–100)** from Settings → Site Grayscale.
- **Show/Hide floating toggle button** (bottom-right by default).
- **Shortcode**: `[grayscale_toggle]` to place the switch anywhere (headers, menus, footers, blocks, widgets).
- **Remembers visitor preference** with `localStorage` across pages.
- **CSP-safe**: no inline JS; initial state added server-side to `<html>` to avoid FOUC.
- Lightweight, theme-agnostic; works alongside most caching/CDN plugins.

Use cases include memorial/monochrome modes, accessibility preferences, or design experiments that you want users to control.

== Installation ==
1. Upload the plugin ZIP via **Plugins → Add New → Upload Plugin** and click **Activate**.
2. Go to **Settings → Site Grayscale** and configure:
   - **Enable grayscale by default**
   - **Grayscale intensity (0–100)**
   - **Show floating toggle button**
3. (Optional) Place the toggle anywhere with the shortcode:
   ```
   [grayscale_toggle]
   ```
   You can customize labels/classes:
   ```
   [grayscale_toggle label_on="Grayscale: ON" label_off="Grayscale: OFF" class="my-btn"]
   ```

== Frequently Asked Questions ==
= Why did enabling grayscale not change my site? =
Check two things:
1) **Intensity** isn't set to `0` (go to Settings → Site Grayscale → set to `100` to test).  
2) **Visitor preference** may be stored as `off`. Clear it in the browser console:
```js
localStorage.removeItem('sgt_pref'); location.reload();
```

= Does it work under strict Content-Security-Policy (CSP)? =
Yes. v1.1.1 removes inline JS and injects the initial class/attributes server-side, so CSP rules that block inline scripts won't prevent grayscale from applying.

= How do I hide the floating button and use only the shortcode? =
Uncheck **Show floating toggle button** in Settings → Site Grayscale, then place `[grayscale_toggle]` where you want.

= Can I exclude some elements from being grayscaled? =
Yes, add CSS like this in your theme or a customizer:
```css
html.is-grayscale .no-gray {
  -webkit-filter: none !important;
  filter: none !important;
}
```
Then add the class `no-gray` to elements you want to keep in color.

= Will it conflict with caching/CDN plugins? =
Generally no. If you don't see changes, clear/purge caches and your CDN.

= Is there WP-CLI support? =
You can manage options via WP-CLI:
```bash
wp option update sgt_default_on 1
wp option update sgt_intensity 100
wp option update sgt_show_button 1
```

== Screenshots ==
1. Floating grayscale toggle button shown on the front-end.
2. Settings page: default state, intensity, and show/hide button.
3. Front-end when grayscale is ON.
4. Front-end when grayscale is OFF.

== Changelog ==
= 1.1.1 =
* **CSP-safe:** removed inline JS and moved bootstrap to server-side attribute/class injection.
* Preserved intensity (0–100), show/hide floating button, and shortcode features.

= 1.1.0 =
* Added intensity control (0–100).
* Added show/hide floating toggle button setting.

= 1.0.0 =
* Initial release with grayscale and front-end toggle button + shortcode.

== Upgrade Notice ==
= 1.1.1 =
CSP-safe build: removes inline JS and adds server-side bootstrap to avoid FOUC and comply with strict CSP rules. Recommended for sites using security headers and caching/CDN layers.
