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
  leaderboardTrack: 'all',
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
  recommend: { platform: 'Xenium', tissue: 'Breast', goal: 'Quantification', prior: true, track: 'Omics / multimodal', target: 'Whole cell', transcriptDensity: '1.8', transcripts: '32000000', genes: '313', nnDistance: '6.4', gpu: 'Available', memory: '64', runtime: '6', priority: 'Generalization' },
  drawer: null,
  highlighted: null,
  sortKey: 'score',
  sortDir: 'desc',
  moleculeSortKey: 'overall',
  moleculeSortDir: 'desc',
  moleculeTab: 'Overall',
  moleculeFilters: { family: 'All families', prior: 'Any prior', evidence: 'All evidence', metric: 'Utility' },
  moleculeMore: { gpu: 'Any GPU', coverage: 'Any coverage' },
  moleculeOpenFilter: null,
  moleculeMoreOpen: false,
  moleculeQuickPick: '',
  overviewOpen: true
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
const moleculeMethods = () => methods.filter((m) => m.track === 'molecule');
const familyClass = (m) => m.family === 'Foundation' ? 'foundation' : m.family === 'Nucleus' ? 'nucleus' : m.family === 'Domain-specific' ? 'domain' : '';
const displayTrack = (track) => track === 'image' ? 'Image' : 'Omics / multimodal';
const icon = (kind) => ({ microscope: '◌', spatial: '⌘', nucleus: '●', whole: '◯', speed: '↯', memory: '▤', target: '◎', layers: '▦' }[kind] || '·');

const filterDefs = [
  { key: 'modality', label: 'Modality', icon: '⌁', options: ['All modalities', 'Fluorescence microscopy', 'Multiplex imaging', 'Spatial transcriptomics', 'H&E pathology'] },
  { key: 'dataset', label: 'Dataset', icon: '▦', options: ['All datasets', 'TissueNet', 'CosMx Lung'] },
  { key: 'tissue', label: 'Tissue', icon: '◌', options: ['All tissues', 'Lung', 'Breast', 'Brain', 'Prostate', 'Mixed'] },
  { key: 'metric', label: 'Metric', icon: '◒', options: ['Overall score', 'PQ', 'Dice', 'AP50', 'Speed', 'VRAM'] }
];

const moleculeFilterDefs = [
  { key: 'family', label: 'Family', options: ['All families', 'General', 'Domain-specific'] },
  { key: 'prior', label: 'Platform prior', options: ['Any prior', 'No platform prior', 'Uses platform prior'] },
  { key: 'evidence', label: 'Evidence', options: ['All evidence', 'Non-preview records', 'Preview data'] },
  { key: 'metric', label: 'Metric', options: ['Utility', 'Coverage'] }
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
      ['mesmer', 'cellpose-sam', 'cellsam'];
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
  if (state.more.gpu === 'GPU optional') list = list.filter((m) => m.gpu === 'Optional');
  if (state.more.gpu === 'GPU recommended') list = list.filter((m) => m.gpu !== 'Optional');
  return categoryOrder(list);
}

function sortedImageMethods(rows) {
  return rows.slice().sort((a, b) => {
    const value = (m) => state.sortKey === 'score' ? scoreFor(m) : m[state.sortKey];
    const av = value(a), bv = value(b);
    if (av == null) return 1;
    if (bv == null) return -1;
    return (av - bv) * (state.sortDir === 'asc' ? 1 : -1);
  });
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
  if (metric === 'Speed') return m.speed;
  if (metric === 'VRAM') return m.vram;
  return scoreFor(m);
}

function methodBar(m, value, compact, metric = 'Overall score') {
  const isResource = metric === 'Speed' || metric === 'VRAM';
  const isCombinedCoverage = metric === 'Coverage' && state.leaderboardTrack === 'all';
  const max = metric === 'Speed' ? 4 : metric === 'VRAM' ? 14 : metric === 'Coverage' ? Math.max(...(isCombinedCoverage ? methods : moleculeMethods()).map((method) => method.datasets)) : 1;
  const label = metric === 'Coverage' ? value + ' sets' : isResource ? (value == null ? '—' : value.toFixed(1) + (metric === 'Speed' ? ' s' : ' GB')) : pct(value);
  const height = Math.max(8, Math.round((value || 0) / max * (compact ? 76 : 132)));
  const color = isCombinedCoverage ? (m.track === 'image' ? 'var(--indigo)' : 'var(--warm)') : m.family === 'Foundation' ? 'var(--indigo)' : m.family === 'Nucleus' ? 'var(--taupe)' : m.family === 'Domain-specific' ? 'var(--warm)' : 'var(--sage)';
  const caption = isCombinedCoverage ? (m.track === 'image' ? 'Image' : 'Omics / multimodal') : m.family;
  return h(
    '<button class="bar-item ', state.highlighted === m.id ? 'highlighted' : '', '" data-action="open-method" data-id="', m.id, '" title="', esc(m.name + ' · ' + metric + ' ' + label + ' · ' + m.datasets + ' datasets tested' + (m.simulated ? ' · preview data' : '')), '">',
    '<span class="bar-score">', label, '</span>',
    '<span class="method-bar" style="height:', height, 'px;background:', color, '"></span>',
    '<span class="bar-label">', esc(m.name), m.simulated ? ' *' : '', '</span><span class="bar-family">', esc(caption), '</span></button>'
  );
}

function renderFilter(def) {
  const open = state.openFilter === def.key;
  return h(
    '<div class="filter-wrap">',
    '<button class="filter-control ', state.filters[def.key] !== def.options[0] ? 'selected' : '', '" data-action="toggle-filter" data-filter="', def.key, '" aria-expanded="', open, '">',
    '<span class="filter-name">', def.label, '</span><strong>', esc(state.filters[def.key]), '</strong><span class="chevron" aria-hidden="true"></span></button>',
    '<div class="filter-menu" ', open ? '' : 'hidden', '>',
    def.options.map((value) => '<button class="' + (state.filters[def.key] === value ? 'active' : '') + '" data-action="filter-choice" data-filter="' + def.key + '" data-value="' + esc(value) + '">' + esc(value) + '</button>').join(''),
    '</div></div>'
  );
}

function renderMore() {
  const options = [
    ['target', 'Segmentation target', ['All targets', 'Nucleus', 'Whole cell']],
    ['gpu', 'GPU requirement', ['Any GPU', 'GPU optional', 'GPU recommended']]
  ];
  return h(
    '<div class="filter-wrap">',
    '<button class="filter-control ', state.moreOpen ? 'selected' : '', '" data-action="toggle-more" aria-expanded="', state.moreOpen, '"><span class="filter-icon">＋</span><span>More</span><span class="chevron" aria-hidden="true"></span></button>',
    '<div class="more-panel" ', state.moreOpen ? '' : 'hidden', '><h4>More filters</h4><div class="more-options">',
    options.map(([key, label, values]) => '<label><span>' + label + '</span><select data-action="more-choice" data-more="' + key + '">' + values.map((v) => '<option ' + (state.more[key] === v ? 'selected' : '') + '>' + v + '</option>').join('') + '</select></label>').join(''),
    '</div></div></div>'
  );
}

function renderMoleculeFilter(def) {
  const open = state.moleculeOpenFilter === def.key;
  return h(
    '<div class="filter-wrap"><button class="filter-control ', state.moleculeFilters[def.key] !== def.options[0] ? 'selected' : '', '" data-action="toggle-molecule-filter" data-filter="', def.key, '" aria-expanded="', open, '"><span class="filter-name">', def.label, '</span><strong>', esc(state.moleculeFilters[def.key]), '</strong><span class="chevron" aria-hidden="true"></span></button>',
    '<div class="filter-menu" ', open ? '' : 'hidden', '>', def.options.map((value) => '<button class="' + (state.moleculeFilters[def.key] === value ? 'active' : '') + '" data-action="molecule-filter-choice" data-filter="' + def.key + '" data-value="' + esc(value) + '">' + esc(value) + '</button>').join(''), '</div></div>'
  );
}

function renderMoleculeMore() {
  const options = [
    ['gpu', 'GPU requirement', ['Any GPU', 'GPU optional', 'GPU recommended']],
    ['coverage', 'Dataset coverage', ['Any coverage', 'At least 4 datasets', 'At least 5 datasets']]
  ];
  return h(
    '<div class="filter-wrap"><button class="filter-control ', state.moleculeMoreOpen ? 'selected' : '', '" data-action="toggle-molecule-more" aria-expanded="', state.moleculeMoreOpen, '"><span class="filter-icon">＋</span><span>More</span><span class="chevron" aria-hidden="true"></span></button>',
    '<div class="more-panel" ', state.moleculeMoreOpen ? '' : 'hidden', '><h4>More filters</h4><div class="more-options">',
    options.map(([key, label, values]) => '<label><span>' + label + '</span><select data-action="molecule-more-choice" data-more="' + key + '">' + values.map((v) => '<option ' + (state.moleculeMore[key] === v ? 'selected' : '') + '>' + v + '</option>').join('') + '</select></label>').join(''),
    '</div></div></div>'
  );
}

function filteredMoleculeMethods() {
  return moleculeMethods().filter((m) => {
    const tab = state.moleculeTab;
    if (tab === 'General purpose' && m.family !== 'General') return false;
    if (tab === 'Domain-specific' && m.family !== 'Domain-specific') return false;
    if (tab === 'Prior-free' && m.prior) return false;
    if (tab === 'Prior-assisted' && !m.prior) return false;
    const f = state.moleculeFilters;
    if (f.family !== 'All families' && m.family !== f.family) return false;
    if (f.prior === 'No platform prior' && m.prior) return false;
    if (f.prior === 'Uses platform prior' && !m.prior) return false;
    if (f.evidence === 'Preview data' && !m.simulated) return false;
    if (f.evidence === 'Non-preview records' && m.simulated) return false;
    if (state.moleculeMore.gpu === 'GPU optional' && m.gpu !== 'Optional') return false;
    if (state.moleculeMore.gpu === 'GPU recommended' && m.gpu !== 'Recommended') return false;
    if (state.moleculeMore.coverage === 'At least 4 datasets' && m.datasets < 4) return false;
    if (state.moleculeMore.coverage === 'At least 5 datasets' && m.datasets < 5) return false;
    return true;
  });
}

function renderLeaderboard() {
  const imageCount = imageMethods().length;
  const moleculeCount = moleculeMethods().length;
  const trackTabs = [
    ['all', 'All methods', imageCount + moleculeCount],
    ['image', 'Image-based', imageCount],
    ['molecule', 'Omics / multimodal', moleculeCount]
  ];
  return h(
    '<div class="page leaderboard-page">',
    '<section class="leaderboard-heading"><div class="leaderboard-intro"><div class="eyebrow">Spatial cell segmentation benchmark <span class="version-tag">V10</span></div><h1>Cell Segmentation Leaderboard <span class="beta">BETA</span></h1><p class="subcopy">Compare image-based and omics or multimodal segmentation methods with their scores, coverage and caveats.</p><div class="heading-side">', imageCount + moleculeCount, ' methods <span>·</span> 2 evidence tracks <span>·</span> Demo snapshot, Sep 2026</div></div><div class="leaderboard-logo-frame"><img class="leaderboard-logo" src="assets/spasegbench-logo.png" width="176" height="124" alt="SpaSegBench logo"></div></section>',
    '<nav class="track-tabs" aria-label="Leaderboard method tracks">', trackTabs.map(([id, label, count]) => '<button class="track-tab ' + (state.leaderboardTrack === id ? 'active' : '') + '" data-action="leaderboard-track" data-value="' + id + '" aria-pressed="' + (state.leaderboardTrack === id) + '">' + label + '<span>' + count + '</span></button>').join(''), '</nav>',
    '<p class="track-note">', state.leaderboardTrack === 'all' ? 'All methods are ordered by dataset coverage. Select a track to rank by its own metrics.' : 'This track is ranked by its selected metric. Return to All methods for the shared coverage ranking.', '</p>',
    state.leaderboardTrack === 'all' ? renderUnifiedCoverageChart() : '',
    state.leaderboardTrack === 'image' ? renderImageLeaderboard() : '',
    state.leaderboardTrack === 'molecule' ? renderMoleculeLeaderboard() : '',
    renderCoverageRanking(),
    '</div>'
  );
}

function renderImageLeaderboard() {
  const rows = filteredImageMethods();
  const chartRows = sortedImageMethods(rows);
  const activeFilters = filterDefs.filter((def) => state.filters[def.key] !== def.options[0]).map((def) => [def.key, def.label, state.filters[def.key]]);
  if (state.more.target !== 'All targets') activeFilters.push(['target', 'Target', state.more.target]);
  if (state.more.gpu !== 'Any GPU') activeFilters.push(['gpu', 'GPU', state.more.gpu]);
  const metric = state.filters.metric;
  const chartNote = metric === 'Speed' || metric === 'VRAM' ? 'Lower is better · direct measured values' : 'Higher is better · 0–100% scale';
  return h(
    '<div class="track-content image-track-content"><div class="track-section-heading"><span class="track-index">01 / IMAGE TRACK</span><h2>Image-based methods</h2><p>Compare segmentation of cells or nuclei from microscopy images.</p></div>',
    '<div class="category-tabs">', ['Overall', 'Nucleus', 'Whole Cell', 'Efficiency', 'Generalization'].map((cat) => '<button class="category-tab ' + (state.category === cat ? 'active' : '') + '" data-action="category" data-value="' + cat + '">' + cat + '</button>').join(''), '</div>',
    '<div class="filter-panel"><div class="filter-row">', filterDefs.map(renderFilter).join(''), renderMore(), '</div>',
    '<div class="quick-picks"><span class="quick-label">Quick picks</span><div class="quick-chip-row">',
    [['overall', 'Best overall'], ['nucleus', 'Nucleus'], ['whole-cell', 'Whole cell'], ['fastest', 'Fastest']].map(([id, label]) => '<button class="quick-chip ' + (state.quickPick === id ? 'active' : '') + '" data-action="quick-pick" data-value="' + id + '">' + label + '</button>').join(''),
    '</div></div><div class="active-filter-row"><strong>', rows.length, ' matching methods</strong>', activeFilters.map(([key, label, value]) => '<button class="active-filter" data-action="remove-filter" data-filter="' + key + '">' + esc(label + ': ' + value) + ' <span aria-hidden="true">×</span></button>').join(''), activeFilters.length ? '<button class="clear-filters" data-action="clear-filters">Clear all</button>' : '', '</div></div>',
    '<section class="overview-section"><div class="overview-head"><div><span class="section-kicker">VISUAL COMPARISON</span><h3 class="section-title">Image method overview</h3></div><button class="overview-toggle" data-action="toggle-overview" aria-expanded="', state.overviewOpen, '">', state.overviewOpen ? 'Hide chart −' : 'Show chart +', '</button></div>',
    state.overviewOpen ? (rows.length ? h('<p class="chart-caption">', esc(metric), ' · ', chartNote, ' · * preview data</p><div class="overview-scroll"><div class="overview-chart">', chartRows.map((m) => methodBar(m, scoreMetric(m), false, metric)).join(''), '</div></div><div class="overview-foot"><span class="legend"><span class="legend-label"><i class="legend-dot"></i> General</span><span class="legend-label"><i class="legend-dot indigo"></i> Foundation</span><span class="legend-label"><i class="legend-dot taupe"></i> Nucleus</span><span class="legend-label"><i class="legend-dot warm"></i> Domain-specific</span></span></div>') : '<p class="chart-caption">No matching methods to display.</p>') : '',
    '</section></div>'
  );
}

function sortedMoleculeMethods(rows) {
  return rows.slice().sort((a, b) => {
    const key = state.moleculeSortKey;
    const direction = state.moleculeSortDir === 'asc' ? 1 : -1;
    return (a[key] - b[key]) * direction || b.overall - a.overall;
  });
}

function renderMoleculeLeaderboard() {
  const rows = sortedMoleculeMethods(filteredMoleculeMethods());
  const tabs = ['Overall', 'General purpose', 'Domain-specific', 'Prior-free', 'Prior-assisted'];
  const activeFilters = moleculeFilterDefs.filter((def) => state.moleculeFilters[def.key] !== def.options[0]).map((def) => [def.key, def.label, state.moleculeFilters[def.key]]);
  if (state.moleculeMore.gpu !== 'Any GPU') activeFilters.push(['gpu', 'GPU', state.moleculeMore.gpu]);
  if (state.moleculeMore.coverage !== 'Any coverage') activeFilters.push(['coverage', 'Coverage', state.moleculeMore.coverage]);
  const metric = state.moleculeFilters.metric;
  const orderedBy = state.moleculeSortKey === 'datasets' ? 'coverage' : 'utility';
  return h(
    '<div class="track-content molecule-track-content"><div class="track-section-heading"><span class="track-index">02 / OMICS / MULTIMODAL TRACK</span><h2>Omics or multimodal methods</h2><p>Nine methods using omics data, multimodal inputs or platform context. Scores are kept separate from image-based results.</p></div>',
    '<div class="category-tabs">', tabs.map((tab) => '<button class="category-tab ' + (state.moleculeTab === tab ? 'active' : '') + '" data-action="molecule-category" data-value="' + tab + '">' + tab + '</button>').join(''), '</div>',
    '<div class="filter-panel"><div class="filter-row">', moleculeFilterDefs.map(renderMoleculeFilter).join(''), renderMoleculeMore(), '</div>',
    '<div class="quick-picks"><span class="quick-label">Quick picks</span><div class="quick-chip-row">',
    [['best-utility', 'Best utility'], ['broad-coverage', 'Broad coverage'], ['no-prior', 'No platform prior'], ['gpu-optional', 'GPU optional']].map(([id, label]) => '<button class="quick-chip ' + (state.moleculeQuickPick === id ? 'active' : '') + '" data-action="molecule-quick-pick" data-value="' + id + '">' + label + '</button>').join(''),
    '</div></div><div class="active-filter-row"><strong>', rows.length, ' matching methods</strong>', activeFilters.map(([key, label, value]) => '<button class="active-filter" data-action="remove-molecule-filter" data-filter="' + key + '">' + esc(label + ': ' + value) + ' <span aria-hidden="true">×</span></button>').join(''), state.moleculeTab !== 'Overall' || activeFilters.length || state.moleculeQuickPick ? '<button class="clear-filters" data-action="clear-molecule-filters">Clear all</button>' : '', '</div></div>',
    '<section class="overview-section"><div class="overview-head"><div><span class="section-kicker">VISUAL COMPARISON</span><h3 class="section-title">Omics / multimodal overview</h3></div><span class="chart-direction">', metric, ' · higher is better</span></div>',
    rows.length ? h('<p class="chart-caption">', metric === 'Coverage' ? 'Datasets in the demo snapshot' : 'Normalized utility within the molecule track', ' · ordered by ', orderedBy, ' · * preview data</p><div class="overview-scroll"><div class="overview-chart omics-chart">', rows.map((m) => methodBar(m, metric === 'Coverage' ? m.datasets : m.overall, false, metric)).join(''), '</div></div><div class="overview-foot"><span class="legend"><span class="legend-label"><i class="legend-dot"></i> General</span><span class="legend-label"><i class="legend-dot warm"></i> Domain-specific</span></span></div>') : '<div class="empty-state"><strong>No methods match these filters.</strong><span>Adjust the omics conditions or clear all filters.</span><button class="clear-filters" data-action="clear-molecule-filters">Clear all filters</button></div>',
    '</section></div>'
  );
}

function allCoverageRows() {
  return methods.slice().sort((a, b) => b.datasets - a.datasets || a.name.localeCompare(b.name));
}

function renderUnifiedCoverageChart() {
  const rows = allCoverageRows();
  return h(
    '<section class="overview-section combined-coverage-section"><div class="overview-head"><div><span class="section-kicker">SHARED INDICATOR</span><h3 class="section-title">Dataset coverage across all methods</h3></div><span class="chart-direction">More datasets · broader evidence</span></div>',
    '<p class="chart-caption">Dataset counts come from the demo snapshot. They indicate coverage, not segmentation quality across tracks.</p>',
    '<div class="overview-scroll"><div class="overview-chart combined-coverage-chart">', rows.map((m) => methodBar(m, m.datasets, false, 'Coverage')).join(''), '</div></div>',
    '<div class="overview-foot"><span class="legend"><span class="legend-label"><i class="legend-dot indigo"></i> Image-based</span><span class="legend-label"><i class="legend-dot warm"></i> Omics / multimodal</span></span></div></section>'
  );
}

function rankingMetricValue(m, all) {
  if (all) return pct(m.track === 'image' ? m.score : m.overall);
  if (m.track === 'molecule') return state.moleculeFilters.metric === 'Coverage' ? m.datasets + ' sets' : pct(m.overall);
  const metric = state.filters.metric;
  if (metric === 'Speed') return num(m.speed, 1) + ' s';
  if (metric === 'VRAM') return num(m.vram, 1) + ' GB';
  if (metric === 'Overall score') return pct(scoreFor(m));
  return num(scoreMetric(m), 2);
}

function renderCoverageRanking() {
  const all = state.leaderboardTrack === 'all';
  const rows = all ? allCoverageRows() : state.leaderboardTrack === 'image' ? sortedImageMethods(filteredImageMethods()) : sortedMoleculeMethods(filteredMoleculeMethods());
  const imageCount = rows.filter((m) => m.track === 'image').length;
  const moleculeCount = rows.length - imageCount;
  const summary = all ? imageCount + ' image · ' + moleculeCount + ' omics / multimodal' : rows.length + ' matching methods';
  const note = all
    ? 'Sorted by dataset coverage, the indicator available for both tracks. This is an evidence-coverage ranking, not a cross-track performance ranking. Equal counts share a rank.'
    : state.leaderboardTrack === 'image'
      ? 'Image methods follow the selected image metric. Scores and rank apply within the image track.'
      : 'Omics / multimodal methods follow the selected track metric. Scores and rank apply within this track.';
  let previousCoverage = null;
  let coverageRank = 0;
  const body = rows.length ? rows.map((m, index) => {
    const isImage = m.track === 'image';
    if (all && m.datasets !== previousCoverage) coverageRank = index + 1;
    previousCoverage = m.datasets;
    const rank = all ? coverageRank : index + 1;
    const metric = isImage ? state.filters.metric : state.moleculeFilters.metric;
    const displayValue = rankingMetricValue(m, all);
    const metricLabel = all ? (isImage ? 'Image overall' : 'Omics utility') : metric;
    const support = isImage ? 'PQ ' + num(m.pq, 2) + ' · Dice ' + num(m.dice, 2) + ' · AP50 ' + num(m.ap50, 2) : 'F1* ' + num(m.f1, 3);
    const caveat = m.simulated ? 'Preview · simulated values' : !isImage && m.prior ? 'Platform prior · detection masked' : isImage ? 'Runtime ' + num(m.speed, 1) + ' s · VRAM ' + num(m.vram, 1) + ' GB' : 'No platform prior';
    const trackLabel = isImage ? 'Image' : 'Omics / multimodal';
    return h(
      '<tr data-method-row="', m.id, '" class="', state.highlighted === m.id ? 'row-highlight' : '', '"><td class="unified-rank">', rank, '</td>',
      '<td><button class="method-button" data-action="open-method" data-id="', m.id, '"><i class="method-orb ', familyClass(m), '"></i><span><strong>', esc(m.name), m.simulated ? ' <em class="preview-badge">Preview</em>' : '', '</strong><small>', esc(all ? trackLabel + ' · ' + m.family : m.family), '</small></span></button></td>',
      '<td class="unified-score"><strong>', displayValue, '</strong><small>', esc(metricLabel), '</small></td>',
      '<td><span class="track-pill ', isImage ? 'image' : 'molecule', '">', trackLabel, '</span></td>',
      '<td class="unified-support">', esc(support), '</td><td class="unified-coverage">', m.datasets, ' sets</td><td class="unified-caveat">', esc(caveat), '</td></tr>'
    );
  }).join('') : '<tr class="unified-empty"><td colspan="7">No methods match these filters. Adjust or clear the selected track’s filters.</td></tr>';
  return h(
    '<section class="leaderboard-section unified-ranking ', all ? 'is-all' : '', '" id="unified-ranking"><div class="overview-head"><div><span class="section-kicker">COMBINED LEADERBOARD</span><h3 class="section-title">', all ? 'All methods · coverage ranking' : state.leaderboardTrack === 'image' ? 'Image method ranking' : 'Omics / multimodal ranking', '</h3></div><p>', summary, '</p></div>',
    '<p class="unified-ranking-note">', note, '</p>',
    '<div class="table-shell"><table class="leaderboard-table unified-table"><colgroup><col class="rank-col"><col class="method-col"><col class="score-col"><col class="track-col"><col class="support-col"><col class="coverage-col"><col class="caveat-col"></colgroup><thead><tr><th scope="col">Rank</th><th scope="col">Method</th><th scope="col">', all ? 'Track score' : 'Selected metric', '</th><th scope="col">Track</th><th scope="col">Supporting metrics</th><th scope="col" class="coverage-heading">Coverage', all ? ' ↓' : '', '</th><th scope="col">Evidence note</th></tr></thead><tbody>', body,
    '</tbody></table></div><div class="table-foot"><span><strong>', rows.length, ' methods shown</strong> · ', all ? 'ranked by dataset coverage' : 'ranked within the selected track', '</span><span>* F1 is report-only. Preview-tagged values are simulated.</span></div></section>'
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
  const dataList = datasets.filter((d) => {
    const matchesQuery = !q || (d.name + ' ' + d.modality + ' ' + d.tissue).toLowerCase().includes(q);
    const matchesFilter = state.exploreFilter === 'All' ||
      (state.exploreFilter === 'Image track' && d.track === 'image') ||
      (state.exploreFilter === 'Omics / multimodal track' && d.track === 'molecule') ||
      (state.exploreFilter === 'Spatial transcriptomics' && d.modality === 'Spatial transcriptomics');
    return matchesQuery && matchesFilter;
  });
  const list = state.exploreTab === 'Methods' ? methodList : dataList;
  return h(
    '<div class="page"><section class="explore-header"><div><div class="eyebrow">Browse the evidence <span class="version-tag">V10</span></div><h1>Explore</h1><p class="subcopy">Find a method or dataset, then inspect its evidence and limits.</p></div></section>',
    '<div class="explore-tabs"><button class="explore-tab ' + (state.exploreTab === 'Methods' ? 'active' : '') + '" data-action="explore-tab" data-value="Methods">Methods</button><button class="explore-tab ' + (state.exploreTab === 'Datasets' ? 'active' : '') + '" data-action="explore-tab" data-value="Datasets">Datasets</button></div>',
    '<div class="explore-toolbar"><input id="explore-search" class="explore-search" type="search" placeholder="Search methods or datasets" value="' + esc(state.exploreQuery) + '" /><div class="explore-filters">',
    (state.exploreTab === 'Methods' ? methodFilters : ['All', 'Image track', 'Omics / multimodal track', 'Spatial transcriptomics']).map((value) => '<button class="explore-filter ' + (state.exploreFilter === value ? 'active' : '') + '" data-action="explore-filter" data-value="' + value + '">' + value + '</button>').join(''),
    '</div></div><div class="explore-result-count">', list.length, ' matching ', state.exploreTab.toLowerCase(), state.exploreTab === 'Methods' ? ' · Image and omics / multimodal scores are separate' : '', '</div>',
    state.exploreTab === 'Methods' ? renderMethodList(list) : renderDatasetList(list)
  , '</div>');
}

function renderMethodList(list) {
  return list.length ? h('<div class="entity-row-head"><div>Method</div><div>Family</div><div>Track</div><div>Score</div><div></div></div><div class="entity-list">', list.map((m) => '<button class="entity-row" data-action="open-method" data-id="' + m.id + '"><div><span class="entity-name"><i class="method-orb ' + familyClass(m) + '"></i><span><strong>' + esc(m.name) + (m.simulated ? ' <em class="preview-badge">Preview</em>' : '') + '</strong><small>' + esc(m.short) + '</small></span></span></div><div class="entity-value">' + esc(m.family) + '</div><div class="entity-value">' + esc(displayTrack(m.track)) + '</div><div class="entity-value score">' + pct(m.track === 'image' ? m.score : m.overall) + '</div><div class="entity-arrow">›</div></button>').join(''), '</div>') : '<div class="empty-state"><strong>No matching methods.</strong><span>Try a broader search.</span></div>';
}

function renderDatasetList(list) {
  return list.length ? h('<div class="entity-row-head"><div>Dataset</div><div>Modality</div><div>Tissue</div><div>Track</div><div></div></div><div class="entity-list">', list.map((d) => '<button class="entity-row" data-action="open-dataset" data-id="' + d.id + '"><div><span class="entity-name"><i class="method-orb ' + (d.track === 'image' ? 'domain' : 'nucleus') + '"></i><span><strong>' + esc(d.name) + '</strong><small>' + esc(d.platform) + ' · ' + esc(d.species) + '</small></span></span></div><div class="entity-value">' + esc(d.modality) + '</div><div class="entity-value">' + esc(d.tissue) + '</div><div class="entity-value">' + esc(displayTrack(d.track)) + '</div><div class="entity-arrow">›</div></button>').join(''), '</div>') : '<div class="empty-state"><strong>No matching datasets.</strong><span>Try a broader search.</span></div>';
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
  const track = quick ? (r.platform === 'CosMx' ? 'image' : 'molecule') : (r.track === 'Image' ? 'image' : 'molecule');
  let recs;
  if (track === 'image') {
    const order = r.target === 'Nucleus' ? ['stardist', 'cellpose-sam', 'cellsam', 'mesmer', 'cellotype'] :
      r.platform === 'CosMx' ? ['mesmer', 'cellpose-sam', 'cellsam', 'cellotype', 'stardist'] :
      r.priority === 'Speed' || r.priority === 'Memory' || r.gpu === 'Not available' ? ['stardist', 'cellpose-sam', 'mesmer', 'cellotype', 'cellsam'] :
      ['cellpose-sam', 'mesmer', 'cellsam', 'stardist', 'cellotype'];
    recs = order.map(methodById).filter((m) => m && (r.gpu !== 'Not available' || m.gpu === 'Optional')).slice(0, 3);
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
    '<section id="recommend-result" class="recommend-result"><div class="result-title"><div><span class="section-kicker">02 / SHORTLIST</span><h2>Methods to inspect</h2><p>', imageTrack ? 'Image-based' : 'Omics / multimodal', ' candidates from the current demo snapshot.</p></div><span class="beta">Rule-based shortlist</span></div>',
    '<div class="recommend-cards">', context.recs.map((m, i) => '<article class="recommend-card"><span class="recommend-rank">0' + (i + 1) + '</span><div><h3>' + esc(m.name) + '</h3><p>' + esc(m.worksFor[0]) + ' · ' + esc(m.notes) + '</p><span>' + m.datasets + ' datasets' + (m.simulated ? ' · Preview values' : '') + (m.prior ? ' · Platform prior' : '') + '</span></div><button class="notes-button" data-action="open-method" data-id="' + m.id + '">Inspect evidence →</button></article>').join(''), '</div>',
    '<p class="recommend-caption">This demo rule set uses platform, track, target, prior availability, priority and GPU availability where applicable. Tissue, downstream goal and numeric parameters are recorded as context but do not affect this shortlist. Compare evidence and caveats before choosing a method.</p></section>'
  );
}

function renderRecommend() {
  const quick = state.recommendMode === 'quick';
  const summary = quick ? [state.recommend.platform, state.recommend.tissue || 'Tissue not set', state.recommend.goal, state.recommend.prior ? 'Prior available' : 'No prior'] : [state.recommend.platform, state.recommend.track + ' track', state.recommend.target, state.recommend.priority, state.recommend.gpu];
  return h(
    '<div class="page"><section class="recommend-header"><div><div class="eyebrow">Benchmark-guided selector <span class="version-tag">V10</span></div><h1>Find your segmentation method</h1><p class="subcopy">Describe your data to build a shortlist with visible evidence and caveats.</p></div></section>',
    '<div class="recommend-mode-switch" role="group" aria-label="Recommendation mode"><button class="' + (quick ? 'active' : '') + '" data-action="recommend-mode" data-value="quick">Quick Mode</button><button class="' + (!quick ? 'active' : '') + '" data-action="recommend-mode" data-value="expert">Expert Mode</button></div>',
    '<div class="recommend-notice">This demo uses a transparent rule set. Some fields provide context only; no learned predictor or measured match probability is active.</div>',
    '<section class="recommend-input-panel"><div class="recommend-panel-head"><span class="section-index">01 / Input</span><h2>', quick ? 'Quick Screening' : 'Expert Screening', '</h2><p>', quick ? 'Designed for Xenium, MERFISH and CosMx workflows. Other platforms are routed to Expert Mode.' : 'Use platform, target, prior and available compute to narrow the demo shortlist. Numeric fields are recorded for context.', '</p></div><div class="recommend-form-grid">',
    quick ? h(
      recommendField('platform', 'Platform', 'select', ['Xenium', 'MERFISH', 'CosMx', 'Stereo-seq', 'Other / Unseen']),
      recommendField('tissue', 'Tissue', 'text', null, 'e.g. breast, brain, liver'),
      recommendField('goal', 'Downstream goal · context', 'select', ['Quantification', 'Detection', 'Assignment', 'Localization', 'Balanced']),
      recommendPriorToggle()
    ) : h(
      '<div class="form-group-label">Dataset and task</div>',
      recommendField('platform', 'Platform', 'select', ['Xenium', 'MERFISH', 'CosMx', 'Stereo-seq', 'Visium HD', 'Other / Custom']),
      recommendField('tissue', 'Tissue', 'text', null, 'Free text accepted'),
      recommendField('track', 'Benchmark track', 'select', ['Omics / multimodal', 'Image']),
      recommendField('target', 'Segmentation target', 'select', ['Whole cell', 'Nucleus']),
      recommendPriorToggle(),
      '<div class="form-group-label">Dataset measurements <span>Context only in this demo</span></div>',
      recommendField('transcriptDensity', 'Transcript density / µm²', 'number'),
      recommendField('transcripts', 'Number of transcripts', 'number'),
      recommendField('genes', 'Number of genes', 'number'),
      recommendField('nnDistance', 'Median NN distance (µm)', 'number'),
      '<div class="form-group-label">Priority and compute <span>Runtime and RAM are context only</span></div>',
      recommendField('priority', 'Priority', 'select', ['Accuracy', 'Generalization', 'Speed', 'Memory']),
      recommendField('gpu', 'GPU', 'select', ['Available', 'Not available']),
      recommendField('memory', 'Max RAM (GB)', 'select', ['8', '16', '32', '64']),
      recommendField('runtime', 'Max runtime (h)', 'select', ['1', '3', '6', '12'])
    ),
    '</div><div class="recommend-actions"><button class="find-button inline" data-action="recommend-run">Generate recommendation →</button><span>', quick ? 'Quick Mode prioritizes covered-platform screening.' : 'Expert Mode prioritizes platform × parameter screening.', '</span></div><div class="selection-summary compact"><div class="summary-tags">', summary.map((x) => '<span class="summary-tag">' + esc(x) + '</span>').join(''), '</div></div></section>',
    renderRecommendationResult(),
    '<section class="recommend-how"><div><span class="section-index">03 / Method</span><h2>How this shortlist works</h2><p>The current demo applies transparent platform and task rules. A learned predictor remains gated until the benchmark has sufficient coverage.</p></div><div class="rule-list"><div><b>01</b><span>Image and molecule evidence stay in separate metric namespaces.</span></div><div><b>02</b><span>Prior-dependent leakage and partial coverage stay visible.</span></div><div><b>03</b><span>Candidates form a shortlist to inspect, not a probability-ranked winner.</span></div></div></section>',
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
    const metricPairs = image ? [['Overall', item.score], ['PQ', item.pq], ['Dice', item.dice], ['AP50', item.ap50]] : [['Utility', item.overall || item.score], ['F1 · report only', item.f1]];
    drawer.innerHTML = h(
      '<button class="drawer-close" data-action="close-drawer" aria-label="Close details">×</button><div class="drawer-head"><div class="eyebrow">', displayTrack(item.track), ' track · method</div><h2>', esc(item.name), '</h2><p>', esc(item.summary), '</p></div>',
      '<div class="drawer-score-grid">', metricPairs.map(([label, value]) => '<div class="drawer-score"><strong>' + pct(value) + '</strong><span>' + label + '</span></div>').join(''), image ? '' : '<div class="drawer-score"><strong>' + item.datasets + '</strong><span>Datasets</span></div>', '</div>',
      '<section class="drawer-section"><h3>Reported metrics</h3><div class="drawer-bars">', metricPairs.map(([label, value]) => '<div class="drawer-bar-row"><span>' + label + '</span><span class="drawer-bar-track"><span style="width:' + Math.round((value || 0) * 100) + '%"></span></span><strong>' + pct(value) + '</strong></div>').join(''), '</div></section>',
      '<section class="drawer-section"><h3>Evidence coverage</h3><p class="drawer-coverage-copy">', item.datasets, ' dataset', item.datasets === 1 ? '' : 's', ' in this demo snapshot. Open dataset records in Explore for platform and tissue context.</p></section>',
      '<section class="drawer-section"><h3>Works well for</h3><div class="drawer-pills">', item.worksFor.map((x) => '<span class="drawer-pill">' + esc(x) + '</span>').join(''), '</div><p style="margin:13px 0 0;color:var(--text-2);font-size:11px;line-height:1.5;">' + esc(item.notes) + '</p></section>',
      item.simulated ? '<div class="drawer-warning"><strong>Preview data.</strong> This method\'s metrics are simulated and will be replaced once benchmark measurements are uploaded.</div>' : '',
      item.prior ? '<div class="drawer-warning"><strong>Prior dependency.</strong> Detection evidence is masked from utility ranking when this method uses a platform segmentation prior.</div>' : '',
      '<div class="drawer-resource-note">Repository and paper links will appear when verified sources are added.</div>'
    );
  } else {
    const related = methods.filter((m) => m.track === item.track).slice(0, 5);
    drawer.innerHTML = h(
      '<button class="drawer-close" data-action="close-drawer" aria-label="Close details">×</button><div class="drawer-head"><div class="eyebrow">', displayTrack(item.track), ' track · dataset</div><h2>', esc(item.name), '</h2><p>', esc(item.description), '</p></div>',
      '<div class="drawer-score-grid"><div class="drawer-score"><strong>', esc(item.platform), '</strong><span>Platform</span></div><div class="drawer-score"><strong>', esc(item.tissue), '</strong><span>Tissue</span></div><div class="drawer-score"><strong>', esc(item.species), '</strong><span>Species</span></div><div class="drawer-score"><strong>', esc(item.count), '</strong><span>Coverage</span></div></div>',
      '<section class="drawer-section"><h3>Methods on this dataset</h3><div class="drawer-pills">', related.map((m) => '<span class="drawer-pill">' + esc(m.name) + '</span>').join(''), '</div></section>',
      '<section class="drawer-section"><h3>Dataset metadata</h3><div class="drawer-bars"><div class="drawer-bar-row"><span>Modality</span><span></span><strong>' + esc(item.modality) + '</strong></div><div class="drawer-bar-row"><span>Tissue</span><span></span><strong>' + esc(item.tissue) + '</strong></div><div class="drawer-bar-row"><span>Track</span><span></span><strong>' + esc(displayTrack(item.track)) + '</strong></div></div></section>',
      item.id === 'xenium-3' ? '<div class="drawer-warning"><strong>Comparability review.</strong> GT source issues are flagged; this dataset is not silently merged with other groups.</div>' : '<div class="drawer-warning" style="border-color:var(--border);color:var(--text-2);background:var(--surface-alt);"><strong>Scope note.</strong> Comparisons are made only within the same comparability group.</div>'
    );
  }
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  document.getElementById('drawer-backdrop').hidden = false;
  drawer.querySelector('.drawer-close')?.focus();
}

function renderRoute() {
  const r = currentRoute();
  const routeChanged = renderedRoute !== r;
  const scrollY = window.scrollY;
  if (routeChanged) state.drawer = null;
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
  if (routeChanged) window.scrollTo({ top: 0, behavior: 'instant' });
  else window.scrollTo({ top: scrollY, behavior: 'instant' });
}

function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(window.__cellsegToast);
  window.__cellsegToast = setTimeout(() => el.classList.remove('show'), 2300);
}

function openAbout() {
  window.__aboutReturnFocus = document.activeElement;
  document.getElementById('about-modal').hidden = false;
  document.querySelector('#about-modal .drawer-close').focus();
}
function closeAbout() {
  document.getElementById('about-modal').hidden = true;
  window.__aboutReturnFocus?.focus();
}

function closeDrawer() {
  state.drawer = null;
  renderDrawer();
  window.__drawerReturnFocus?.focus();
}

function resetMoleculeSelection() {
  state.moleculeTab = 'Overall';
  state.moleculeFilters = { family: 'All families', prior: 'Any prior', evidence: 'All evidence', metric: 'Utility' };
  state.moleculeMore = { gpu: 'Any GPU', coverage: 'Any coverage' };
  state.moleculeSortKey = 'overall';
  state.moleculeSortDir = 'desc';
  state.moleculeOpenFilter = null;
  state.moleculeMoreOpen = false;
  state.moleculeQuickPick = '';
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
    if (!event.target.closest('.filter-wrap')) {
      state.openFilter = null;
      state.moreOpen = false;
      state.moleculeOpenFilter = null;
      state.moleculeMoreOpen = false;
      document.querySelectorAll('.filter-menu, .more-panel').forEach((el) => { el.hidden = true; });
      document.querySelectorAll('.filter-control[aria-expanded="true"]').forEach((el) => el.setAttribute('aria-expanded', 'false'));
    }
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
  else if (act === 'close-drawer') closeDrawer();
  else if (act === 'leaderboard-track') {
    state.leaderboardTrack = action.dataset.value;
    state.openFilter = null;
    state.moreOpen = false;
    state.moleculeOpenFilter = null;
    state.moleculeMoreOpen = false;
    renderRoute();
  }
  else if (act === 'molecule-category') {
    state.moleculeTab = action.dataset.value;
    state.moleculeQuickPick = '';
    renderRoute();
  } else if (act === 'toggle-molecule-filter') {
    state.moleculeOpenFilter = state.moleculeOpenFilter === action.dataset.filter ? null : action.dataset.filter;
    state.moleculeMoreOpen = false;
    state.openFilter = null;
    state.moreOpen = false;
    renderRoute();
  } else if (act === 'toggle-molecule-more') {
    state.moleculeMoreOpen = !state.moleculeMoreOpen;
    state.moleculeOpenFilter = null;
    state.openFilter = null;
    state.moreOpen = false;
    renderRoute();
  } else if (act === 'molecule-filter-choice') {
    state.moleculeFilters[action.dataset.filter] = action.dataset.value;
    state.moleculeOpenFilter = null;
    state.moleculeQuickPick = '';
    if (action.dataset.filter === 'metric') {
      state.moleculeSortKey = action.dataset.value === 'Coverage' ? 'datasets' : 'overall';
      state.moleculeSortDir = 'desc';
    }
    renderRoute();
  } else if (act === 'remove-molecule-filter') {
    const key = action.dataset.filter;
    if (key === 'gpu') state.moleculeMore.gpu = 'Any GPU';
    else if (key === 'coverage') state.moleculeMore.coverage = 'Any coverage';
    else state.moleculeFilters[key] = moleculeFilterDefs.find((def) => def.key === key).options[0];
    if (key === 'metric') { state.moleculeSortKey = 'overall'; state.moleculeSortDir = 'desc'; }
    state.moleculeQuickPick = '';
    renderRoute();
  } else if (act === 'clear-molecule-filters') {
    resetMoleculeSelection();
    renderRoute();
  } else if (act === 'molecule-quick-pick') {
    const id = action.dataset.value;
    resetMoleculeSelection();
    state.moleculeQuickPick = id;
    if (id === 'broad-coverage') { state.moleculeMore.coverage = 'At least 4 datasets'; state.moleculeFilters.metric = 'Coverage'; state.moleculeSortKey = 'datasets'; }
    if (id === 'no-prior') state.moleculeFilters.prior = 'No platform prior';
    if (id === 'gpu-optional') state.moleculeMore.gpu = 'GPU optional';
    renderRoute();
  }
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
    if (action.dataset.filter === 'metric') {
      state.sortKey = ({ 'Overall score': 'score', PQ: 'pq', Dice: 'dice', AP50: 'ap50', Speed: 'speed', VRAM: 'vram' })[action.dataset.value];
      state.sortDir = ['speed', 'vram'].includes(state.sortKey) ? 'asc' : 'desc';
    }
    renderRoute();
    toast(action.dataset.value + ' applied');
  } else if (act === 'remove-filter') {
    const key = action.dataset.filter;
    if (key === 'target') state.more.target = 'All targets';
    else if (key === 'gpu') state.more.gpu = 'Any GPU';
    else state.filters[key] = filterDefs.find((def) => def.key === key).options[0];
    state.quickPick = '';
    renderRoute();
  } else if (act === 'clear-filters') {
    state.filters = { modality: 'All modalities', dataset: 'All datasets', tissue: 'All tissues', metric: 'Overall score' };
    state.more.target = 'All targets';
    state.more.gpu = 'Any GPU';
    state.quickPick = '';
    state.sortKey = 'score';
    state.sortDir = 'desc';
    renderRoute();
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
    state.filters = { modality: 'All modalities', dataset: 'All datasets', tissue: 'All tissues', metric: 'Overall score' };
    state.more.target = 'All targets';
    state.more.gpu = 'Any GPU';
    state.sortKey = 'score';
    state.sortDir = 'desc';
    if (id === 'overall') state.category = 'Overall';
    if (id === 'nucleus') { state.category = 'Nucleus'; state.more.target = 'Nucleus'; state.filters.metric = 'PQ'; state.sortKey = 'pq'; }
    if (id === 'whole-cell') { state.category = 'Whole Cell'; state.more.target = 'Whole cell'; state.filters.metric = 'PQ'; state.sortKey = 'pq'; }
    if (id === 'spatial') { state.filters.modality = 'Spatial transcriptomics'; state.category = 'Generalization'; }
    if (id === 'fastest') { state.category = 'Efficiency'; state.filters.metric = 'Speed'; state.sortKey = 'speed'; state.sortDir = 'asc'; }
    if (id === 'no-tuning') { state.filters.metric = 'Overall score'; toast('Fine-tuning evidence remains explicit in the drawer.'); }
    if (id === 'low-memory') { state.category = 'Efficiency'; state.filters.metric = 'VRAM'; }
    renderRoute();
  } else if (act === 'toggle-overview') {
    state.overviewOpen = !state.overviewOpen;
    renderRoute();
  } else if (act === 'sort') {
    if (state.sortKey === action.dataset.sort) state.sortDir = state.sortDir === 'desc' ? 'asc' : 'desc';
    else { state.sortKey = action.dataset.sort; state.sortDir = ['speed', 'vram'].includes(state.sortKey) ? 'asc' : 'desc'; }
    renderRoute();
  } else if (act === 'sort-molecule') {
    if (state.moleculeSortKey === action.dataset.sort) state.moleculeSortDir = state.moleculeSortDir === 'desc' ? 'asc' : 'desc';
    else { state.moleculeSortKey = action.dataset.sort; state.moleculeSortDir = 'desc'; }
    state.moleculeFilters.metric = state.moleculeSortKey === 'datasets' ? 'Coverage' : 'Utility';
    state.moleculeQuickPick = '';
    renderRoute();
  } else if (act === 'open-method') {
    window.__drawerReturnFocus = action;
    state.drawer = { type: 'method', id: action.dataset.id };
    renderDrawer();
  } else if (act === 'open-dataset') {
    window.__drawerReturnFocus = action;
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
    document.getElementById('recommend-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    toast('Recommendation updated');
  }
});

document.addEventListener('input', (event) => {
  if (event.target.dataset.action === 'recommend-text') {
    state.recommend[event.target.dataset.key] = event.target.value;
    state.recommendVisible = false;
    document.querySelector('.recommend-result')?.setAttribute('hidden', '');
    const hint = document.querySelector('.recommend-actions > span');
    if (hint) hint.textContent = 'Inputs changed. Generate a new shortlist.';
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
  if (target.dataset.action === 'molecule-more-choice') {
    state.moleculeMore[target.dataset.more] = target.value;
    state.moleculeMoreOpen = true;
    state.moleculeQuickPick = '';
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
    else if (state.drawer) closeDrawer();
    else { state.openFilter = null; state.moreOpen = false; state.moleculeOpenFilter = null; state.moleculeMoreOpen = false; renderRoute(); }
  }
});

document.getElementById('drawer-backdrop').addEventListener('click', closeDrawer);
document.getElementById('about-modal').addEventListener('click', (event) => { if (event.target.id === 'about-modal') closeAbout(); });
window.addEventListener('hashchange', renderRoute);
renderRoute();
