const methods = [
  { id: 'cellotype', name: 'Cellotype', family: 'Domain-specific', short: 'Tissue-specific model', track: 'image', score: 0.76, pq: 0.75, dice: 0.85, ap50: 0.82, speed: 2.8, vram: 9.6, datasets: 4, summary: 'A tissue-specific baseline for structured morphology comparisons.', worksFor: ['Tissue-specific baselines', 'Dense fields', 'Documentation-led evaluation'], notes: 'Useful as a structured tissue baseline; coverage is narrower.', version: '0.3.0', license: 'MIT', framework: 'PyTorch', gpu: 'Required', prior: false },
  { id: 'cellsam', name: 'CellSAM', family: 'Foundation', short: 'Cell foundation model', track: 'image', score: 0.82, pq: 0.82, dice: 0.89, ap50: 0.87, speed: 3.1, vram: 11.2, datasets: 7, summary: 'A high-capacity foundation model for diverse cell morphologies.', worksFor: ['Strong generalization', 'Spatial transfer', 'Whole-cell segmentation'], notes: 'Useful when generalization is more important than runtime.', version: 'v1.0.2', license: 'MIT', framework: 'PyTorch', gpu: 'Required', prior: false },
  { id: 'cellpose-3', name: 'Cellpose-3', family: 'General', short: 'Generalist segmentation', track: 'image', score: 0.78, pq: 0.77, dice: 0.87, ap50: 0.84, speed: 1.3, vram: 4.3, datasets: 6, summary: 'Preview record for the Cellpose-3 benchmark entry.', worksFor: ['General-purpose baseline', 'Whole-cell segmentation', 'Fast inference'], notes: 'Preview metrics are simulated until benchmark measurements are uploaded.', version: 'preview', license: 'TBD', framework: 'PyTorch', gpu: 'Optional', prior: false, simulated: true },
  { id: 'cellpose-sam', name: 'Cellpose-SAM', family: 'Foundation', short: 'Foundation model', track: 'image', score: 0.84, pq: 0.84, dice: 0.91, ap50: 0.89, speed: 2.3, vram: 8.4, datasets: 8, summary: 'Strong cross-dataset performance with a broad whole-cell profile.', worksFor: ['General-purpose', 'Whole-cell segmentation', 'Cross-dataset transfer'], notes: 'Best default when morphology and assay conditions are varied.', version: 'v0.1.4', license: 'BSD-3-Clause', framework: 'PyTorch', gpu: 'Recommended', prior: false },
  { id: 'stardist', name: 'StarDist 2D', family: 'Nucleus', short: '2D instance segmentation', track: 'image', score: 0.79, pq: 0.78, dice: 0.88, ap50: 0.86, speed: 0.6, vram: 3.2, datasets: 6, summary: 'Fast, precise instance segmentation for round and compact nuclei.', worksFor: ['Nucleus segmentation', 'Fast inference', 'Low memory use'], notes: 'A strong nucleus baseline; less suited to irregular whole cells.', version: '0.8.6', license: 'BSD-3-Clause', framework: 'TensorFlow', gpu: 'Optional', prior: false },
  { id: 'mesmer', name: 'Mesmer', family: 'Domain-specific', short: 'Multiplex tissue model', track: 'image', score: 0.81, pq: 0.83, dice: 0.90, ap50: 0.88, speed: 1.4, vram: 6.9, datasets: 5, summary: 'A tissue-aware model for multiplexed and membrane-rich imaging.', worksFor: ['Multiplex imaging', 'Dense tissue', 'Whole-cell segmentation'], notes: 'Best aligned with dense multiplex images and paired membrane channels.', version: '0.2.3', license: 'Apache-2.0', framework: 'TensorFlow', gpu: 'Required', prior: false },
  { id: 'unseg', name: 'UNSEG', family: 'General', short: 'Universal segmentation', track: 'image', score: 0.74, pq: 0.74, dice: 0.84, ap50: 0.81, speed: 2.1, vram: 6.2, datasets: 4, summary: 'Preview record for the UNSEG benchmark entry.', worksFor: ['General-purpose baseline', 'Whole-cell segmentation', 'Cross-dataset screening'], notes: 'Preview metrics are simulated until benchmark measurements are uploaded.', version: 'preview', license: 'TBD', framework: 'PyTorch', gpu: 'Recommended', prior: false, simulated: true },
  { id: 'ucs', name: 'UCS', family: 'Domain-specific', short: 'Platform-prior method', track: 'molecule', score: 0.88, overall: 0.87, f1: 0.994, speed: null, vram: null, datasets: 3, summary: 'A molecule-track method with full coverage in the current platform-prior snapshot.', worksFor: ['Molecule assignment', 'Platform-integrated workflows'], notes: 'Detection evidence is masked when the platform prior is used.', version: 'demo snapshot', license: 'Research', framework: 'Python', gpu: 'Optional', prior: true },
  { id: 'boms', name: 'BOMS', family: 'General', short: 'Molecule segmentation', track: 'molecule', score: 0.68, overall: 0.67, f1: 0.771, speed: null, vram: null, datasets: 3, summary: 'A coverage-limited molecule-track baseline in the current snapshot.', worksFor: ['Baseline reference', 'Quantification metrics'], notes: 'Partial coverage and some metrics are not computed.', version: 'demo snapshot', license: 'Research', framework: 'Python', gpu: 'Optional', prior: false },
  { id: 'comseg', name: 'ComSeg', family: 'General', short: 'Molecule segmentation', track: 'molecule', score: 0.77, overall: 0.76, f1: 0.861, speed: null, vram: null, datasets: 4, summary: 'Preview record for the ComSeg benchmark entry.', worksFor: ['Molecule assignment', 'Spatial transcriptomics', 'Quantification metrics'], notes: 'Preview metrics are simulated until benchmark measurements are uploaded.', version: 'preview', license: 'TBD', framework: 'Python', gpu: 'Optional', prior: false, simulated: true },
  { id: 'genesegnet', name: 'GeneSegNet', family: 'General', short: 'Molecule segmentation', track: 'molecule', score: 0.72, overall: 0.71, f1: 0.812, speed: null, vram: null, datasets: 4, summary: 'A molecule-track method evaluated with detection and localization metrics.', worksFor: ['Detection metrics', 'Localization metrics'], notes: 'Partial dataset coverage in the current evidence snapshot.', version: 'demo snapshot', license: 'Research', framework: 'Python', gpu: 'Optional', prior: false },
  { id: 'proseg', name: 'Proseg', family: 'Domain-specific', short: 'Platform-prior method', track: 'molecule', score: 0.91, overall: 0.90, f1: 0.997, speed: null, vram: null, datasets: 3, summary: 'A molecule-track method whose detection scores rely on platform segmentation priors.', worksFor: ['Platform-integrated workflows', 'Molecule assignment'], notes: 'Detection evidence is masked when the platform prior is used.', version: 'demo snapshot', license: 'Research', framework: 'Python', gpu: 'Optional', prior: true },
  { id: 'baysor', name: 'Baysor', family: 'General', short: 'Molecule segmentation', track: 'molecule', score: 0.70, overall: 0.69, f1: 0.794, speed: null, vram: null, datasets: 4, summary: 'Preview record for the Baysor benchmark entry.', worksFor: ['Transcript assignment', 'Spatial transcriptomics', 'Baseline comparison'], notes: 'Preview metrics are simulated until benchmark measurements are uploaded.', version: 'preview', license: 'TBD', framework: 'Python', gpu: 'Optional', prior: false, simulated: true },
  { id: 'bering', name: 'Bering', family: 'Domain-specific', short: 'Spatial molecule model', track: 'molecule', score: 0.73, overall: 0.72, f1: 0.821, speed: null, vram: null, datasets: 3, summary: 'Preview record for the Bering benchmark entry.', worksFor: ['Spatial transcriptomics', 'Molecule assignment', 'Context-aware segmentation'], notes: 'Preview metrics are simulated until benchmark measurements are uploaded.', version: 'preview', license: 'TBD', framework: 'Python', gpu: 'Recommended', prior: false, simulated: true },
  { id: 'cellist', name: 'Cellist', family: 'General', short: 'Molecule segmentation', track: 'molecule', score: 0.75, overall: 0.74, f1: 0.845, speed: null, vram: null, datasets: 5, summary: 'A molecule-track baseline with broad coverage across spatial assays.', worksFor: ['Broad assay coverage', 'Quantification metrics'], notes: 'Results vary by protocol; runtime is not measured in this snapshot.', version: 'demo snapshot', license: 'Research', framework: 'Python', gpu: 'Optional', prior: false },
  { id: 'dissect', name: 'DISSECT', family: 'Domain-specific', short: 'Spatial segmentation', track: 'molecule', score: 0.71, overall: 0.70, f1: 0.803, speed: null, vram: null, datasets: 3, summary: 'Preview record for the DISSECT benchmark entry.', worksFor: ['Spatial transcriptomics', 'Molecule assignment', 'Quantification metrics'], notes: 'Preview metrics are simulated until benchmark measurements are uploaded.', version: 'preview', license: 'TBD', framework: 'Python', gpu: 'Optional', prior: false, simulated: true }
];

const datasets = [
  { id: 'tissuenet', name: 'TissueNet', modality: 'Fluorescence microscopy', tissue: 'Mixed', species: 'Human', track: 'image', platform: 'Microscopy', count: '5 methods', description: 'A fluorescence reference set for whole-cell segmentation.' },
  { id: 'cosmx-lung', name: 'CosMx Lung', modality: 'Multiplex imaging', tissue: 'Lung', species: 'Human', track: 'image', platform: 'CosMx', count: '5 methods', description: 'Dense multiplex imaging benchmark with multiple segmentation baselines.' },
  { id: 'xenium-lung', name: 'Xenium Lung', modality: 'Spatial transcriptomics', tissue: 'Lung', species: 'Human', track: 'molecule', platform: 'Xenium', count: '17 datasets', description: 'Molecule-track benchmark on lung tissue with platform-aware QC.' },
  { id: 'xenium-breast', name: 'Xenium Breast', modality: 'Spatial transcriptomics', tissue: 'Breast', species: 'Human', track: 'molecule', platform: 'Xenium', count: '12 methods', description: 'A breast tissue query used in the recommendation demo.' },
  { id: 'xenium-3', name: 'Xenium 3', modality: 'Spatial transcriptomics', tissue: 'Lymph node', species: 'Human', track: 'molecule', platform: 'Xenium', count: '7 methods', description: 'A comparability-sensitive dataset with GT source issues flagged.' },
  { id: 'merfish-prostate', name: 'MERFISH Prostate', modality: 'Spatial transcriptomics', tissue: 'Prostate', species: 'Human', track: 'molecule', platform: 'MERFISH', count: '5 sections', description: 'Five slices currently mapped to one unconfirmed biological specimen.' },
  { id: 'merfish-liver', name: 'MERFISH Liver', modality: 'Spatial transcriptomics', tissue: 'Liver', species: 'Human', track: 'molecule', platform: 'MERFISH', count: '2 sections', description: 'Two liver sections with specimen membership awaiting confirmation.' },
  { id: 'stereo-brain', name: 'Stereo Brain', modality: 'Spatial transcriptomics', tissue: 'Brain', species: 'Mouse', track: 'molecule', platform: 'Stereo-seq', count: '4 methods', description: 'A platform slice with partial method coverage.' }
];

const state = {
  category: 'Overall',
  filters: { modality: 'All modalities', dataset: 'All datasets', tissue: 'All tissues', metric: 'Overall score' },
  moreOpen: false,
  openFilter: null,
  quickPick: '',
  more: { target: 'All targets', dimensionality: '2D', training: 'Any training', gpu: 'Any GPU', density: 'All densities', morphology: 'All morphologies' },
  exploreTab: 'Methods',
  exploreQuery: '',
  exploreFilter: 'All',
  recommendMode: 'quick',
  recommendVisible: false,
  recommend: { platform: 'Xenium', tissue: 'Breast', goal: 'Quantification', prior: true, track: 'Molecule', target: 'Whole cell', transcriptDensity: '1.8', transcripts: '32000000', genes: '313', nnDistance: '6.4', gpu: 'Available', memory: '64', runtime: '6', priority: 'Generalization' },
  drawer: null,
  highlighted: null,
  sortKey: 'score',
  sortDir: 'desc'
};
let renderedRoute = null;

const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
const pct = (value) => value == null ? '—' : Math.round(value * 100) + '%';
const num = (value, digits) => value == null ? '—' : Number(value).toFixed(digits == null ? 2 : digits);
const methodById = (id) => methods.find((m) => m.id === id);
const datasetById = (id) => datasets.find((d) => d.id === id);
const h = (...parts) => parts.join('');
const currentRoute = () => {
  const value = location.hash.replace(/^#\/?/, '');
  return value === 'benchmark' || value === '' ? 'leaderboard' : value;
};
const imageMethods = () => methods.filter((m) => m.track === 'image');
const familyClass = (m) => m.family === 'Foundation' ? 'foundation' : m.family === 'Nucleus' ? 'nucleus' : m.family === 'Domain-specific' ? 'domain' : '';
const icon = (kind) => ({ microscope: '◌', spatial: '⌘', nucleus: '●', whole: '◯', speed: '↯', memory: '▤', target: '◎', layers: '▦' }[kind] || '·');

const filterDefs = [
  { key: 'modality', label: 'Modality', icon: '⌁', options: ['All modalities', 'Fluorescence microscopy', 'Multiplex imaging', 'Spatial transcriptomics', 'H&E pathology'] },
  { key: 'dataset', label: 'Dataset', icon: '▦', options: ['All datasets', 'TissueNet', 'CosMx Lung', 'Xenium Lung', 'MERFISH Prostate'] },
  { key: 'tissue', label: 'Tissue', icon: '◌', options: ['All tissues', 'Lung', 'Breast', 'Brain', 'Prostate', 'Mixed'] },
  { key: 'metric', label: 'Metric', icon: '◒', options: ['Overall score', 'PQ', 'Dice', 'AP50', 'Speed', 'VRAM'] }
];

function categoryOrder(list) {
  const priority = {
    Overall: ['cellpose-sam', 'mesmer', 'cellsam', 'stardist', 'cellotype'],
    Nucleus: ['stardist', 'cellpose-sam', 'cellsam', 'mesmer', 'cellotype'],
    'Whole Cell': ['mesmer', 'cellpose-sam', 'cellsam', 'cellotype', 'stardist'],
    Efficiency: ['stardist', 'mesmer', 'cellpose-sam', 'cellotype', 'cellsam'],
    Generalization: ['cellsam', 'cellpose-sam', 'mesmer', 'stardist', 'cellotype']
  };
  const order = priority[state.category] || priority.Overall;
  const position = (id) => {
    const index = order.indexOf(id);
    return index === -1 ? order.length + 100 : index;
  };
  return list.slice().sort((a, b) => position(a.id) - position(b.id));
}

function filteredImageMethods() {
  let list = imageMethods();
  const modality = state.filters.modality;
  const dataset = state.filters.dataset;
  const tissue = state.filters.tissue;
  if (modality !== 'All modalities') {
    const keep = modality === 'Multiplex imaging' ? ['mesmer', 'cellpose-sam', 'cellsam'] :
      modality === 'Spatial transcriptomics' ? ['cellpose-sam', 'cellsam', 'mesmer'] :
      modality === 'Fluorescence microscopy' ? ['stardist', 'cellpose-sam', 'cellsam', 'cellotype'] : ['cellotype', 'cellpose-sam'];
    list = list.filter((m) => keep.includes(m.id));
  }
  if (dataset !== 'All datasets') {
    const keep = dataset === 'TissueNet' ? ['stardist', 'cellotype', 'cellpose-sam', 'cellsam'] :
      dataset === 'CosMx Lung' ? ['mesmer', 'cellpose-sam', 'cellsam'] :
      dataset === 'Xenium Lung' ? ['cellpose-sam', 'cellsam'] : ['cellpose-sam', 'mesmer'];
    list = list.filter((m) => keep.includes(m.id));
  }
  if (tissue !== 'All tissues') {
    const keep = tissue === 'Lung' ? ['mesmer', 'cellpose-sam', 'cellsam'] :
      tissue === 'Mixed' ? ['stardist', 'cellotype', 'cellpose-sam'] :
      ['cellpose-sam', 'cellsam', 'cellotype'];
    list = list.filter((m) => keep.includes(m.id));
  }
  if (state.more.target !== 'All targets') {
    if (state.more.target === 'Nucleus') list = list.filter((m) => ['stardist', 'cellpose-sam', 'cellsam', 'cellpose-3', 'unseg'].includes(m.id));
    if (state.more.target === 'Whole cell') list = list.filter((m) => m.id !== 'stardist');
  }
  return categoryOrder(list);
}

function scoreFor(m) {
  if (state.category === 'Nucleus') return { stardist: 0.88, 'cellpose-sam': 0.86, cellsam: 0.84, mesmer: 0.82, cellotype: 0.80 }[m.id] || m.score;
  if (state.category === 'Whole Cell') return { mesmer: 0.87, 'cellpose-sam': 0.86, cellsam: 0.84, cellotype: 0.79, stardist: 0.74 }[m.id] || m.score;
  if (state.category === 'Generalization') return { cellsam: 0.86, 'cellpose-sam': 0.85, mesmer: 0.82, stardist: 0.78, cellotype: 0.75 }[m.id] || m.score;
  return m.score;
}

function scoreMetric(m) {
  const metric = state.filters.metric;
  if (metric === 'PQ') return m.pq;
  if (metric === 'Dice') return m.dice;
  if (metric === 'AP50') return m.ap50;
  if (metric === 'Speed') return m.speed == null ? null : 1 - (m.speed / 4);
  if (metric === 'VRAM') return m.vram == null ? null : 1 - (m.vram / 14);
  return scoreFor(m);
}

function methodBar(m, value, compact) {
  const height = Math.max(18, Math.round((value - 0.70) / 0.20 * (compact ? 62 : 118) + (compact ? 22 : 35)));
  return h(
    '<button class="bar-item ', state.highlighted === m.id ? 'highlighted' : '', '" data-action="open-method" data-id="', m.id, '" title="', esc(m.name + ' · Overall ' + pct(value) + ' · PQ ' + pct(m.pq) + ' · Dice ' + pct(m.dice) + ' · ' + m.datasets + ' datasets tested'), '">',
    '<span class="bar-score">', pct(value), '</span>',
    '<span class="method-bar" style="height:', height, 'px;background:', m.family === 'Foundation' ? 'var(--indigo)' : m.family === 'Nucleus' ? 'var(--taupe)' : m.family === 'Domain-specific' ? 'var(--warm)' : 'var(--sage)', '"></span>',
    '<span class="bar-label">', esc(m.name), '</span><span class="bar-family">', esc(m.family), '</span></button>'
  );
}

function renderFilter(def) {
  const open = state.openFilter === def.key;
  return h(
    '<div class="filter-wrap">',
    '<button class="filter-control ', state.filters[def.key] !== def.options[0] ? 'selected' : '', '" data-action="toggle-filter" data-filter="', def.key, '" aria-expanded="', open, '">',
    '<span class="filter-icon">', def.icon, '</span><span>', def.label, '</span><strong>', esc(state.filters[def.key]), '</strong><span class="chevron" aria-hidden="true"></span></button>',
    '<div class="filter-menu" ', open ? '' : 'hidden', '>',
    def.options.map((value) => '<button class="' + (state.filters[def.key] === value ? 'active' : '') + '" data-action="filter-choice" data-filter="' + def.key + '" data-value="' + esc(value) + '">' + esc(value) + '</button>').join(''),
    '</div></div>'
  );
}

function renderMore() {
  const options = [
    ['target', 'Segmentation target', ['All targets', 'Nucleus', 'Whole cell']],
    ['dimensionality', 'Dimensionality', ['2D', '3D']],
    ['training', 'Training requirement', ['Any training', 'Works without fine-tuning', 'Task-specific training']],
    ['gpu', 'GPU requirement', ['Any GPU', 'No GPU required', 'GPU recommended']],
    ['density', 'Cell density', ['All densities', 'Sparse', 'Dense']],
    ['morphology', 'Cell morphology', ['All morphologies', 'Regular', 'Irregular']]
  ];
  return h(
    '<div class="filter-wrap">',
    '<button class="filter-control ', state.moreOpen ? 'selected' : '', '" data-action="toggle-more" aria-expanded="', state.moreOpen, '"><span class="filter-icon">＋</span><span>More</span><span class="chevron" aria-hidden="true"></span></button>',
    '<div class="more-panel" ', state.moreOpen ? '' : 'hidden', '><h4>More filters</h4><div class="more-options">',
    options.map(([key, label, values]) => '<label><span>' + label + '</span><select data-action="more-choice" data-more="' + key + '">' + values.map((v) => '<option ' + (state.more[key] === v ? 'selected' : '') + '>' + v + '</option>').join('') + '</select></label>').join(''),
    '</div></div></div>'
  );
}

function renderLeaderboard() {
  const rows = filteredImageMethods();
  const chartRows = rows.length ? rows : imageMethods();
  const metricLabel = state.filters.metric === 'Overall score' ? 'normalized overall score' : state.filters.metric;
  const overviewLabel = chartRows.length > 10 ? 'Top 10 methods' : 'All ' + chartRows.length + ' image methods';
  return h(
    '<div class="page">',
    '<section class="leaderboard-heading"><div class="leaderboard-branding"><img class="homepage-logo" src="assets/spasegbench-logo.png" alt="SpaSegBench logo"><div><div class="eyebrow">Spatial cell segmentation benchmark</div><h1>Cell Segmentation Leaderboard <span class="beta">BETA</span></h1><p class="subcopy">Compare cell segmentation methods across imaging contexts with evidence, caveats, and coverage kept visible.</p></div></div><div class="heading-side">Updated Sep 2026 · image track</div></section>',
    '<div class="category-tabs">', ['Overall', 'Nucleus', 'Whole Cell', 'Efficiency', 'Generalization'].map((cat) => '<button class="category-tab ' + (state.category === cat ? 'active' : '') + '" data-action="category" data-value="' + cat + '">' + cat + '</button>').join(''), '</div>',
    '<div class="filter-row">', filterDefs.map(renderFilter).join(''), renderMore(), '</div>',
    '<section class="quick-picks"><h2>Quick picks</h2><div class="quick-chip-row">',
    [['overall', 'Best overall methods'], ['nucleus', 'Best for nucleus segmentation'], ['whole-cell', 'Best for whole-cell segmentation'], ['spatial', 'Best on spatial transcriptomics'], ['fastest', 'Fastest methods'], ['no-tuning', 'Works without fine-tuning'], ['low-memory', 'Low GPU memory']].map(([id, label]) => '<button class="quick-chip ' + (state.quickPick === id ? 'active' : '') + '" data-action="quick-pick" data-value="' + id + '"><span class="chip-arrow">›</span>' + label + '</button>').join(''),
    '</div></section>',
    '<div class="divider"></div>',
    '<section class="overview-section"><div class="overview-head"><h2 class="section-title">Method Overview</h2><p>' + overviewLabel + ' by ' + esc(metricLabel) + ' · hover to inspect evidence</p></div><div class="overview-scroll"><div class="overview-chart">',
    chartRows.slice(0, 10).map((m) => methodBar(m, scoreMetric(m) == null ? scoreFor(m) : scoreMetric(m), false)).join(''),
    '</div></div><div class="overview-foot"><span>Higher is better · speed and VRAM are inverted for visual comparison</span><span class="legend"><span class="legend-label"><i class="legend-dot"></i> General</span><span class="legend-label"><i class="legend-dot indigo"></i> Foundation</span><span class="legend-label"><i class="legend-dot taupe"></i> Nucleus</span><span class="legend-label"><i class="legend-dot warm"></i> Domain-specific</span></span></div></section>',
    '<section class="leaderboard-section"><div class="overview-head"><h2 class="section-title">Leaderboard</h2><p>Normalized values are labeled; missing measurements stay visible.</p></div>',
    rows.length ? renderLeaderboardTable(rows) : '<div class="empty-state"><strong>No methods match these filters.</strong><span>Try removing a filter or use a Quick pick.</span></div>',
    '</section></div>'
  );
}

function renderLeaderboardTable(rows) {
  const sorted = rows.slice().sort((a, b) => {
    let av = state.sortKey === 'score' ? scoreFor(a) : state.sortKey === 'pq' ? a.pq : state.sortKey === 'dice' ? a.dice : state.sortKey === 'ap50' ? a.ap50 : state.sortKey === 'speed' ? a.speed : a.vram;
    let bv = state.sortKey === 'score' ? scoreFor(b) : state.sortKey === 'pq' ? b.pq : state.sortKey === 'dice' ? b.dice : state.sortKey === 'ap50' ? b.ap50 : state.sortKey === 'speed' ? b.speed : b.vram;
    if (av == null) return 1;
    if (bv == null) return -1;
    const direction = state.sortDir === 'asc' ? 1 : -1;
    return (av - bv) * direction;
  });
  return h(
    '<div class="table-shell"><table class="leaderboard-table"><colgroup><col class="rank-col"><col class="method-col"><col class="score-col"><col class="metric-col"><col class="metric-col"><col class="metric-col"><col class="speed-col"><col class="vram-col"><col class="notes-col"></colgroup><thead><tr><th>Rank</th><th>Method</th><th><button data-action="sort" data-sort="score">Overall Score</button></th><th><button data-action="sort" data-sort="pq">PQ</button></th><th><button data-action="sort" data-sort="dice">Dice</button></th><th><button data-action="sort" data-sort="ap50">AP50</button></th><th><button data-action="sort" data-sort="speed">Speed</button></th><th><button data-action="sort" data-sort="vram">VRAM</button></th><th>Notes</th></tr></thead><tbody>',
    sorted.map((m, index) => {
      const focused = state.highlighted === m.id ? ' row-highlight' : '';
      return '<tr class="' + focused.trim() + '" data-method-row="' + m.id + '"><td>' + (index + 1) + '</td><td><button class="method-button" data-action="open-method" data-id="' + m.id + '"><i class="method-orb ' + familyClass(m) + '"></i><span><strong>' + esc(m.name) + '</strong><small>' + esc(m.family) + (m.simulated ? ' · preview data' : '') + '</small></span></button></td><td class="main-score">' + pct(scoreFor(m)) + '</td><td>' + num(m.pq, 2) + '</td><td>' + num(m.dice, 2) + '</td><td>' + num(m.ap50, 2) + '</td><td>' + (m.speed == null ? '—' : m.speed.toFixed(1) + ' s') + '</td><td>' + (m.vram == null ? '—' : m.vram.toFixed(1) + ' GB') + '</td><td>' + (m.simulated ? '<span class="preview-badge">Preview</span>' : '') + '<button class="notes-button" data-action="open-method" data-id="' + m.id + '">View</button></td></tr>';
    }).join(''),
    '</tbody></table></div><div class="table-foot"><span><strong>' + sorted.length + ' methods</strong> · image track · comparable groups only</span><span>Preview-tagged methods use simulated values until benchmark data is uploaded.</span></div>'
  );
}

function renderExplore() {
  const q = state.exploreQuery.trim().toLowerCase();
  const methodFilters = ['All', 'Foundation', 'General purpose', 'Nucleus', 'Domain-specific'];
  const methodList = methods.filter((m) => {
    const matchesQuery = !q || (m.name + ' ' + m.short + ' ' + m.summary).toLowerCase().includes(q);
    const matchesFilter = state.exploreFilter === 'All' || (state.exploreFilter === 'General purpose' ? m.family === 'General' : m.family === state.exploreFilter);
    return matchesQuery && matchesFilter;
  });
  const dataList = datasets.filter((d) => !q || (d.name + ' ' + d.modality + ' ' + d.tissue).toLowerCase().includes(q));
  const list = state.exploreTab === 'Methods' ? methodList : dataList;
  return h(
    '<div class="page"><section class="explore-header"><div><div class="eyebrow">Browse the evidence</div><h1>Explore</h1><p class="subcopy">Search compact method and dataset records, then open details without losing your place.</p></div><div class="heading-side">', state.exploreTab === 'Methods' ? methods.length + ' methods' : datasets.length + ' datasets', '</div></section>',
    '<div class="explore-tabs"><button class="explore-tab ' + (state.exploreTab === 'Methods' ? 'active' : '') + '" data-action="explore-tab" data-value="Methods">Methods</button><button class="explore-tab ' + (state.exploreTab === 'Datasets' ? 'active' : '') + '" data-action="explore-tab" data-value="Datasets">Datasets</button></div>',
    '<div class="explore-toolbar"><input id="explore-search" class="explore-search" type="search" placeholder="Search methods or datasets" value="' + esc(state.exploreQuery) + '" /><div class="explore-filters">',
    (state.exploreTab === 'Methods' ? methodFilters : ['All', 'Image track', 'Molecule track', 'Spatial transcriptomics']).map((value) => '<button class="explore-filter ' + (state.exploreFilter === value ? 'active' : '') + '" data-action="explore-filter" data-value="' + value + '">' + value + '</button>').join(''),
    '</div></div>',
    state.exploreTab === 'Methods' ? '<div class="method-family-legend"><strong>Method family</strong><span><i class="method-orb"></i>General purpose</span><span><i class="method-orb foundation"></i>Foundation</span><span><i class="method-orb nucleus"></i>Nucleus</span><span><i class="method-orb domain"></i>Domain-specific</span></div>' : '',
    state.exploreTab === 'Methods' ? renderMethodList(list) : renderDatasetList(list)
  , '</div>');
}

function renderMethodList(list) {
  return list.length ? h('<div class="entity-row-head"><div>Method</div><div>Family</div><div>Track</div><div>Score</div><div></div></div><div class="entity-list">', list.map((m) => '<button class="entity-row" data-action="open-method" data-id="' + m.id + '"><div><span class="entity-name"><i class="method-orb ' + familyClass(m) + '"></i><span><strong>' + esc(m.name) + '</strong><small>' + esc(m.short) + '</small></span></span></div><div class="entity-value">' + esc(m.family) + '</div><div class="entity-value">' + esc(m.track) + '</div><div class="entity-value score">' + pct(m.track === 'image' ? m.score : m.overall) + '</div><div class="entity-arrow">›</div></button>').join(''), '</div>') : '<div class="empty-state"><strong>No matching methods.</strong><span>Try a broader search.</span></div>';
}

function renderDatasetList(list) {
  return list.length ? h('<div class="entity-row-head"><div>Dataset</div><div>Modality</div><div>Tissue</div><div>Track</div><div></div></div><div class="entity-list">', list.map((d) => '<button class="entity-row" data-action="open-dataset" data-id="' + d.id + '"><div><span class="entity-name"><i class="method-orb ' + (d.track === 'image' ? 'domain' : 'nucleus') + '"></i><span><strong>' + esc(d.name) + '</strong><small>' + esc(d.platform) + ' · ' + esc(d.species) + '</small></span></span></div><div class="entity-value">' + esc(d.modality) + '</div><div class="entity-value">' + esc(d.tissue) + '</div><div class="entity-value">' + esc(d.track) + '</div><div class="entity-arrow">›</div></button>').join(''), '</div>') : '<div class="empty-state"><strong>No matching datasets.</strong><span>Try a broader search.</span></div>';
}

function recommendField(key, label, type, options, placeholder) {
  const value = state.recommend[key];
  if (type === 'select') {
    return '<label class="recommend-field"><span>' + label + '</span><select data-action="recommend-input" data-key="' + key + '">' + options.map((option) => '<option ' + (value === option ? 'selected' : '') + '>' + esc(option) + '</option>').join('') + '</select></label>';
  }
  return '<label class="recommend-field"><span>' + label + '</span><input data-action="recommend-text" data-key="' + key + '" type="' + type + '" value="' + esc(value) + '" placeholder="' + esc(placeholder || '') + '"></label>';
}

function recommendPriorToggle() {
  return '<div class="recommend-toggle"><span><strong>Platform prior available</strong><small>Used as a feasibility and leakage signal</small></span><button class="switch-control ' + (state.recommend.prior ? 'on' : '') + '" data-action="recommend-toggle" role="switch" aria-checked="' + state.recommend.prior + '"><i></i></button></div>';
}

function recommendationContext() {
  const r = state.recommend;
  const quick = state.recommendMode === 'quick';
  const unsupported = quick && ['Stereo-seq', 'Other / Unseen'].includes(r.platform);
  const track = quick ? (r.platform === 'CosMx' ? 'image' : 'molecule') : r.track.toLowerCase();
  let recs;
  if (track === 'image') {
    const order = r.target === 'Nucleus' ? ['stardist', 'cellpose-sam', 'cellsam', 'mesmer', 'cellotype'] :
      r.platform === 'CosMx' ? ['mesmer', 'cellpose-sam', 'cellsam', 'cellotype', 'stardist'] :
      r.priority === 'Speed' || r.priority === 'Memory' || r.gpu === 'Not available' ? ['stardist', 'cellpose-sam', 'mesmer', 'cellotype', 'cellsam'] :
      ['cellpose-sam', 'mesmer', 'cellsam', 'stardist', 'cellotype'];
    recs = order.map(methodById).filter(Boolean).slice(0, 3);
  } else {
    const order = !r.prior ? ['genesegnet', 'cellist', 'boms', 'proseg', 'ucs'] :
      r.platform === 'MERFISH' ? ['cellist', 'genesegnet', 'boms', 'proseg', 'ucs'] :
      ['proseg', 'ucs', 'cellist', 'genesegnet', 'boms'];
    recs = order.map(methodById).filter(Boolean).slice(0, 3);
  }
  return { recs, track, unsupported };
}

function renderRecommendationResult() {
  const context = recommendationContext();
  if (!state.recommendVisible) return '<section class="recommend-result" hidden></section>';
  if (context.unsupported) return '<section class="recommend-result"><div class="recommend-route-note"><span class="eyebrow">Expert input needed</span><h2>This platform is outside Quick Mode coverage.</h2><p>Switch to Expert Mode to combine platform context with measurable dataset parameters.</p><button class="find-button inline" data-action="recommend-mode" data-value="expert">Switch to Expert Mode →</button></div></section>';
  const imageTrack = context.track === 'image';
  return h(
    '<section class="recommend-result"><div class="result-title"><div><h2>Recommended for your data</h2><p>', imageTrack ? 'Image-track shortlist' : 'Molecule-track shortlist', ' ranked from the current evidence snapshot.</p></div><span class="beta">Transparent shortlist</span></div>',
    '<div class="recommend-bars">', context.recs.map((m, i) => methodBar(m, Math.max(0.68, (m.overall || m.score) - i * 0.012), true)).join(''), '</div>',
    '<div class="recommend-table"><div class="table-shell"><table class="leaderboard-table recommend-table"><thead><tr><th>Rank</th><th>Method</th><th>Match</th>', imageTrack ? '<th>PQ</th><th>Dice</th><th>Runtime</th>' : '<th>Utility</th><th>F1</th><th>Coverage</th>', '<th>Notes</th></tr></thead><tbody>',
    context.recs.map((m, i) => '<tr><td>' + (i + 1) + '</td><td><button class="method-button" data-action="open-method" data-id="' + m.id + '"><i class="method-orb ' + familyClass(m) + '"></i><span><strong>' + esc(m.name) + '</strong><small>' + esc(m.family) + '</small></span></button></td><td><span class="match-pill">' + (92 - i * 5) + '%</span></td>' + (imageTrack ? '<td>' + num(m.pq, 2) + '</td><td>' + num(m.dice, 2) + '</td><td>' + m.speed.toFixed(1) + ' s</td>' : '<td>' + num(m.overall, 2) + '</td><td>' + num(m.f1, 3) + '</td><td>' + m.datasets + ' sets</td>') + '<td><button class="notes-button" data-action="open-method" data-id="' + m.id + '">View</button></td></tr>').join(''),
    '</tbody></table></div><p class="recommend-caption">The match score is benchmark fit, not a probability. Methods inside the equivalence band remain a shortlist rather than a false single winner.</p></div></section>'
  );
}

function renderRecommend() {
  const quick = state.recommendMode === 'quick';
  const summary = quick ? [state.recommend.platform, state.recommend.tissue || 'Tissue not set', state.recommend.goal, state.recommend.prior ? 'Prior available' : 'No prior'] : [state.recommend.platform, state.recommend.track + ' track', state.recommend.target, state.recommend.priority, state.recommend.gpu];
  return h(
    '<div class="page"><section class="recommend-header"><div><div class="eyebrow">Benchmark-guided selector</div><h1>Find the right segmentation method</h1><p class="subcopy">Use Quick Mode for well-covered platforms, or Expert Mode when dataset parameters and compute constraints matter.</p></div><div class="recommend-mode-switch" role="group" aria-label="Recommendation mode"><button class="' + (quick ? 'active' : '') + '" data-action="recommend-mode" data-value="quick">Quick Mode</button><button class="' + (!quick ? 'active' : '') + '" data-action="recommend-mode" data-value="expert">Expert Mode</button></div></section>',
    '<div class="recommend-notice">The more complete the input, the more unsuitable cases SpaSegBench can eliminate before ranking.</div>',
    '<section class="recommend-input-panel"><div class="recommend-panel-head"><span class="section-index">01 / Input</span><h2>', quick ? 'Quick Screening' : 'Platform × Parameter Screening', '</h2><p>', quick ? 'Designed for Xenium, MERFISH and CosMx workflows. Other platforms are routed to Expert Mode.' : 'Combines platform context, measurable dataset parameters and compute constraints.', '</p></div><div class="recommend-form-grid">',
    quick ? h(
      recommendField('platform', 'Platform', 'select', ['Xenium', 'MERFISH', 'CosMx', 'Stereo-seq', 'Other / Unseen']),
      recommendField('tissue', 'Tissue', 'text', null, 'e.g. breast, brain, liver'),
      recommendField('goal', 'Downstream goal', 'select', ['Quantification', 'Detection', 'Assignment', 'Localization', 'Balanced']),
      recommendPriorToggle()
    ) : h(
      recommendField('platform', 'Platform', 'select', ['Xenium', 'MERFISH', 'CosMx', 'Stereo-seq', 'Visium HD', 'Other / Custom']),
      recommendField('tissue', 'Tissue', 'text', null, 'Free text accepted'),
      recommendField('track', 'Benchmark track', 'select', ['Molecule', 'Image']),
      recommendField('target', 'Segmentation target', 'select', ['Whole cell', 'Nucleus']),
      recommendField('transcriptDensity', 'Transcript density / µm²', 'number'),
      recommendField('transcripts', 'Number of transcripts', 'number'),
      recommendField('genes', 'Number of genes', 'number'),
      recommendField('nnDistance', 'Median NN distance (µm)', 'number'),
      recommendField('priority', 'Priority', 'select', ['Accuracy', 'Generalization', 'Speed', 'Memory']),
      recommendField('gpu', 'GPU', 'select', ['Available', 'Not available']),
      recommendField('memory', 'Max RAM (GB)', 'select', ['8', '16', '32', '64']),
      recommendField('runtime', 'Max runtime (h)', 'select', ['1', '3', '6', '12']),
      recommendPriorToggle()
    ),
    '</div><div class="recommend-actions"><button class="find-button inline" data-action="recommend-run">Generate recommendation →</button><span>', quick ? 'Quick Mode prioritizes covered-platform screening.' : 'Expert Mode prioritizes platform × parameter screening.', '</span></div><div class="selection-summary compact"><div class="summary-tags">', summary.map((x) => '<span class="summary-tag">' + esc(x) + '</span>').join(''), '</div></div></section>',
    renderRecommendationResult(),
    '<section class="recommend-how"><div><span class="section-index">03 / Method</span><h2>How recommendations work</h2><p>SpaSegBench uses stratified defaults, measured utility and an explicit equivalence band. A learned predictor remains gated until the benchmark has sufficient coverage.</p></div><div class="rule-list"><div><b>01</b><span>Image and molecule evidence stay in separate metric namespaces.</span></div><div><b>02</b><span>Comparability groups and prior-dependent leakage remain visible.</span></div><div><b>03</b><span>Methods within benchmark noise are returned as a shortlist.</span></div></div></section>',
    '</div>'
  );
}

function renderDrawer() {
  const drawer = document.getElementById('detail-drawer');
  if (!state.drawer) {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.getElementById('drawer-backdrop').hidden = true;
    drawer.innerHTML = '';
    return;
  }
  const type = state.drawer.type;
  const item = type === 'method' ? methodById(state.drawer.id) : datasetById(state.drawer.id);
  if (!item) return;
  if (type === 'method') {
    const image = item.track === 'image';
    const metricPairs = image ? [['Overall', item.score], ['PQ', item.pq], ['Dice', item.dice], ['AP50', item.ap50]] : [['Overall', item.overall || item.score], ['F1 · report only', item.f1], ['Coverage', item.datasets / 8]];
    const datasetNames = image ? ['TissueNet', 'CosMx Lung', 'Xenium Lung', 'Stereo Brain'].slice(0, item.datasets > 5 ? 4 : 3) : ['Xenium Lung', 'Xenium Breast', 'MERFISH Prostate'];
    drawer.innerHTML = h(
      '<button class="drawer-close" data-action="close-drawer" aria-label="Close details">×</button><div class="drawer-head"><div class="eyebrow">', item.track, ' track · method</div><h2>', esc(item.name), '</h2><p>', esc(item.summary), '</p></div>',
      '<div class="drawer-score-grid">', metricPairs.map(([label, value]) => '<div class="drawer-score"><strong>' + (label === 'F1 · report only' ? pct(value) : pct(value)) + '</strong><span>' + label + '</span></div>').join(''), '</div>',
      '<section class="drawer-section"><h3>Performance by dataset</h3><div class="drawer-bars">', metricPairs.slice(0, image ? 4 : 3).map(([label, value]) => '<div class="drawer-bar-row"><span>' + label + '</span><span class="drawer-bar-track"><span style="width:' + Math.round((value || 0) * 100) + '%"></span></span><strong>' + pct(value) + '</strong></div>').join(''), '</div></section>',
      '<section class="drawer-section"><h3>Datasets tested</h3><div class="drawer-pills">', datasetNames.map((name) => '<span class="drawer-pill">' + name + '</span>').join(''), '</div></section>',
      '<section class="drawer-section"><h3>Works well for</h3><div class="drawer-pills">', item.worksFor.map((x) => '<span class="drawer-pill">' + esc(x) + '</span>').join(''), '</div><p style="margin:13px 0 0;color:var(--text-2);font-size:11px;line-height:1.5;">' + esc(item.notes) + '</p></section>',
      item.simulated ? '<div class="drawer-warning"><strong>Preview data.</strong> This method\'s metrics are simulated and will be replaced once benchmark measurements are uploaded.</div>' : '',
      item.prior ? '<div class="drawer-warning"><strong>Prior dependency.</strong> Detection evidence is masked from utility ranking when this method uses a platform segmentation prior.</div>' : '',
      '<div class="drawer-actions"><a class="drawer-button primary" href="https://github.com" target="_blank" rel="noreferrer">GitHub ↗</a><a class="drawer-button" href="https://doi.org" target="_blank" rel="noreferrer">Paper ↗</a></div>'
    );
  } else {
    const related = methods.filter((m) => m.track === item.track).slice(0, 5);
    drawer.innerHTML = h(
      '<button class="drawer-close" data-action="close-drawer" aria-label="Close details">×</button><div class="drawer-head"><div class="eyebrow">', item.track, ' track · dataset</div><h2>', esc(item.name), '</h2><p>', esc(item.description), '</p></div>',
      '<div class="drawer-score-grid"><div class="drawer-score"><strong>', esc(item.platform), '</strong><span>Platform</span></div><div class="drawer-score"><strong>', esc(item.tissue), '</strong><span>Tissue</span></div><div class="drawer-score"><strong>', esc(item.species), '</strong><span>Species</span></div><div class="drawer-score"><strong>', esc(item.count), '</strong><span>Coverage</span></div></div>',
      '<section class="drawer-section"><h3>Methods on this dataset</h3><div class="drawer-pills">', related.map((m) => '<span class="drawer-pill">' + esc(m.name) + '</span>').join(''), '</div></section>',
      '<section class="drawer-section"><h3>Dataset metadata</h3><div class="drawer-bars"><div class="drawer-bar-row"><span>Modality</span><span></span><strong>' + esc(item.modality) + '</strong></div><div class="drawer-bar-row"><span>Tissue</span><span></span><strong>' + esc(item.tissue) + '</strong></div><div class="drawer-bar-row"><span>Track</span><span></span><strong>' + esc(item.track) + '</strong></div></div></section>',
      item.id === 'xenium-3' ? '<div class="drawer-warning"><strong>Comparability review.</strong> GT source issues are flagged; this dataset is not silently merged with other groups.</div>' : '<div class="drawer-warning" style="border-color:var(--border);color:var(--text-2);background:var(--surface-alt);"><strong>Scope note.</strong> Comparisons are made only within the same comparability group.</div>'
    );
  }
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  document.getElementById('drawer-backdrop').hidden = false;
}

function renderRoute() {
  const r = currentRoute();
  if (renderedRoute !== r) state.drawer = null;
  renderedRoute = r;
  let content;
  if (r === 'leaderboard') content = renderLeaderboard();
  else if (r === 'explore') content = renderExplore();
  else if (r === 'recommend') content = renderRecommend();
  else content = renderLeaderboard();
  document.getElementById('main-content').innerHTML = content;
  document.querySelectorAll('[data-route]').forEach((el) => {
    const target = el.getAttribute('data-route');
    el.classList.toggle('active', target === r || (target === 'leaderboard' && r === 'leaderboard'));
  });
  document.getElementById('primary-nav').classList.remove('open');
  const menu = document.querySelector('.mobile-nav-toggle');
  if (menu) menu.setAttribute('aria-expanded', 'false');
  renderDrawer();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(window.__cellsegToast);
  window.__cellsegToast = setTimeout(() => el.classList.remove('show'), 2300);
}

function openAbout() {
  document.getElementById('about-modal').hidden = false;
}
function closeAbout() {
  document.getElementById('about-modal').hidden = true;
}

document.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]');
  const routeEl = event.target.closest('[data-route]');
  if (routeEl && !action) {
    event.preventDefault();
    const destination = routeEl.getAttribute('data-route');
    const nextHash = '#/' + destination;
    if (location.hash === nextHash) renderRoute();
    else location.hash = nextHash;
    return;
  }
  if (!action) {
    if (!event.target.closest('.filter-wrap')) { state.openFilter = null; state.moreOpen = false; }
    return;
  }
  const act = action.dataset.action;
  if (act === 'mobile-menu') {
    const nav = document.getElementById('primary-nav');
    const next = !nav.classList.contains('open');
    nav.classList.toggle('open', next);
    action.setAttribute('aria-expanded', String(next));
  } else if (act === 'about') openAbout();
  else if (act === 'close-about') closeAbout();
  else if (act === 'close-drawer') { state.drawer = null; renderDrawer(); }
  else if (act === 'toggle-filter') {
    state.openFilter = state.openFilter === action.dataset.filter ? null : action.dataset.filter;
    state.moreOpen = false;
    renderRoute();
  } else if (act === 'toggle-more') {
    state.moreOpen = !state.moreOpen;
    state.openFilter = null;
    renderRoute();
  } else if (act === 'filter-choice') {
    state.filters[action.dataset.filter] = action.dataset.value;
    state.openFilter = null;
    state.quickPick = '';
    renderRoute();
    toast(action.dataset.value + ' applied');
  } else if (act === 'category') {
    state.category = action.dataset.value;
    state.sortKey = 'score';
    state.sortDir = 'desc';
    state.quickPick = '';
    renderRoute();
  } else if (act === 'quick-pick') {
    const id = action.dataset.value;
    state.quickPick = id;
    state.openFilter = null;
    state.moreOpen = false;
    if (id === 'overall') { state.category = 'Overall'; state.filters = { modality: 'All modalities', dataset: 'All datasets', tissue: 'All tissues', metric: 'Overall score' }; state.more.target = 'All targets'; }
    if (id === 'nucleus') { state.category = 'Nucleus'; state.more.target = 'Nucleus'; state.filters.metric = 'PQ'; }
    if (id === 'whole-cell') { state.category = 'Whole Cell'; state.more.target = 'Whole cell'; state.filters.metric = 'PQ'; }
    if (id === 'spatial') { state.filters.modality = 'Spatial transcriptomics'; state.category = 'Generalization'; }
    if (id === 'fastest') { state.category = 'Efficiency'; state.filters.metric = 'Speed'; }
    if (id === 'no-tuning') { state.filters.metric = 'Overall score'; toast('Fine-tuning evidence remains explicit in the drawer.'); }
    if (id === 'low-memory') { state.category = 'Efficiency'; state.filters.metric = 'VRAM'; }
    renderRoute();
  } else if (act === 'sort') {
    if (state.sortKey === action.dataset.sort) state.sortDir = state.sortDir === 'desc' ? 'asc' : 'desc';
    else { state.sortKey = action.dataset.sort; state.sortDir = 'desc'; }
    renderRoute();
  } else if (act === 'open-method') {
    state.drawer = { type: 'method', id: action.dataset.id };
    renderDrawer();
  } else if (act === 'open-dataset') {
    state.drawer = { type: 'dataset', id: action.dataset.id };
    renderDrawer();
  } else if (act === 'explore-tab') {
    state.exploreTab = action.dataset.value;
    state.exploreFilter = 'All';
    renderRoute();
  } else if (act === 'explore-filter') {
    state.exploreFilter = action.dataset.value;
    renderRoute();
  } else if (act === 'recommend-mode') {
    state.recommendMode = action.dataset.value;
    state.recommendVisible = false;
    renderRoute();
  } else if (act === 'recommend-toggle') {
    state.recommend.prior = !state.recommend.prior;
    state.recommendVisible = false;
    renderRoute();
  } else if (act === 'recommend-choice') {
    state.recommend[action.dataset.key] = action.dataset.value;
    state.recommendVisible = false;
    renderRoute();
  } else if (act === 'recommend-run') {
    state.recommendVisible = true;
    renderRoute();
    toast('Recommendation updated');
  }
});

document.addEventListener('input', (event) => {
  if (event.target.dataset.action === 'recommend-text') {
    state.recommend[event.target.dataset.key] = event.target.value;
    state.recommendVisible = false;
    return;
  }
  if (event.target.id !== 'explore-search') return;
  const value = event.target.value;
  state.exploreQuery = value;
  const selection = event.target.selectionStart;
  renderRoute();
  const next = document.getElementById('explore-search');
  if (next) { next.focus(); next.setSelectionRange(selection, selection); }
});

document.addEventListener('change', (event) => {
  const target = event.target;
  if (target.dataset.action === 'more-choice') {
    state.more[target.dataset.more] = target.value;
    state.moreOpen = true;
    renderRoute();
  }
  if (target.dataset.action === 'recommend-input') {
    state.recommend[target.dataset.key] = target.value;
    state.recommendVisible = false;
    renderRoute();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!document.getElementById('about-modal').hidden) closeAbout();
    else if (state.drawer) { state.drawer = null; renderDrawer(); }
    else { state.openFilter = null; state.moreOpen = false; renderRoute(); }
  }
});

document.getElementById('drawer-backdrop').addEventListener('click', () => { state.drawer = null; renderDrawer(); });
document.getElementById('about-modal').addEventListener('click', (event) => { if (event.target.id === 'about-modal') closeAbout(); });
window.addEventListener('hashchange', renderRoute);
renderRoute();
