# SpaSegBench V10

SpaSegBench is a static demo for comparing spatial cell segmentation methods and exploring a rule-based method shortlist. Open `index.html` in a browser or serve this directory with a static web server.

V10 shows all 16 methods on the leaderboard: seven image-based methods and nine omics-based methods. Each track has its own ranking and visible chart, because their metrics cannot be compared directly. The supplied SpaSegBench logo is part of the page header, and the chart bars have a short entrance animation that respects reduced-motion preferences. Both tracks have category tabs, filters, quick picks, and matching-method counts. Omics filters use metadata available for those records: method family, platform prior, preview status, GPU requirement, and dataset coverage. The omics chart can display normalized utility or dataset coverage. On mobile, the tables show a compact ranking; open a method for more detail.

This package contains demonstration data. Records marked **Preview** use simulated values. The recommendation shortlist uses visible rules and does not calculate a match probability or use a learned predictor. Fields labeled as context do not affect the current demo shortlist.

Files: `index.html`, `styles.css`, `app.js`, and `assets/spasegbench-logo.png`.
