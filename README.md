# FREQ Prototype

Live prototype: **https://freq-prototype.vercel.app/**

[Figma import instructions and download](https://freq-prototype.vercel.app/figma/) · [Design system](https://freq-prototype.vercel.app/design-system/)

Seven mobile screens at 390 × 844 and a 1240 × 620 Gestures board, derived from the supplied FREQ concept. Start → Taste → Pair → Room, with Visualiser, Pool and Recap accessible from the room. The preview provides direct links to every screen.

Taste choices, visual modes, density, bloom, flare and pool selection run in the browser. Taste and pool selections last for the browser session. Room discovery, Bluetooth pairing, music, accounts, Spotify and participant data are illustrative. No backend or audio playback is supplied.

## Figma

Download the kit from the live site, unzip it, and import figma/manifest.json through Figma Desktop's development-plugin menu. Run FREQ Source Import to create native editable text, vectors, frames, foundation paint styles and clickable navigation. See [figma/README.md](figma/README.md).

The import data uses measured browser geometry rather than screenshots. Native Figma execution and visual QA remain unverified; text metrics and SVG import can vary. Browser stateful interactions are captured at their initial state in Figma. This is not a published library or a .fig file.

## Develop, verify and deploy

Requires Node.js, Python 3 and the configured Vercel CLI.

```sh
npm ci
npm run dev
```

Open http://localhost:8137. In another terminal:

```sh
npx playwright install chromium
npm run capture
npm test
npm run build
vercel link --project freq-prototype
vercel deploy --prod
```

Capture regenerates figma/screens.json and figma/code.js from rendered screens. Tests cover browser navigation, template resolution, local state, mobile overflow, plugin frame content and links, and Figma API type compatibility. The API-shaped plugin harness does not replace running the plugin inside Figma.

Vercel serves dist/ using vercel.json. The static build includes the design guide and a downloadable plugin ZIP. No runtime framework or server is required. Keep FONT-LICENSES.txt when redistributing fonts. The bundled design-system/ directory is the hosted snapshot of [freq-design-system](https://github.com/porto-labs-xyz/freq-design-system).
