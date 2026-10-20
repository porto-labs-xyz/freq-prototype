# FREQ Design System

Source-derived draft 0.1.0, 20 October 2026.

Live design guide: **https://freq-prototype.vercel.app/design-system/**

[Interactive prototype](https://freq-prototype.vercel.app/) · [Editable Figma import kit](https://freq-prototype.vercel.app/figma/)

The companion prototype repository includes Vercel configuration, a static build and an editable Figma development plugin. The plugin creates seven mobile frames, one wide Gestures board, foundation paint styles and clickable navigation. Native Figma execution and visual QA remain unverified.

Extracted from the supplied FREQ.html Claude artifact. Open index.html for the visual guide. Tokens are in tokens/freq.tokens.json and reusable CSS in freq.css. Source SVGs are in assets.

## Foundations

Near-black canvas #0B0B0D, surface #121217, warm text #F4F2ED, lime #C8FF4D and warm orange #FF8A4C. Space Grotesk supplies display/body; IBM Plex Mono supplies metadata. The source uses 390 × 844 screens, 22px horizontal padding, 44px top padding, 6px card corners and circular pairing targets.

## Components

Room row: signal dot, room title, phone/track metadata, Join action.
Primary action: lime surface with dark text.
Pair target: concentric rings, circular core, connection instructions.
Taste selection: preference blocks feeding the room concept.
Room player: title, listener presence, set state and navigation to visualiser, submission and recap.
Gesture diagrams: retain source SVG geometry; pair each gesture with a named accessible action.

## Accessibility

Small 10px source labels need review before production; aim for at least 12px metadata and 44px touch targets. Maintain visible focus and reduced-motion alternatives. Do not encode state through colour alone. This extraction does not establish full WCAG conformance.

## Status

This is a new FREQ draft based on the supplied artifact, not a replacement release of Porto's existing system. No native Figma file or published library has been verified. Font licensing is retained in FONT-LICENSES.txt. Source screen claims about Bluetooth, rooms and music are illustrative. No backend is supplied.
