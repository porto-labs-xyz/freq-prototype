# Native Figma import

In Figma Desktop, open a new design file. Use Plugins > Development > Import plugin from manifest and select this folder's manifest.json. Run FREQ Source Import. It creates eight native editable frame trees and clickable navigation reactions.

This importer has passed JavaScript syntax checking only. It has not been executed in Figma. Review auto layout, text wrapping, absolute-position diagrams, fonts, gradients, radii, and overflow against the HTML originals. The converter is approximate and does not cover every CSS property. Font load failure falls back to Inter. Do not call the native prototype complete until all eight screens and links have been visually checked.
