# SpaSegBench V10

SpaSegBench is a static demo for comparing spatial cell segmentation methods and exploring a rule-based method shortlist. Open `index.html` in a browser or serve this directory with a static web server.

V10 shows all 16 methods in one leaderboard: seven image-based methods and nine omics or multimodal methods. In **All methods**, the common dataset-coverage count determines order; equal counts share a rank. This is evidence coverage, not a cross-track performance comparison. The image and omics / multimodal selections retain their own metrics, filters, quick picks, charts and within-track ranking. Omics / multimodal filters use metadata available for those records: method family, platform prior, preview status, GPU requirement, and dataset coverage. The supplied SpaSegBench logo appears in the page header, and chart bars have a short entrance animation that respects reduced-motion preferences. On mobile, the unified table shows a compact ranking; open a method for more detail.

This package contains demonstration data. Records marked **Preview** use simulated values. The recommendation shortlist uses visible rules and does not calculate a match probability or use a learned predictor. Fields labeled as context do not affect the current demo shortlist.

Files: `index.html`, `styles.css`, `app.js`, and `assets/spasegbench-logo.png`.
