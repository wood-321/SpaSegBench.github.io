/* SpaSegBench interface. SpaSegCompass uses the auditable scheme_ver2 engine. */
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const byMethod = id => methods.find(m=>m.id===id);
const byDataset = id => datasets.find(d=>d.id===id||d.aliases?.includes(String(id).toLowerCase()));
const trackName = t => t==='image'?'Image':t==='both'?'Both tracks':'Transcript / multimodal';
const percent = v => v==null?'—':Math.round(v*100)+'%';
const numeric = v => typeof v==='number'&&Number.isFinite(v)?v.toFixed(3):'—';
const metricNumber = (v,key) => typeof v==='number'&&Number.isFinite(v)&&['image_tp','image_fp','image_fn','oversegmentation','undersegmentation','matched','datasets'].includes(key)?v.toLocaleString('en-US',{maximumFractionDigits:1}):numeric(v);
const duration = s => s==null?'—':s<60?Math.round(s)+' s':s<3600?(s/60).toFixed(1)+' min':(s/3600).toFixed(1)+' h';
const axisLabel = a => ({detection:'Detection',overlap:'Overlap',boundary:'Boundary',instance:'Instance quality',assignment:'Correct assignment',quantification:'Count agreement',expression:'Expression profile',localization:'Localization'})[a]||a;
const metricLabels = {
  dice:'Dice',iou:'IoU',pixel_accuracy:'Pixel accuracy',boundary_f1:'Boundary F1',boundary_precision:'Boundary precision',boundary_recall:'Boundary recall',
  image_f1:'Detection F1',image_precision:'Detection precision',image_recall:'Detection recall',image_tp:'TP',image_fp:'FP',image_fn:'FN',dq:'DQ',sq:'SQ',pq:'PQ',aji:'AJI',mda:'mDA',oversegmentation:'Over-segmentation (source)',undersegmentation:'Under-segmentation (source)',
  cell_ratio:'Predicted / reference cells',matched:'Matched cells',precision:'Detection precision',recall:'Detection recall',f1:'Detection F1',loc_mean_um:'Mean localization error · µm',loc_median_um:'Median localization error · µm',loc_p95_um:'p95 localization error · µm',count_pearson:'Count Pearson',count_spearman:'Count Spearman',count_mae:'Count MAE',count_rmse:'Count RMSE',vec_cosine:'Expression cosine',vec_js_dist:'Expression JS distance',vec_pearson:'Expression Pearson',assign_accuracy:'Conditional assignment accuracy',pred_assign_rate:'Assignment rate',overall_correct:'Overall correct assignment',median_diameter_um:'Median diameter · µm',coverage_fraction:'Coverage fraction'
};
const lowerIsBetter = key => /loc_|mae|rmse|js_dist|medianRank/.test(key)||['image_fp','image_fn','oversegmentation','undersegmentation'].includes(key);
const defaults = {track:'molecule',goal:'Balanced',platform:'Xenium',target:'Whole cell',input:'image_transcripts',priorType:'none',stain:'unknown',allowPrior:'yes',gpu:'Available',priority:'Accuracy',dimension:'2D',analyte:'RNA',species:'Unknown',tissue:'',memory:'',vram:'',runtime:'',genes:'',transcripts:'',pixels:'',density:'',pixelSize:'',minRecall:'',minAssignment:'',minPQ:'',maxP95:''};
const state = {track:'image',query:'',metric:'pq',direction:'desc',platform:'',dataset:'',prior:'',evidence:'',libraryTab:'methods',libraryQuery:'',visual:{method:''},images:[],imageStatus:'loading',rec:{...defaults},result:null};
let previousRoute = '';
function route(){const r=location.hash.replace(/^#\/?/,'');return r==='main-content'?(previousRoute||'leaderboard'):r==='research-form'?'recommend':['recommend','visuals','explore'].includes(r)?r:'leaderboard';}
function glyph(name){const p={expand:'<path d="M3 8V3h5m4 0h5v5M3 12v5h5m4 0h5v-5"/>',search:'<circle cx="8.8" cy="8.8" r="5.6"/><path d="m13 13 4 4"/>',image:'<rect x="3" y="3" width="14" height="14" rx="3"/><circle cx="7.5" cy="7.5" r="1"/><path d="m4 14 4-4 3 3 2-2 4 4"/>',arrow:'<path d="M4 10h12m-5-5 5 5-5 5"/>',chart:'<path d="M4 16V9m6 7V4m6 12V7"/>',layers:'<path d="m10 2 8 4-8 4-8-4Zm-8 8 8 4 8-4M2 14l8 4 8-4"/>',spark:'<path d="m10 2 2.2 5.8L18 10l-5.8 2.2L10 18l-2.2-5.8L2 10l5.8-2.2Z"/>'};return '<svg viewBox="0 0 20 20" aria-hidden="true">'+(p[name]||p.arrow)+'</svg>';}
function optionList(options,selected){return options.map(o=>{const [v,l]=Array.isArray(o)?o:[o,o];return '<option value="'+esc(v)+'"'+(v===selected?' selected':'')+'>'+esc(l)+'</option>';}).join('');}
function selectControl(label,key,options,value,action='filter'){return '<label class="select-control"><span>'+label+'</span><select id="'+action+'-'+key+'" aria-label="'+label+'" data-change="'+action+'" data-key="'+key+'">'+(options.length?optionList(options,value):'<option>No shared metrics</option>')+'</select></label>';}
function sectionNav(active){return '<nav class="section-nav" aria-label="Benchmark views">'+[['leaderboard','#/','Performance'],['visuals','#/visuals','Segmentation gallery'],['explore','#/explore','Methods & datasets']].map(([id,href,label])=>'<a href="'+href+'" class="'+(active===id?'active':'')+'"'+(active===id?' aria-current="page"':'')+'>'+label+'</a>').join('')+'</nav>';}
function hero(view){
  const titles={leaderboard:['Cell segmentation leaderboard','Compare methods. Understand the evidence.'],visuals:['Segmentation gallery','Inspect original images, segmentation overlays and masks.'],explore:['Methods & datasets','Explore the methods and trace their measured evidence.']};
  return '<section class="page-heading"><div><p class="eyebrow">Spatial cell segmentation benchmark</p><h1>'+titles[view][0]+'</h1><p class="subtitle">'+titles[view][1]+'</p><p class="snapshot-line"><span>'+methods.length+' methods</span><span>'+datasets.length+' dataset labels</span><span>Updated 19 Oct 2026</span></p></div><div class="hero-logo-frame"><img src="assets/spasegbench-logo.png" alt="SpaSegBench" width="432" height="313"></div></section>';
}
const projectLinks={paper:'assets/paper/SpaSegBench.pdf',github:'https://github.com/Hussar1025/SpaSeg'};
const metricAvailability=new Map();
function sharedMetricKeys(track){return benchmarkEngine.sharedMetrics[track]||[];}
function availableMetricKeys(track,filters={}){
  const cacheKey=JSON.stringify([track,filters.platform||'',filters.dataset||'',filters.prior||'']);
  if(!metricAvailability.has(cacheKey)){
    const rows=benchmarkEngine.select({...filters,track}),ids=[...new Set(rows.map(r=>r.methodId))];
    metricAvailability.set(cacheKey,sharedMetricKeys(track).filter(key=>ids.length&&ids.every(id=>rows.some(r=>r.methodId===id&&r.metrics[key]?.status==='measured'&&Number.isFinite(r.metrics[key]?.value)))));
  }
  return metricAvailability.get(cacheKey);
}
function metricOptions(){
  const order=state.track==='image'?['pq','dice','iou','pixel_accuracy','boundary_f1','boundary_precision','boundary_recall','image_precision','image_recall','image_f1','dq','sq','aji','mda','image_tp','image_fp','image_fn','oversegmentation','undersegmentation']:['f1','precision','recall','cell_ratio','matched','count_pearson','count_spearman','count_mae','count_rmse','vec_cosine','vec_pearson','vec_js_dist','loc_mean_um','loc_median_um','loc_p95_um','assign_accuracy','median_diameter_um'];
  const available=availableMetricKeys(state.track,{platform:state.platform,dataset:state.dataset,prior:state.prior});
  return order.filter(k=>available.includes(k)).map(k=>[k,metricLabels[k]]);
}
function projectLink(kind,label){const url=projectLinks[kind];return /^(https:\/\/|assets\/paper\/)/.test(url)?'<a class="project-link '+kind+'" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+label+glyph('arrow')+'</a>':'<button class="project-link '+kind+'" type="button" disabled title="Link coming soon" aria-label="'+label+' — link coming soon">'+label+glyph('arrow')+'</button>';}
function landingHero(){
  return '<section class="landing-hero" aria-labelledby="landing-title"><div class="landing-copy"><p class="landing-kicker">SpaSegBench</p><h1 id="landing-title">Benchmarking<br><span>cell segmentation.</span></h1><p class="landing-description">A unified comparison of 16 segmentation methods across 31 spatial transcriptomics datasets. Explore accuracy, robustness and computational cost, and use SpaSegCompass to find methods suited to your data and analysis.</p><div class="project-links">'+projectLink('paper','Paper')+projectLink('github','GitHub')+'</div></div><div class="landing-art"><img class="segmentation-motif" src="assets/segmentation-motif.svg" alt="" aria-hidden="true" width="520" height="440"><div class="landing-logo"><img src="assets/spasegbench-logo.png" alt="SpaSegBench" width="432" height="313"></div><span class="art-orbit orbit-one" aria-hidden="true"></span><span class="art-orbit orbit-two" aria-hidden="true"></span></div></section>';
}
function rankRows(){
  const rows=benchmarkEngine.summarize({track:state.track,platform:state.platform,dataset:state.dataset,prior:state.prior}).filter(m=>(!state.query||(m.name+' '+m.family).toLowerCase().includes(state.query.trim().toLowerCase()))&&(!state.evidence||(state.evidence==='usable'?m.nGroups>0:m.excludedRows>0)));
  const key=state.track==='all'?'datasets':state.metric;
  return rows.sort((a,b)=>a[key]==null&&b[key]==null?a.name.localeCompare(b.name):a[key]==null?1:b[key]==null?-1:(a[key]-b[key])*(state.direction==='asc'?1:-1)||(key==='medianRank'?benchmarkEngine.compare(a,b):a.name.localeCompare(b.name)));
}
function formatMetric(m){const k=state.track==='all'?'datasets':state.metric;return k==='datasets'?m.datasets:k==='medianRank'?(m[k]==null?'—':Number(m[k].toFixed(2))):metricNumber(m[k],k);}
function priorLabel(prior){return prior===true?'With prior':prior===false?'No platform prior':'Prior unconfirmed';}
function rankDistribution(m,k){
  const scores=m.scores.filter(s=>Number.isFinite(s.utility)&&Number.isFinite(s.rank)),counts=Array(k).fill(0);
  for(const s of scores){const whole=Math.floor(s.rank),part=s.rank-whole;counts[whole-1]+=1-part;if(part&&whole<k)counts[whole]+=part;}
  if(!scores.length)return '<span class="metric-support">No complete groups</span>';
  const label=counts.map((n,i)=>'Rank '+(i+1)+': '+Number(n.toFixed(2))+' groups').join('; ');
  return '<div class="rank-distribution" role="img" aria-label="'+label+'">'+counts.map((n,i)=>{const alpha=n?0.12+0.88*Math.sqrt(n/scores.length):0;return '<span title="Rank '+(i+1)+': '+Number(n.toFixed(2))+' groups" style="background:rgba(3,53,113,'+alpha+');color:'+(alpha>.5?'white':'var(--secondary)')+'">'+(n?Number(n.toFixed(1)):'')+'</span>';}).join('')+'</div>';
}

function trackHighlights(){
  return '<div class="track-tabs" role="group" aria-label="Evidence track">'+['image','molecule'].map(track=>'<button id="track-'+track+'" class="track-tab'+(state.track===track?' active':'')+'" data-action="track" data-id="'+track+'" aria-pressed="'+(state.track===track)+'">'+glyph(track==='image'?'image':'layers')+'<span>'+(track==='image'?'Image-based':'Transcript / multimodal')+'</span><small>'+methods.filter(m=>m.track===track).length+'</small></button>').join('')+'</div>';
}
function metricInterpretation(key){
  if(key==='medianRank')return 'Lower rank is better';
  if(key==='datasets')return 'Coverage, not quality';
  if(['image_tp','image_fp','image_fn','oversegmentation','undersegmentation','cell_ratio','matched','median_diameter_um','coverage_fraction','pred_assign_rate'].includes(key))return 'Descriptive measurement';
  return lowerIsBetter(key)?'Lower is better':'Higher is better';
}
function selectedMetricLabel(){return metricOptions().find(([key])=>key===state.metric)?.[1]||metricLabels[state.metric]||'Shared metrics';}
function rankingScope(){return state.dataset?byDataset(state.dataset)?.name||state.dataset:state.platform||'All datasets';}
function rankingTable(rows){
  const key=state.metric,split=Math.ceil(rows.length/2);let previous=Symbol(),rank=0;
  const items=rows.map((m,i)=>{if(m[key]!==previous)rank=i+1;previous=m[key];return '<li><button class="ranking-item" data-action="method" data-id="'+m.id+'" aria-label="'+esc(m.name+', '+selectedMetricLabel()+': '+formatMetric(m))+'"><span class="ranking-position">'+(m[key]==null?'—':rank+'.')+'</span><span class="ranking-name">'+esc(m.name)+'</span><strong class="ranking-value">'+formatMetric(m)+'</strong></button></li>';});
  return rows.length?'<div class="ranking-columns" aria-label="'+esc(selectedMetricLabel())+' method ranking"><ol class="ranking-list">'+items.slice(0,split).join('')+'</ol><ol class="ranking-list" start="'+(split+1)+'">'+items.slice(split).join('')+'</ol></div>':'<div class="empty-compact"><strong>No matching methods</strong><button class="text-button" data-action="reset-filters">Clear filters</button></div>';
}
function chart(rows){
  const key=state.metric,values=rows.map(m=>m[key]).filter(Number.isFinite),min=Math.min(0,...values),max=Math.max(0,...values)||(!values.some(v=>v<0)?1:0),span=max-min||1,zero=(0-min)/span*100;
  return '<section id="comparison-chart" class="ranking-chart" aria-labelledby="chart-title"><div class="chart-heading"><h3 id="chart-title">'+esc(selectedMetricLabel())+' ranking</h3><span>'+metricInterpretation(key)+'</span></div><div class="vertical-chart" style="--bar-count:'+Math.max(rows.length,1)+'"><div class="chart-grid" aria-hidden="true">'+[...new Set([max,min+span/2,min,0])].map(v=>'<div class="chart-tick'+(v===0?' zero-tick':'')+'" style="bottom:'+(v-min)/span*100+'%"><span>'+(v===0?'0.0':numeric(v))+'</span></div>').join('')+'</div><div class="chart-columns">'+rows.map((m,i)=>'<button class="chart-column'+(i===0&&m[key]!=null?' leading':'')+'" data-action="method" data-id="'+m.id+'" aria-label="'+esc(m.name+', '+selectedMetricLabel()+': '+formatMetric(m))+'"><span class="column-value">'+formatMetric(m)+'</span><span class="column-plot" aria-hidden="true">'+(Number.isFinite(m[key])?'<i class="column-bar" style="bottom:'+Math.min(zero,(m[key]-min)/span*100)+'%;height:'+Math.abs(m[key])/span*100+'%"></i>':'<span class="column-missing">—</span>')+'</span><span class="column-name">'+esc(m.name)+'</span></button>').join('')+'</div></div></section>';
}
function renderLeaderboard(){
  const options=metricOptions();if(!options.some(([key])=>key===state.metric)){state.metric=options[0]?.[0]||'';state.direction=lowerIsBetter(state.metric)?'asc':'desc';}const rows=rankRows(),label=selectedMetricLabel();
  return '<div class="page leaderboard-page">'+landingHero()+'<div class="leaderboard-heading"><h2>Leaderboard</h2><span>'+methods.length+' methods · '+datasets.length+' datasets</span></div><div class="benchmark-navigation">'+trackHighlights()+'<a class="gallery-jump" href="#gallery">View gallery ↓</a></div><section class="benchmark-card" aria-label="Method leaderboard"><div class="ranking-toolbar"><h2>'+(state.track==='image'?'Image-based':'Transcript / multimodal')+' methods ranking on <span>'+esc(label)+'</span></h2><div class="ranking-filters">'+selectControl('Metric','metric',metricOptions(),state.metric)+selectControl('Platform','platform',[['','All platforms'],...new Set(datasets.map(d=>d.platform))],state.platform)+selectControl('Dataset','dataset',[['','All datasets'],...datasets.filter(d=>!state.platform||d.platform===state.platform).map(d=>[d.id,d.name])],state.dataset)+(state.track==='molecule'?selectControl('Platform prior','prior',[['','All states'],['no','Without prior'],['yes','With prior'],['unknown','Unconfirmed']],state.prior):'')+'</div></div>'+(options.length?chart(rows):'')+'<div class="ranking-caption"><h3>'+esc(label)+' leaderboard</h3><span>'+esc(rankingScope())+' · Median</span></div>'+rankingTable(options.length?rows:[])+'</section>'+gallerySection()+'</div>';
}
function imagePath(v){return typeof v==='string'&&/^assets\/[a-zA-Z0-9_./-]+\.(png|jpe?g|webp|avif)$/i.test(v)&&!v.includes('..')?v:'';}
function galleryLabel(r){return r.datasetLabel||byDataset(r.datasetId)?.name||r.platform;}
function visualRows(){return state.images.filter(r=>!state.visual.method||r.methodId===state.visual.method);}
function gallerySection(standalone=false){
  const rows=visualRows(),heading=standalone?'h1':'h2';
  let content;
  if(state.imageStatus==='loading')content='<div class="gallery-empty" role="status"><h3>Loading images…</h3></div>';
  else if(state.imageStatus==='error')content='<div class="gallery-empty" role="status"><h3>Images could not be loaded</h3><button class="text-button" data-action="retry-images">Try again</button></div>';
  else if(!rows.length)content='<div class="gallery-empty"><h3>'+(state.images.length?'No matching images':'Segmentation images coming soon')+'</h3><p>'+(state.images.length?'Choose another method.':'No visualization files have been added yet.')+'</p></div>';
  else content='<div class="image-grid selected-figures'+(rows.length===1?' single-figure':'')+'">'+rows.map(r=>{const title=byMethod(r.methodId).name+' · '+galleryLabel(r);return '<article class="image-card"><button class="image-open" data-action="image" data-id="'+esc(r.id)+'" aria-label="Enlarge '+esc(title)+'"><img src="'+imagePath(rows.length===1?r.image:r.thumbnail)+'" alt="'+esc(title)+'" loading="lazy" decoding="async" width="'+r.width+'" height="'+r.height+'"><span class="image-zoom" aria-hidden="true">View figure '+glyph('arrow')+'</span></button><div class="image-caption"><strong>'+esc(byMethod(r.methodId).name)+'</strong><span>'+esc(galleryLabel(r))+'</span></div></article>';}).join('')+'</div>';
  return '<section id="gallery" class="gallery-section" aria-labelledby="gallery-title"><div class="gallery-heading"><'+heading+' id="gallery-title">Segmentation gallery</'+heading+'><div class="gallery-filters method-filter">'+selectControl('Method','method',[['','All methods'],...methods.map(m=>[m.id,m.name])],state.visual.method,'visual')+'</div></div><div class="gallery-surface curated-gallery">'+content+'</div></section>';
}
function renderVisuals(){return '<div class="page gallery-page">'+gallerySection(true)+'</div>';}
async function loadImages(){
  state.imageStatus='loading';
  // A classic script also loads under file://, where fetching local JSON is blocked.
  try{const rows=segmentationResults,ids=new Set();if(!Array.isArray(rows))throw Error('Invalid manifest');state.images=rows.map(r=>{if(!r||!r.id||ids.has(r.id)||!byMethod(r.methodId)||!galleryTissues.some(([id])=>id===r.galleryGroup)||!['Xenium','MERFISH'].includes(r.platform)||typeof r.datasetLabel!=='string'||!r.datasetLabel||!imagePath(r.image)||!imagePath(r.thumbnail)||!Number.isInteger(r.width)||!Number.isInteger(r.height)||r.width<=0||r.height<=0)throw Error('Invalid record');ids.add(r.id);return {...r};});state.imageStatus='ready';}catch{state.images=[];state.imageStatus='error';}render();
}
function renderLibrary(){
  const isMethod=state.libraryTab==='methods',q=state.libraryQuery.toLowerCase().trim(),rows=(isMethod?methods:datasets).filter(r=>(r.name+' '+(r.platform||r.family)+' '+(r.tissue||'')).toLowerCase().includes(q));
  return '<div class="page">'+hero('explore')+sectionNav('explore')+'<section class="library-panel"><div class="board-toolbar"><div class="track-switch" role="group" aria-label="Library category">'+['methods','datasets'].map(k=>'<button data-action="library-tab" data-id="'+k+'" class="'+(state.libraryTab===k?'active':'')+'" aria-pressed="'+(state.libraryTab===k)+'">'+(k==='methods'?'Methods':'Datasets')+' <small>'+(k==='methods'?methods.length:datasets.length)+'</small></button>').join('')+'</div><label class="search-field">'+glyph('search')+'<input id="library-search" type="search" aria-label="Search library" placeholder="Search the library…" value="'+esc(state.libraryQuery)+'"></label></div><div class="library-list">'+rows.map(r=>'<button class="library-item" data-action="'+(isMethod?'method':'dataset')+'" data-id="'+r.id+'"><span class="library-name">'+esc(r.name)+'</span><span class="library-description">'+esc(isMethod?r.short:r.platform+' · '+r.tissue)+'</span><span class="library-meta">'+esc(isMethod?trackName(r.track):r.species||'Unconfirmed')+'</span>'+glyph('arrow')+'</button>').join('')+(!rows.length?'<div class="empty-compact">No matching records</div>':'')+'</div><div class="table-footer">'+rows.length+' records · Select a row to inspect the evidence.</div></section></div>';
}
function recField(key,label,options,hint=''){return '<label class="rec-field"><span>'+label+'</span><select id="rec-'+key+'" data-change="recommend" data-key="'+key+'">'+optionList(options,state.rec[key])+'</select>'+(hint?'<small>'+hint+'</small>':'')+'</label>';}
function recInput(key,label,type='number',hint=''){return '<label class="rec-field"><span>'+label+'</span><input id="rec-'+key+'" data-rec-input="'+key+'" type="'+type+'"'+(type==='number'?' min="0" step="any"':'')+' value="'+esc(state.rec[key])+'" placeholder="Optional">'+(hint?'<small>'+hint+'</small>':'')+'</label>';}
function sectionTitle(n,title){return '<div class="form-section-title"><h2>'+title+'</h2></div>';}

function conditionCount(kind){
  const keys=kind==='budget'?['memory','vram','runtime']:['tissue','species','genes','transcripts','pixels','pixelSize','density','dimension','analyte','minRecall','minAssignment','minPQ','maxP95'];
  const count=keys.filter(k=>state.rec[k]!==''&&state.rec[k]!==defaults[k]).length+(kind==='advanced'&&state.rec.customWeights?1:0);
  return count?count+' set':'Optional';
}
function renderRecommend(){
  const r=state.rec;
  return '<div class="page compass-page"><section class="page-heading compass-hero"><div><h2>SpaSegCompass</h2><span class="target-label">Whole-cell segmentation</span></div><div class="hero-logo-frame"><img src="assets/spasegbench-logo.png" alt="SpaSegBench" width="432" height="313"></div></section>'+
  '<form id="research-form" class="compass-form" novalidate><div class="compass-workspace"><section class="form-section data-section">'+sectionTitle('01','Describe your data','Choose the inputs you can provide.')+'<div class="rec-grid">'+
  recField('track','Evidence track',[['molecule','Transcript / multimodal'],['image','Image segmentation']])+
  recField('platform','Data platform',['Xenium','MERFISH','CosMx','Stereo-seq','STARmap','Visium HD',['Other','Another / new platform']])+
  recField('input','Available inputs',[['image_transcripts','Registered images + RNA'],['transcripts','RNA coordinates only'],['image','Images only'],['bins','Weighted bins / GEM']])+
  recField('stain','Staining',[['unknown','Not yet confirmed'],['nuclear','Nuclear stain only'],['nuclear_membrane','Nuclear + membrane'],['he','H&E'],['none','No staining image']])+
  recField('priorType','Available segmentation prior',[['none','None'],['platform','Platform segmentation'],['external_nuclei','External nuclear masks'],['centroids','Nuclear centers'],['unknown','Not yet confirmed']])+
  (r.priorType==='none'?recField('allowPrior','Generate a prior from images?',[['yes','Allow a nuclear segmentation step'],['no','Use existing inputs only']]):'')+
  '</div></section><section class="form-section goal-section">'+sectionTitle('02','Set your goal','Match the comparison to your analysis.')+'<div class="rec-grid">'+
  recField('goal','Downstream analysis',Object.keys(benchmarkEngine.profiles[r.track]).map(k=>[k,({Balanced:'Balanced performance',Morphology:'Cell shape & boundaries',Detection:'Cell detection & composition',Quantification:'Expression quantification',Typing:'Cell typing',Spatial:'Spatial relationships'})[k]]))+
  recField('gpu','GPU availability',[['Available','GPU available'],['Not available','CPU only']])+
  '</div><div class="compass-submit"><button type="submit" class="primary-button">Find suitable methods '+glyph('arrow')+'</button></div></section></div>'+
  '<details id="resource-options" class="advanced-settings"><summary>Resource limits <span id="budget-count">'+conditionCount('budget')+'</span></summary><p class="field-note">Optional limits screen historical runs. They do not predict the cost of a new sample.</p><div class="rec-grid">'+recField('priority','Practical priority',[['Accuracy','Quality evidence'],['Speed','Time budget'],['Memory','Memory budget']])+recInput('memory','Available RAM · GiB')+(r.gpu==='Available'?recInput('vram','VRAM per GPU · GiB','number','Use single-card capacity, not the sum across GPUs.'):'')+recInput('runtime','Time budget · hours')+'</div></details>'+
  '<details id="advanced-options" class="advanced-settings"><summary>Advanced conditions <span id="advanced-count">'+conditionCount('advanced')+'</span></summary><div class="rec-grid">'+recInput('tissue','Tissue','text')+recField('species','Species',['Unknown','Human','Mouse','Other'])+recInput('genes','Panel size · genes')+recInput('transcripts','Processed RNA molecule count','number','Count molecules after filtering; panel size is not a substitute.')+recInput('pixels','Processed image pixels')+recInput('pixelSize','Pixel size · µm')+recInput('density','Estimated cell density · cells / mm²','number','For planning the pilot; no calibrated density-specific ranking is available.')+recField('dimension','Spatial dimension',['2D','3D'])+recField('analyte','Molecule type',['RNA',['protein','Protein']])+recInput('minRecall','Minimum detection recall · 0–1')+(r.track==='image'?recInput('minPQ','Minimum PQ · 0–1'):recInput('maxP95','Maximum p95 localization error · µm'))+'</div><p class="field-note">Requirements remain unverified when independent measurements are missing. RNA count and processed image size guide the pilot; this release has no validated size-to-cost model.</p><fieldset class="custom-weights"><legend>Custom quality weights · % <small>Optional; must total 100</small></legend><div class="rec-grid">'+Object.entries(benchmarkEngine.weights(r.track,r.goal)).map(([k,v])=>'<label class="rec-field"><span>'+axisLabel(k)+'</span><input id="weight-'+k+'" type="number" min="0" max="100" step="any" data-weight="'+k+'" value="'+(r.customWeights?r.customWeights[k]*100:v*100)+'"></label>').join('')+'</div><button type="button" class="text-button" data-action="reset-weights">Use goal defaults</button></fieldset></details>'+
  '</form>'+
  renderResults()+'</div>';
}
function resourcePanel(r){return '<div class="resource-panel"><div class="resource-heading"><strong>Observed resources</strong><span class="badge">'+esc(r.status)+'</span></div><div class="resource-facts"><div><b>'+duration(r.runtimeMedian)+'</b><span>median time</span></div><div><b>'+(r.ramMedian==null?'—':r.ramMedian.toFixed(1))+'</b><span>median RAM · GiB</span></div><div><b>'+(r.vramMax==null?'—':r.vramMax.toFixed(1))+'</b><span>peak / GPU · GiB</span></div></div><p>'+esc(r.note)+'</p><small>'+esc(r.mode)+' · '+r.total+' total runs · '+r.withinBudget+' in-mode runs within entered limits. Historical measurements, not forecasts.</small>'+(r.modes?.length>1?'<div class="mode-breakdown">'+r.modes.map(m=>'<span><b>'+m.label+'</b> · '+m.runs+' runs · '+duration(m.runtimeMedian)+' median time</span>').join('')+'</div>':'')+'</div>';}
function candidateCard(c,i){
  const b=c.bounds,independent=c.independentBounds;
  return '<article class="compass-card" style="--card-index:'+i+'"><div class="candidate-kicker"><span>'+(i+1)+'. '+(i?'Alternative to test':'Candidate to test')+'</span><span class="conditional-tag">Conditional</span></div><h3>'+esc(c.name)+'</h3><p class="candidate-summary">'+(b?'A descriptive comparison across '+c.nGroups+' shared group(s).':'Input-compatible configuration; no shared quality ranking is available.')+'</p>'+
  '<div class="evidence-score"><div><span>Quality evidence bound</span><b>'+(b?numeric(b.lower)+'–'+numeric(b.upper):'Not ranked')+'</b></div><div><span>Weighted coverage</span><b>'+percent(b?.coverage)+'</b></div></div>'+
  (b?'<div class="axis-profile">'+Object.entries(c.axes).map(([k,a])=>'<div><span>'+axisLabel(k)+'</span><div class="axis-rail"><i class="axis-unknown" style="left:'+a.lower*100+'%;width:'+(a.upper-a.lower)*100+'%"></i><i style="width:'+a.lower*100+'%"></i></div><small>'+percent(a.coverage)+' known</small></div>').join('')+'</div><p class="field-note">Hatched ranges represent missing evidence. Independently referenced weighted coverage: '+percent(independent?.coverage)+'.</p>':'')+
  '<h4>Why it is here</h4><ul class="reason-list">'+c.reasons.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>'+resourcePanel(c.resources)+
  '<div class="candidate-context"><h4>Preparation & conditions</h4><ul>'+[...c.preparation,...c.conditions].map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul><p>Quality requirement status: '+esc(c.qualityFloorStatus.replaceAll('_',' '))+'.</p><p>Matched context: '+esc(c.supportFeatures.join(', ')||'none verified')+'. Unresolved features: '+esc(c.unknownFeatures.join(', ')||'see configuration conditions')+'.</p></div>'+
  '</article>';
}
function renderResults(){
  const result=state.result;if(!result)return '';
  const names={invalid_input:'Check your inputs',pilot_required:'A pilot is needed',no_feasible_candidate:'Review your available inputs',conditional_candidates:'Your starting shortlist'};
  return '<section class="recommend-results compass-results" id="recommend-results" tabindex="-1" aria-labelledby="results-title"><div class="results-heading"><div><p class="eyebrow">Your results</p><h2 id="results-title">'+(names[result.decision]||'Your shortlist')+'</h2></div></div><p class="result-intro">'+esc(result.reason)+'</p><div class="compass-cards">'+result.rows.map(candidateCard).join('')+'</div>'+
  (result.rows.length?'<div class="pilot-plan"><div><p class="eyebrow">Next step</p><h3>Validate on a small,<br>representative region.</h3></div><ol>'+result.pilot.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ol></div>':'')+
  (result.warnings.length?'<div class="result-context"><h3>Evidence limits & interpretation</h3>'+result.warnings.map(t=>'<p>'+esc(t)+'</p>').join('')+'</div>':'')+
  '<p class="weight-note">Quality weights: '+Object.entries(result.weights).map(([k,v])=>axisLabel(k)+' '+percent(v)).join(' · ')+'.</p></section>';
}
function openDetail(kind,id){
  const m=kind==='method'?byMethod(id):byDataset(id);if(!m)return;
  const filters={track:m.track,...(route()==='leaderboard'?{platform:state.platform,dataset:state.dataset,prior:state.prior}:{})};
  const summary=kind==='method'?benchmarkEngine.summarize(filters).find(r=>r.id===id):null;
  const dialog=$('#detail-dialog');
  const visible=availableMetricKeys(m.track,filters);const metricKeys=Object.keys(metricLabels).filter(k=>visible.includes(k)&&Number.isFinite(summary?.[k]));
  dialog.innerHTML='<button class="close-button" data-action="close-dialog" aria-label="Close details">×</button><h2 id="detail-title">'+esc(m.name)+'</h2><p class="detail-context">'+esc(kind==='method'?(route()==='leaderboard'?rankingScope():'All datasets')+' · Median metrics':m.platform+' · '+m.tissue)+'</p>'+(kind==='method'?'<div class="metric-detail-grid">'+metricKeys.map(k=>'<div class="metric-detail'+(k===state.metric?' selected':'')+'"><span>'+esc(metricLabels[k])+'</span><strong>'+metricNumber(summary?.[k],k)+'</strong></div>').join(''):'')+(kind==='method'?resourcePanel(benchmarkEngine.assessResources(id,{gpu:'Available'})):'')+'<button class="detail-gallery-link" data-action="detail-visual" data-kind="'+kind+'" data-id="'+m.id+'">View in gallery '+glyph('arrow')+'</button>';
  dialog.showModal();
}
function render(){
  hidePaperTip();
  const y=window.scrollY,focus=document.activeElement,id=focus?.id,selection=focus instanceof HTMLInputElement&&['search','text'].includes(focus.type)?focus.selectionStart:null;
  const openDetails=new Set([...document.querySelectorAll('#main-content details[id]')].filter(el=>el.open).map(el=>el.id));
  const galleryScroll=document.getElementById('gallery-track')?.scrollLeft||0;
  $('#main-content').innerHTML=renderPaperPage();
  $('#about-facts').innerHTML='<span><b>'+methods.length+'</b> methods</span><span><b>'+benchmark.audit.sourceRows+'</b> quality records</span><span><b>'+benchmark.resources.length+'</b> resource records</span>';
  document.title='SpaSegBench | An interactive cell segmentation benchmark';
  document.querySelectorAll('#main-content details[id]').forEach(el=>{if(openDetails.has(el.id))el.open=true;});
  const input=id&&document.getElementById(id);if(input){input.focus({preventScroll:true});if(selection!=null)input.setSelectionRange(selection,selection);}
  const gallery=document.getElementById('gallery-track');if(gallery)gallery.scrollLeft=galleryScroll;
  window.scrollTo({top:y,behavior:'instant'});previousRoute=route();
  setupPaperNavigation();
}
function invalidateRecommendation(){state.result=null;$('#recommend-results')?.remove();}
document.addEventListener('submit',e=>{if(e.target.id==='research-form'){e.preventDefault();state.rec.target='Whole cell';state.result=benchmarkEngine.recommend(state.rec);render();const result=$('#recommend-results');result.focus({preventScroll:true});result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}});
document.addEventListener('change',e=>{
  const el=e.target,key=el.dataset.key,action=el.dataset.change;if(!action)return;
  if(action==='recommend'){state.rec[key]=el.value;if(key==='track'){state.rec.goal='Balanced';delete state.rec.customWeights;state.rec.minPQ='';state.rec.minAssignment='';state.rec.maxP95='';}if(key==='goal')delete state.rec.customWeights;if(key==='gpu'&&el.value==='Not available')state.rec.vram='';invalidateRecommendation();}
  else if(action==='visual'&&key==='method'){state.visual.method=el.value;refreshPaperPart('gallery',renderPaperGallery(),el.id);return;}
  else{state[key]=el.value;if(key==='platform')state.dataset='';if(key==='metric')state.direction=lowerIsBetter(el.value)?'asc':'desc';}
  render();
});
document.addEventListener('input',e=>{
  const el=e.target;if(el.dataset.recInput){state.rec[el.dataset.recInput]=el.value;invalidateRecommendation();for(const kind of ['budget','advanced']){const count=$('#'+kind+'-count');if(count)count.textContent=conditionCount(kind);}}
  else if(el.dataset.weight){state.rec.customWeights ||= benchmarkEngine.weights(state.rec.track,state.rec.goal);state.rec.customWeights[el.dataset.weight]=el.value===''?NaN:Number(el.value)/100;invalidateRecommendation();const count=$('#advanced-count');if(count)count.textContent=conditionCount('advanced');}
  else if(el.id==='method-search'){state.query=el.value;render();}
  else if(el.id==='library-search'){state.libraryQuery=el.value;render();}
});
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-action]');if(!el)return;const a=el.dataset.action,id=el.dataset.id;
  if(a==='about'){$('#about-dialog').showModal();return;}
  if(a==='close-dialog'){el.closest('dialog').close();return;}
  if(a==='method'||a==='dataset'){openDetail(a,id);return;}
  if(a==='sort')state.direction=state.direction==='desc'?'asc':'desc';
  else if(a==='track'){state.track=id;state.metric=id==='image'?'pq':'f1';state.direction='desc';state.dataset='';state.platform='';state.query='';state.evidence='';state.prior='';}
  else if(a==='reset-filters')Object.assign(state,{query:'',platform:'',dataset:'',prior:'',evidence:''});
  else if(a==='library-tab')state.libraryTab=id;
  else if(a==='reset-weights'){delete state.rec.customWeights;invalidateRecommendation();}
  else if(a==='retry-images'){loadImages();return;}
  else if(a==='detail-visual'){state.visual={method:el.dataset.kind==='method'?id:''};paperState.tissue='all';$('#detail-dialog').close();refreshPaperPart('gallery',renderPaperGallery());location.hash='#gallery';$('#gallery').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});return;}
  else if(a==='image'){const r=state.images.find(r=>r.id===id),src=imagePath(r?.image);if(src){const name=byMethod(r.methodId).name,dataset=galleryLabel(r);$('#image-dialog').innerHTML='<div class="figure-dialog-heading"><div><h2 id="figure-title">'+esc(name)+'</h2><p>'+esc(dataset)+'</p></div><button class="close-button" data-action="close-dialog" aria-label="Close image">×</button></div><img src="'+src+'" width="'+r.width+'" height="'+r.height+'" alt="'+esc(name+' · '+dataset)+'">';$('#image-dialog').showModal();}return;}
  else return;
  render();
});
document.addEventListener('error',e=>{if(e.target.tagName==='IMG'){e.target.replaceWith(Object.assign(document.createElement('span'),{className:'image-unavailable',textContent:'Image unavailable'}));}},true);
document.addEventListener('click',e=>{if(e.target.tagName==='DIALOG'&&e.target.open){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
window.addEventListener('hashchange',()=>scrollToPaperHash());
// Browser startup. Verification loads the functions without mounting a DOM.
render();
loadImages().then(()=>{if(typeof requestAnimationFrame==='function')requestAnimationFrame(scrollToPaperHash);});
