# FREQ Prototype

Six-feature interaction study, revision 3. Room → Show more → Pair → Start → Submit → Recap is the review and build order. Taste is optional and skippable; Profile is a stub; City radio is deferred.

The chrome frequency motif borrows the deck's liquid-metal direction. Room contains exactly four sections: what's playing, source, participants and picker. Every version names its source in the same view. Recap shares text describing actual local demo events and has no playlist-saving action.

Astra provides short feedback. Room swipes and buttons change demo tracks, play/pause state and attribution. Gesture buttons simulate open palm, swipes and thumbs up/down; the slider simulates volume. No camera recognition, audio, Bluetooth, shared rooms, rights verification or payments are connected. Track names, creators and licences are fictional sample metadata. Play records persist only in sessionStorage and do not establish production accounting.

The feature list explicitly covers automatic room building, picker recognition, lineage, recap, clean sourcing and free attributed listening. The proposed ten-second pairing is simulated.

## Figma

Nine editable frames with navigation, including the Show more sheet, optional Taste, Profile stub and gesture guide. Frame heights follow scrollable content. Current capture uses measured element geometry with approximate text boxes. Native Figma execution and visual QA remain unverified.

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
