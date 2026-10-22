# SpaSegBench · SpaSegCompass v2

A buildless, English-language website for spatial cell segmentation evidence and conditional method selection. The recommendation specification is `../scheme_ver2.md`; it supersedes the older scoring rules in `scheme.md` and `plan.md`.

## Run and verify

From the repository root:

```sh
node scripts/preview.mjs
node scripts/verify.mjs
```

Preview: http://127.0.0.1:4173. No frontend dependencies or build step are required. Python with openpyxl is needed only to regenerate the benchmark data.

## Views

- The homepage introduction summarizes the supplied project README, with the original logo surrounded by decorative cell boundaries and transcript dots. Paper and GitHub buttons remain disabled placeholders until URLs are added to `projectLinks` in `app.js`.
- `#/`: two-column leaderboard without method icons or search. Image methods default to PQ; transcript / multimodal methods default to detection F1. The upper-right metric, platform, dataset and prior selectors update the heading, zero-based bar chart, ranking and method detail dialog together. Error metrics sort ascending. Values are descriptive medians over the selected records; utility uses its existing mean and dataset coverage counts canonical datasets.
- The gallery is directly below the leaderboard. Dataset and method filters cover 16 methods × 31 canonical datasets. Original, overlay and mask views, image enlargement, lazy loading and 12-set pagination support large collections. No scientific images are fabricated; the supplied manifest is currently empty.
- `#/recommend`: SpaSegCompass retains its whole-cell recommendation rules, source records and optional conditions. The enlarged rounded Leaderboard / Recommend switch keeps its sliding active background.
- `#/visuals` and `#/explore` remain available for gallery and catalog access.

Native dialogs support keyboard dismissal; visible focus and reduced-motion styles are retained. The leaderboard stacks into one column on small screens. No external frontend dependency or build step is required.

## Data snapshot

2026-10-19: 403 source quality records, 399 primary records, 16 methods, 31 canonical datasets (merged from 47 quality-table labels), 451 successful resource measurements and 31 inventory entries. Two exact duplicates and two tuning variants remain inspectable but do not receive primary weight. Dataset labels are not independent biological specimens.

The user confirmed Cellpose = CellposeSAM and Cellpose3 = Cellpose3-cyto3 for the corresponding resource measurements. Stable internal IDs remain `cellpose` and `cellpose3`.

```sh
python scripts/import-benchmark.py --s2 "/path/Supplementary_Table_S2.xlsx" --s3 "/path/Supplementary_Table_S3.xlsx" --resources "/path/segmentation_resources_all_methods_summary.csv" --inventory "/path/benchmarked_datasets_inventory_20261014.tsv"
node scripts/verify.mjs
```

The importer reads the original files without modifying them, then runs `scripts/normalize-datasets.mjs` using `dist/assets/dataset-catalog.json`. It writes `dist/data.js` and `reports/benchmark-audit.json`. SHA-256 source fingerprints, workbook rows, raw fields, metric statuses, reference independence and resource CSV rows are retained. Changing the input snapshot requires reviewing the adapter and reconciliation assertions.

## Recommendation behavior

Image axes: detection Fβ, Dice overlap, boundary F1 and instance quality (SQ/AJI/mDA). Transcript axes: detection Fβ, count agreement, expression profile and localization error including p95. Detection-focused profiles use β = 2.

The public website uses only metrics with a measured value for every method within its evidence track. In the current snapshot this keeps 19 image metrics and 17 transcript / multimodal metrics; overall correct assignment, assignment rate and coverage fraction are excluded. Ranking filters further require availability for every method represented in the selected scope. Recommendation weights retain the scheme_ver2 proportions among shared axes: the unsupported assignment axis is removed and the remaining profile weights sum to one. Source downloads retain original values for provenance. Redundant measures do not receive extra weight: F1 and DQ are not separate axes, IoU is not counted again alongside Dice, and PQ is available as a diagnostic and optional floor. Zero and negative correlations are valid values.

Within-group rank utilities are descriptive. Groups separate track, canonical dataset, reference population, source reference where available, QV, variant and prior state. The recommender uses a shared method/group block, context weights and conservative axis-wise Pareto comparisons. It prefers an alternative with a complementary measured profile, subject to observed resource constraints.

Missing measurements are not reweighted away. Each absent contribution ranges from 0 to its original weight; lower/upper bounds and effective weighted coverage are shown. The comparator set stays fixed: missing measurements from another method also widen the possible rank of observed values. These are missing-evidence bounds, not confidence intervals or predictions. Unknown reference independence stays descriptive; concordant reference measurements are excluded from accuracy utility. A prior does not blanket-mask otherwise independent measures.

External-prior and generated-nuclear-prior workflows are separate configurations. Their quality is not borrowed from platform-prior runs. The UI supports whole-cell targets only. The engine retains its conservative handling of nucleus, 3D and H&E requests; these do not inherit unverified performance rankings. New platforms remain eligible for conditional guidance when inputs are compatible. Invalid requests, incompatible inputs, independent historical quality-floor violations, and budgets unsupported by observed runs produce explicit diagnostic or pilot states.

## Resource interpretation

Runtime covers the executed preprocessing/prior generation, training, segmentation and postprocessing. All supplied rows are successful runs; missing rows are not counted as failures. RAM is task peak occupancy. VRAM is per-card peak, and zero means no GPU was used.

Reference server: two Intel Xeon Gold 6458Q processors (64 physical cores total), approximately 1 TiB RAM, eight RTX 4090 D GPUs (24,564 MiB each), Ubuntu 22.04.5 LTS. CPU-only and GPU-used records are preserved and summarized separately. A displayed overall median describes a historical mixture, never an execution forecast.

388 resource rows have method/dataset-name matches to quality records; none is verified to be the same ROI, configuration and run. Therefore the site does not claim a calibrated quality–cost score, workload-to-runtime scaling or cross-hardware speed conversion. RAM, per-card VRAM and time limits prioritize observed configurations that fit, while feasibility for new data remains conditional. Strict budgets with no matching observed configuration return a pilot/adaptation state.

Inventory fields retain their scopes. Parent-sample cell counts do not become ROI densities; panel size is not transcript count; source pixels are not processed workload. Confirmed metadata informs platform/tissue/species/panel context; unresolved workload and staining features are disclosed.

## Add images

Place assets in `dist/assets/segmentations/` and append records to `dist/assets/segmentation-results.json`:

```json
{
  "id": "cellpose-xenium1-roi01",
  "methodId": "cellpose",
  "datasetId": "xenium_1",
  "platform": "Xenium",
  "sample": "ROI 01",
  "alt": "CellposeSAM segmentation in Xenium ROI 01",
  "images": {
    "original": "assets/segmentations/roi01-original.png",
    "overlay": "assets/segmentations/roi01-overlay.png",
    "mask": "assets/segmentations/roi01-mask.png"
  }
}
```

IDs must be unique; method/dataset/platform must match the catalog. Dataset IDs may use a canonical name or any alias from `assets/dataset-catalog.json`; aliases are normalized when images load. At least one supported PNG/JPG/WebP/AVIF asset is required. Missing views are labeled explicitly. Only relative paths within assets are accepted. Keep coordinate extent and image dimensions consistent across a set.

## Validation and release status

`scripts/verify.mjs` checks source reconciliation, scoring, missingness, provenance gates, resource modes, constraints, representative recommendation scenarios, English markup, event handlers, escaping, gallery paths, mode routing, comparison values and retained optional inputs. It writes `reports/implementation-verification.json`.

See `../reports/leaderboard-redesign-20261022.md` and the saved previews for this revision. All 26 verification checks and 60 recommendation scenarios pass. These changes are local; this revision has not been published or pushed to a hosted Site.

## Dataset reconciliation

`assets/dataset-catalog.json` is the shared 31-dataset identity map. Re-run `node scripts/normalize-datasets.mjs` after updating aliases, or regenerate through the importer. Original names, source groups, metrics, flags and run-verification status remain available. Alias matching does not assert the same ROI or executed configuration.

The corrected user-supplied README (2026-10-22) is now the identity reference. Its SHA-256 and the original dataset links/titles are recorded in the catalog. The order within each platform defines numbered aliases: Xenium 8 = kidney, 9 = skin, 10 = SPATCH; MERFISH 5/6 = colon 1/2 and 11/12 = prostate 1/2. All 31 numbered aliases resolve to unique canonical datasets, and dropdowns follow this order.

Two resource-only Stereo-seq labels are still not defined by the README: `stereo_e16.5_e1s3` and `stereo_mouse_brain` (22 rows). These retain `datasetRaw` and a null canonical `datasetId`; they are not guessed to be E2S7 or embryo. The other 41 resource rows without a quality match have valid dataset identities but no quality record for that method/dataset combination. See `../reports/dataset-reconciliation.json`.

See `reports/materials-needed.md` for remaining evidence gaps. The present application is a rules-and-evidence recommender, not a trained or independently validated prediction model.

## English presentation

All site copy, controls and evidence notes are displayed in English. `assets/source-notes-en.js` provides reading translations for the 2026-10-19 snapshot, without modifying the source data. Numeric statements in notes retain the source values, including inconsistencies; metric statuses remain authoritative. Text accidentally occupying numeric source cells is identified as source text and explained in the translated note. Each annotated record offers an original JSON download for provenance. Regenerated source snapshots require translation review.
