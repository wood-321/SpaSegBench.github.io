# SpaSegBench · SpaSegCompass v2

A buildless, English-language website for spatial cell segmentation evidence and conditional method selection. The recommendation specification is `../scheme_ver2.md`; it supersedes the older scoring rules in `scheme.md` and `plan.md`.

## Run and verify

From the repository root:

```sh
node scripts/preview.mjs
node scripts/verify.mjs
```

Preview: http://127.0.0.1:4173. No frontend dependencies or build step are required. Python with openpyxl is needed only to regenerate the benchmark data.

You can also open `index.html` directly from the `dist` folder. Keep the whole folder together: the gallery loads its bundled JavaScript manifest without fetching local JSON, so all 77 figures also work under `file://`.

## Living-paper layout · 2026-10-27

One continuous page: Overview, Leaderboard, Gallery, Downstream and Recommendation.
The header retains the GitHub and manuscript links, with blue, orange and gray styling.

- **Overview:** manuscript counts and illustrated input / evaluation diagrams. Figure 1c
  displays three side-by-side charts for Cells, Genes and Transcripts. Each platform bar
  is the arithmetic mean on a linear scale starting at zero; every supplied dataset is
  a separate interactive point (31 points per chart). The mean is labeled above its bar.
- **Leaderboard:** Figure 2-style bubble matrices retain both evidence tracks and
  platform / dataset / prior filters. Hover, focus or tap reveals measured values.
- **Resources:** vertical runtime, RAM and GPU-memory bars retain CPU/GPU filters and
  labels positioned above their respective bars. Folded source tables have been removed.
- **Gallery:** all 77 figures from the five supplied tissue archives, with tissue tabs,
  method filtering, horizontal scrolling, keyboard arrows and full-image viewing.
  Missing combinations are identified. There are no image or original-PDF downloads.
- **Downstream:** measured Figure 4f line profiles from `cum_points_data.csv`, with
  Myeloid, T-cell and Epi/Tumor selection, 150 samples per profile, method controls and
  tooltips. Its visible boundary reference table is retained; the CSV link is removed.
- **Recommendation:** the evidence engine and optional configuration inputs are
  unchanged. Source viewers, folded result tables and export actions are removed.
  Preparation notes and interpretation remain visible. The two expandable input
  groups are settings, not data viewers.

Chart points support keyboard focus and tap as well as hover. Gallery images load
lazily, retain their complete framing and have descriptive labels. Reduced motion
is supported. No frontend build step is required.

### Data scopes and replacement points

- `paper.js` / `paper.css`: page, interactive charts, gallery layout and styling.
- `assets/paper-data.js`: manuscript counts and method families; references the
  measurements imported into `assets/paper-measurements.js`.
- `scripts/import-paper-data.py`: imports the complete dataset statistics and corrected
  downstream curves. Source IDs remain separate from the older recommendation catalog.
- `scripts/import-gallery-atlas.py`: imports the five tissue archives and writes
  `assets/gallery/*.webp` plus synchronized `segmentation-results.json` / `.js` manifests.
- `data.js` / `engine.js`: quality and resource snapshot, recommendation calculations.
- `assets/paper/`: supplied manuscript and figures. Only the manuscript is linked in UI.

Validate with `node scripts/verify.mjs` and `node scripts/verify-paper.mjs`.
This is a local revision. Browser observation was blocked by the browser security
policy; asset review and standalone SVG rendering do not constitute browser QA.

## Data snapshot

2026-10-19: 403 source quality records, 399 primary records, 16 methods, 31 canonical datasets (merged from 47 quality-table labels), 451 successful resource measurements and 31 inventory entries. Two exact duplicates and two tuning variants remain in the source snapshot but do not receive primary weight. Dataset labels are not independent biological specimens.

The user confirmed Cellpose = CellposeSAM and Cellpose3 = Cellpose3-cyto3 for the corresponding resource measurements. Stable internal IDs remain `cellpose` and `cellpose3`.

```sh
python scripts/import-benchmark.py --s2 "/path/Supplementary_Table_S2.xlsx" --s3 "/path/Supplementary_Table_S3.xlsx" --resources "/path/segmentation_resources_all_methods_summary.csv" --inventory "/path/benchmarked_datasets_inventory_20261014.tsv"
node scripts/verify.mjs
```

The importer reads the original files without modifying them, then runs `scripts/normalize-datasets.mjs` using `dist/assets/dataset-catalog.json`. It writes `dist/data.js` and `reports/benchmark-audit.json`. SHA-256 source fingerprints, workbook rows, raw fields, metric statuses, reference independence and resource CSV rows are retained. Changing the input snapshot requires reviewing the adapter and reconciliation assertions.

## Recommendation behavior

Image axes: detection Fβ, Dice overlap, boundary F1 and instance quality (SQ/AJI/mDA). Transcript axes: detection Fβ, count agreement, expression profile and localization error including p95. Detection-focused profiles use β = 2.

The public website uses only metrics with a measured value for every method within its evidence track. In the current snapshot this keeps 19 image metrics and 17 transcript / multimodal metrics; overall correct assignment, assignment rate and coverage fraction are excluded. Ranking filters further require availability for every method represented in the selected scope. Recommendation weights retain the scheme_ver2 proportions among shared axes: the unsupported assignment axis is removed and the remaining profile weights sum to one. The internal source snapshot retains original values for provenance; download links are not displayed. Redundant measures do not receive extra weight: F1 and DQ are not separate axes, IoU is not counted again alongside Dice, and PQ is available as a diagnostic and optional floor. Zero and negative correlations are valid values.

Within-group rank utilities are descriptive. Groups separate track, canonical dataset, reference population, source reference where available, QV, variant and prior state. The recommender uses a shared method/group block, context weights and conservative axis-wise Pareto comparisons. It prefers an alternative with a complementary measured profile, subject to observed resource constraints.

Missing measurements are not reweighted away. Each absent contribution ranges from 0 to its original weight; lower/upper bounds and effective weighted coverage are shown. The comparator set stays fixed: missing measurements from another method also widen the possible rank of observed values. These are missing-evidence bounds, not confidence intervals or predictions. Unknown reference independence stays descriptive; concordant reference measurements are excluded from accuracy utility. A prior does not blanket-mask otherwise independent measures.

External-prior and generated-nuclear-prior workflows are separate configurations. Their quality is not borrowed from platform-prior runs. The UI supports whole-cell targets only. The engine retains its conservative handling of nucleus, 3D and H&E requests; these do not inherit unverified performance rankings. New platforms remain eligible for conditional guidance when inputs are compatible. Invalid requests, incompatible inputs, independent historical quality-floor violations, and budgets unsupported by observed runs produce explicit diagnostic or pilot states.

## Resource interpretation

Runtime covers the executed preprocessing/prior generation, training, segmentation and postprocessing. All supplied rows are successful runs; missing rows are not counted as failures. RAM is task peak occupancy. VRAM is per-card peak, and zero means no GPU was used.

Reference server: two Intel Xeon Gold 6458Q processors (64 physical cores total), approximately 1 TiB RAM, eight RTX 4090 D GPUs (24,564 MiB each), Ubuntu 22.04.5 LTS. CPU-only and GPU-used records are preserved and summarized separately. A displayed overall median describes a historical mixture, never an execution forecast.

388 resource rows have method/dataset-name matches to quality records; none is verified to be the same ROI, configuration and run. Therefore the site does not claim a calibrated quality–cost score, workload-to-runtime scaling or cross-hardware speed conversion. RAM, per-card VRAM and time limits prioritize observed configurations that fit, while feasibility for new data remains conditional. Strict budgets with no matching observed configuration return a pilot/adaptation state.

Inventory fields retain their scopes. Parent-sample cell counts do not become ROI densities; panel size is not transcript count; source pixels are not processed workload. Confirmed metadata informs platform/tissue/species/panel context; unresolved workload and staining features are disclosed.

## Tissue visualization atlas

Run `python scripts/import-gallery-atlas.py` from the project root using Python with
Pillow and pypdf, plus Poppler's `pdftoppm`. It imports all 77 PDFs from these archives
in `paper and figs`: MERFISH colon (15), MERFISH liver (16), Xenium breast cancer (16),
Xenium ccRCC (14), and Xenium lymph node (16).

Each full preview is rendered at a 2,000-pixel longest edge, with a 720-pixel thumbnail.
Both are lossless WebP. PDFs remain unchanged in their original archives. The import
report at `reports/gallery-atlas-import.json` records each archive member and SHA-256.
The PDF pages contain no extractable dataset titles: labels come from the supplied
archive names. No identity is inferred for a specific MERFISH sample or ROI.

The synchronized manifests contain unique figure IDs, method IDs, `galleryGroup`,
`platform`, `tissue`, `datasetLabel`, local image/thumbnail paths and image dimensions.
They contain no public PDF/download path. Multiple figures per method are supported.
The `.js` manifest enables direct `file://` viewing without fetching JSON.

## Validation and release status

The paper update imports `paper and figs/dataset_statistics_recovered.csv` and the corrected `paper and figs/cum_points_data.csv` using `scripts/import-paper-data.py`. Regenerate `assets/paper-measurements.js` and the internal `assets/paper-tables/*.csv` copies with the bundled Python runtime. The original CSVs remain unchanged; workstation paths are omitted from the bundled dataset copy. The new dataset statistics are used only for Figure 1c; their source IDs and metadata are independent of the older recommendation catalog.

Figure 1c displays Cells, Genes and Transcripts simultaneously. Figure 4f plots 46 measured foreign-transcript profiles for Myeloid, T cells and Epi/Tumor, with 150 samples per curve at the supplied bin midpoints (−9.95 to +3.3 µm). The importer selects `mode=boundary`, `x_unit=um`; normalized relative-distance rows remain in the source copy but are not mixed into this axis. It preserves all foreign and own cumulative values and checks cumulative counts against cell counts and bin increments. The 0 µm reference uses the flagged bin ending at 0 (midpoint −0.05); the +3 µm reference uses the bin ending at +3, not the final +3.3 midpoint. CelloType and DISSECT have no Epi/Tumor row. The earlier summary file and synthetic demo curves are no longer used. See `../reports/paper-update-20261026.md` for the current revision.

The Overview uses a centered SpaSegBench title, manuscript subtitle and introduction. Three illustrated input → method → output lanes explain the method families; four schematic panels explain the evaluation dimensions. The illustrations are conceptual, not measured data or microscopy images. Their SVG sources are bundled under `assets/overview/` and can be regenerated with `node scripts/build-overview-art.mjs` from the project root. Method names are static labels. Hero action buttons, original-figure links, the dataset-download button and the leaderboard method-track selector have been removed; the leaderboard always shows all available methods.

`scripts/verify.mjs` checks source reconciliation, scoring, missingness, provenance gates, resource modes, constraints, representative recommendation scenarios, English markup, event handlers, escaping, gallery paths, mode routing, comparison values and retained optional inputs. It writes `reports/implementation-verification.json`.

See `../reports/gallery-update-20261027.md` for this revision. All 29 verification checks and 60 recommendation scenarios pass, including direct-file gallery loading without fetch. These changes are local; this revision has not been published or pushed to a hosted Site.

## Dataset reconciliation

`assets/dataset-catalog.json` is the shared 31-dataset identity map. Re-run `node scripts/normalize-datasets.mjs` after updating aliases, or regenerate through the importer. Original names, source groups, metrics, flags and run-verification status remain available. Alias matching does not assert the same ROI or executed configuration.

The corrected user-supplied README (2026-10-22) is now the identity reference. Its SHA-256 and the original dataset links/titles are recorded in the catalog. The order within each platform defines numbered aliases: Xenium 8 = kidney, 9 = skin, 10 = SPATCH; MERFISH 5/6 = colon 1/2 and 11/12 = prostate 1/2. All 31 numbered aliases resolve to unique canonical datasets, and dropdowns follow this order.

Two resource-only Stereo-seq labels are still not defined by the README: `stereo_e16.5_e1s3` and `stereo_mouse_brain` (22 rows). These retain `datasetRaw` and a null canonical `datasetId`; they are not guessed to be E2S7 or embryo. The other 41 resource rows without a quality match have valid dataset identities but no quality record for that method/dataset combination. See `../reports/dataset-reconciliation.json`.

See `reports/materials-needed.md` for remaining evidence gaps. The present application is a rules-and-evidence recommender, not a trained or independently validated prediction model.

## English presentation

All site copy, controls and evidence notes are displayed in English. `assets/source-notes-en.js` provides reading translations for the 2026-10-19 snapshot, without modifying the source data. Numeric statements in notes retain the source values, including inconsistencies; metric statuses remain authoritative. Text accidentally occupying numeric source cells is identified as source text and explained in the translated note. Original records remain in the local source snapshot; the UI has no original-record downloads. Regenerated source snapshots require translation review.
