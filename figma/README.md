# FREQ editable Figma import

1. Download and unzip freq-figma-import.zip from the web preview.
2. In Figma Desktop, open a design file. Choose Plugins > Development > Import plugin from manifest, then select manifest.json from the extracted folder.
3. Run FREQ Source Import. It creates seven 390 × 844 mobile frames, one 1240 × 620 Gestures board, six foundation paint styles and clickable screen navigation. Present the FREQ / Start a room flow.

The import creates native editable text, vector and frame nodes. No flattened screen screenshots or remote service are required. Install Space Grotesk and IBM Plex Mono for the closest match; unavailable fonts fall back to Inter and the plugin reports this.

Geometry is measured from the rendered HTML using npm run capture with the local server at port 8137. Absolute positions preserve the source arrangement; this is not a responsive auto-layout library. Browser taste selections, visual modes, gestures and pool state are local JavaScript interactions; the Figma import captures their initial states and links between screens.

Validation: the generated data, TypeScript API compatibility, plugin smoke run and all web screen links are checked in the repository. Execution and visual review inside Figma are still required. Font metrics and SVG import can differ from the browser. This package is an importable development plugin, not a .fig file or a published Figma library.

Figma API references: https://developers.figma.com/docs/plugins/manifest/ and https://developers.figma.com/docs/plugins/api/properties/nodes-reactions/.
