# Design System Specification: The Ethereal Monolith

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Ethereal Monolith."** 

Moving away from the cluttered, high-contrast energy of typical dark modes, this system prioritizes psychological safety and premium stillness. It is an editorial approach to digital wellness. We break the "template" look by favoring **intentional asymmetry** and **tonal depth** over rigid grids. Elements should feel like they are floating in a fluid, high-end gallery space rather than being locked into a spreadsheet. By using normal white space (see Spacing Scale) and soft, overlapping glass layers, we create a UI that feels "quiet" but authoritative.

## 2. Color Strategy & Tonal Architecture
We have purged all traditional "UI Blues" in favor of a palette rooted in deep charcoal, slate, and warm, organic accents.

### The "No-Line" Rule
Standard 1px solid borders are strictly prohibited for sectioning. Definition must be achieved through **background color shifts**. 
*   **Example:** A `surface-container-low` (#131313) card should sit on a `surface` (#0e0e0e) background. The transition should be felt, not seen.

### Surface Hierarchy & Nesting
Treat the interface as a physical stack of semi-transparent materials.
*   **Base:** `surface` (#0e0e0e)
*   **Deep Recess:** `surface-container-lowest` (#000000) for deep inset areas.
*   **Floating Layers:** `surface-container-high` (#1f2020) or `surface-container-highest` (#252626).
*   **Nesting:** When placing a container within a container, always move one step "higher" or "lower" in the tier to create a soft, natural lift without relying on drop shadows.

### The "Glass & Gradient" Rule
To achieve the "Apple glass" aesthetic, floating elements (modals, navigation bars) must use **Glassmorphism**:
*   **Fill:** `surface-variant` (#252626) at 60-80% opacity.
*   **Effect:** `backdrop-filter: blur(20px)`.
*   **Signature Texture:** Use a subtle linear gradient for primary CTAs, transitioning from `primary` (#9500ff) to `primary-container` (#51405f) at a 135-degree angle. This adds "soul" and prevents the UI from looking flat or "default."

## 3. Typography: Lexend Editorial
We utilize **Lexend** across all levels to maintain a friendly yet sophisticated tone. The low-contrast nature of Lexend at large scales provides a "Safe Mental Space."

*   **Display (lg/md):** Reserved for moments of high emotional impact. Use `display-lg` (3.5rem) with `-0.02em` letter spacing to create a bespoke, "tight" editorial look.
*   **Headlines:** Use `headline-sm` (1.5rem) for most section headers. Pair these with generous top-padding (8-10 on the Spacing Scale) to allow the typography to breathe.
*   **The Hierarchy Shift:** To convey premium quality, use `label-md` (0.75rem) in all-caps with `0.1em` letter spacing for small metadata. This contrasts against the roundness of Lexend and adds an "architectural" feel to the data.

## 4. Elevation & Depth: Tonal Layering
We move away from structural lines. Depth is a matter of light and opacity.

*   **The Layering Principle:** Avoid shadows on static cards. Instead, use the `surface-container` tiers. A `surface-container-low` element on a `surface-dim` base creates a sophisticated, "flat-depth" look.
*   **Ambient Shadows:** For elevated elements like floating menus, use a "Tinted Shadow." Instead of black, use `on-surface` (#e7e5e5) at 4% opacity with a `40px` blur. This simulates light passing through glass rather than a heavy object casting a shadow.
*   **The Ghost Border Fallback:** If a boundary is required for accessibility, use the "Ghost Border" technique: `outline-variant` (#484848) at **15% opacity**. It should be a mere whisper of a line.

## 5. Components & Primitive Styling

### Buttons
*   **Primary:** A gradient fill from `primary` to `primary_container`. Text color: `on_primary` (#4a3a58). Corner radius: `full` (9999px) to maintain the "soft" brand identity.
*   **Secondary:** No fill. `Ghost Border` (15% opacity `outline-variant`) with `secondary` (#b8987a) text.
*   **Tertiary:** Pure text using `primary` color, no background, high horizontal padding.

### Cards & Lists
*   **No Dividers:** Horizontal lines are banned. Separate list items using `spacing-2` (1rem) or a subtle shift to `surface-container-low`.
*   **Interactive Cards:** Use `surface-container` with a `lg` (1rem) corner radius. On hover, transition the background to `surface-bright` (#2b2c2c).

### Input Fields
*   **Styling:** Use `surface-container-highest` (#252626) for the input track.
*   **Focus State:** Do not use a heavy border. Use a 1px "Ghost Border" of `primary` (#9500ff) and a subtle inner glow.
*   **Error State:** Use `error` (#ee7d77) only for the text and a very faint `error_container` tint for the background.

### Suggested Component: The "Peace Header"
A large-scale header (using `display-md`) that utilizes a blurred "Lavender-to-Peach" gradient blob in the background (using `primary` and `secondary` tokens at 10% opacity) to signify the start of a "Safe Space" session.

## 6. Do’s and Don’ts

| Do | Don't |
| :--- | :--- |
| **Do** use `20` (7rem) spacing for major section breaks to create a premium, unhurried feel. | **Don't** use standard 16px or 24px margins; it feels crowded and "SaaS-like." |
| **Do** overlap elements (e.g., a glass card partially over a headline) to create depth. | **Don't** align everything to a rigid, predictable vertical grid. |
| **Do** use `Lexend` at `body-lg` for readability in dark mode. | **Don't** use pure white (#FFFFFF) for text; use `on_surface` (#e7e5e5) to reduce eye strain. |
| **Do** use `backdrop-filter: blur` on all overlays. | **Don't** use solid, opaque backgrounds for modals or navigation bars. |