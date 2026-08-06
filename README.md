# 🎉 Site Grayscale Toggle

Site Grayscale Toggle is a CSP-safe WordPress plugin that applies a site-wide grayscale filter with a front-end toggle switch. It lets visitors control the intensity (0–100) and remembers their preference, without relying on inline JavaScript or causing a flash of unstyled content.

![license](https://img.shields.io/github/license/natthasath/site-grayscale-toggle)
![wordpress](https://img.shields.io/badge/wordpress-tested%20up%20to%206.8-blue)
![last commit](https://img.shields.io/github/last-commit/natthasath/site-grayscale-toggle)

### ✨ Features

- **Grayscale filter site-wide** via `html.is-grayscale { filter: grayscale(var(--sgt-level)); }`
- **Intensity control (0–100)** from Settings → Site Grayscale
- **Show/hide floating toggle button** (bottom-right by default)
- **Shortcode** `[grayscale_toggle]` to place the switch anywhere (headers, menus, footers, blocks, widgets)
- **Remembers visitor preference** with `localStorage` across pages
- **CSP-safe** — no inline JS; initial state is injected server-side into `<html>` to avoid FOUC
- Lightweight, theme-agnostic; works alongside most caching/CDN plugins

Use cases include memorial/monochrome modes, accessibility preferences, or design experiments that you want visitors to control.

### ✅ Requirements

- WordPress, tested up to **6.8**
- No additional PHP dependencies

---

### 🚀 Installation

1. Upload the plugin ZIP via **Plugins → Add New → Upload Plugin** and click **Activate**.
2. Go to **Settings → Site Grayscale** and configure the options below.
3. (Optional) Place the toggle anywhere with the `[grayscale_toggle]` shortcode.

### ⚙️ Configuration

Available under **Settings → Site Grayscale**:

| Setting | Description | Default |
| --- | --- | --- |
| Enable grayscale by default | Visitors can still toggle it off | ON |
| Grayscale intensity (0–100) | `0` = no grayscale, `100` = full grayscale | 100 |
| Show floating toggle button | Disable if you only want the shortcode | ON |

---

### 🏆 Usage

Place the toggle anywhere with the default labels:

`[grayscale_toggle]`

Or customize the labels/class:

`[grayscale_toggle label_on="Grayscale: ON" label_off="Grayscale: OFF" class="my-btn"]`

### 📝 API Reference

**JavaScript** (`assets/sgt.js`) exposes a small public API on `window.SGT`:

| Method | Description |
| --- | --- |
| `SGT.currentState()` | Returns the active state, `'on'` or `'off'` |
| `SGT.applyState(state)` | Applies `'on'`/`'off'` to `<html>` and updates any toggle buttons |
| `SGT.toggle()` | Flips the current state and persists it to `localStorage` |

**PHP filter**: `sgtgle_auto_button` — return `false` to suppress the automatic floating button while keeping the shortcode available.

**Exclude elements from grayscale** by adding a CSS override:

```css
html.is-grayscale .no-gray {
  -webkit-filter: none !important;
  filter: none !important;
}
```

Then add the `no-gray` class to any element you want to keep in color.

**WP-CLI** — options can also be managed directly:

```bash
wp option update sgtgle_default_on 1
wp option update sgtgle_intensity 100
wp option update sgtgle_show_button 1
```

### ⚠️ Troubleshooting

- **Enabling grayscale didn't change my site** — check that intensity isn't set to `0`, and clear any stored visitor preference:
  ```js
  localStorage.removeItem('sgt_pref'); location.reload();
  ```
- **Does it work under a strict CSP?** Yes — since v1.1.1 there's no inline JS; the initial class/attributes are injected server-side.
- **Only want the shortcode, not the floating button?** Uncheck **Show floating toggle button** in settings, then place `[grayscale_toggle]` where you want it.
- **Conflicts with caching/CDN plugins?** Generally none — if changes don't show up, clear/purge your cache and CDN.

---

### ⚡ Changelog

| Version | Changes |
| --- | --- |
| 1.1.1 | CSP-safe: removed inline JS, moved bootstrap to server-side attribute/class injection |
| 1.1.0 | Added intensity control (0–100) and show/hide floating toggle button setting |
| 1.0.0 | Initial release with grayscale and front-end toggle button + shortcode |

### 📜 License

This project is licensed under the [MIT License](LICENSE).

### ✉️ Contact

**Natthasath Saksupanara** — Computer Technical Officer, NIDA  
natthasath.sak@gmail.com
