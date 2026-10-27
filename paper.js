/* The living-paper presentation layer. All quality/resource measurements come
 * from data.js. SpaSegCompass remains in app.js + engine.js, without new weights.
 */
const paperState={platform:'',dataset:'',prior:'',resourceMode:'all',resourceMethods:['cellpose','bering','comseg'],tissue:'all',lineage:'myeloid',lineMethods:['proseg','ucs','cellpose','mesmer','cellist','boms']};
const paperColors={blue:'#448ab5',orange:'#ea873c',slate:'#7c8b9b',teal:'#418a98',lightBlue:'#7ba9cf'};
const platformOrder=['Xenium','CosMx','MERFISH','Stereo-seq','STARmap'];
const paperMetricGroups={
  molecule:[
    {label:'Detection accuracy',color:'teal',keys:[['cell_ratio','Ratio'],['precision','Prec.'],['recall','Recall'],['f1','F1']]},
    {label:'Spatial localization',color:'orange',keys:[['loc_mean_um','Mean'],['loc_median_um','Median'],['loc_p95_um','P95']]},
    {label:'Count fidelity',color:'blue',keys:[['count_pearson','Pearson'],['count_spearman','Spearman'],['count_mae','MAE'],['count_rmse','RMSE']]},
    {label:'Expression / assignment',color:'slate',keys:[['vec_cosine','Cosine'],['vec_js_dist','JS dist.'],['vec_pearson','Pearson'],['assign_accuracy','Assign.']]}
  ],
  image:[
    {label:'Boundary quality',color:'teal',keys:[['boundary_f1','B. F1'],['boundary_precision','B. Prec.'],['boundary_recall','B. Recall'],['sq','SQ']]},
    {label:'Region overlap',color:'orange',keys:[['dice','Dice'],['iou','IoU'],['pixel_accuracy','Pix. acc.'],['aji','AJI']]},
    {label:'Instance detection',color:'blue',keys:[['image_f1','F1'],['image_precision','Prec.'],['image_recall','Recall'],['dq','DQ']]},
    {label:'Overall quality',color:'slate',keys:[['pq','PQ'],['mda','mDA'],['oversegmentation','Over'],['undersegmentation','Under']]}
  ]
};
const paperRankCache=new Map();
const numberLabel=(n,digits=0)=>Number.isFinite(n)?n.toLocaleString('en-US',{maximumFractionDigits:digits}):'Not available';
const shortNumber=n=>n>=1e9?+(n/1e9).toFixed(1)+'B':n>=1e6?+(n/1e6).toFixed(1)+'M':n>=1000?+(n/1000).toFixed(1)+'k':String(+n.toFixed(1));
const paperMean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:null;
const finiteValues=a=>a.filter(Number.isFinite);
function paperQuantile(values,p){const a=[...values].sort((x,y)=>x-y);if(!a.length)return null;const i=(a.length-1)*p,l=Math.floor(i);return a[l]+(a[Math.ceil(i)]-a[l])*(i-l);}
function paperTip(title,rows,note=''){return esc(JSON.stringify({title,rows,note}));}
function tipAttrs(title,rows,note=''){return 'tabindex="0" role="button" aria-label="'+esc(title+'. '+rows.map(r=>r.join(': ')).join('. '))+'" data-tip="'+paperTip(title,rows,note)+'"';}
function sectionIntro(n,kicker,title,description,extra=''){return '<div class="paper-section-heading"><div><p class="paper-kicker"><span>'+n+'</span> '+kicker+'</p><h2>'+title+'</h2><p>'+description+'</p></div>'+extra+'</div>';}
function paperSelect(label,key,options,value){return '<label class="paper-select"><span>'+label+'</span><select id="paper-'+key+'" data-paper-select="'+key+'">'+optionList(options,value)+'</select></label>';}

function renderOverview(){
  return '<section id="overview" class="paper-section overview-section" aria-labelledby="overview-title">'+
    '<div class="paper-hero"><p class="paper-kicker"><span class="live-dot"></span> AN INTERACTIVE RESEARCH BENCHMARK</p>'+
    '<h1 id="overview-title">SpaSeg<span>Bench</span></h1>'+
    '<p class="hero-subtitle">Benchmarking cell segmentation for<br class="hero-title-break"> subcellular spatial transcriptomics</p>'+
    '<p class="hero-summary">A systematic benchmark connecting <strong>segmentation quality</strong>, computational cost and <strong>biological insight</strong>. Explore how methods and data shape the cells—and the biology—you see.</p>'+
    '</div>'+
    '<div class="study-stats">'+[[31,'Datasets','Across diverse tissues'],[16,'Methods','Three input families'],[445,'Completed runs','Of 466 applicable tasks'],[5,'Platforms','Seven technologies']].map(([n,label,note],i)=>'<div class="study-stat stat-'+i+'"><strong>'+n+'</strong><div><span>'+label+'</span><small>'+note+'</small></div></div>').join('')+'</div>'+renderFramework()+renderDatasetLandscape()+'</section>';
}
function overviewArt(name,alt,width=240,height=154){
  return '<img class="overview-diagram" src="assets/overview/'+name+'.svg" alt="'+esc(alt)+'" width="'+width+'" height="'+height+'" loading="lazy" decoding="async">';
}
function renderFramework(){
  const scenes={
    image:['Nuclear & membrane stains','Cell masks','Nuclear and membrane stains provide image features for cell segmentation.','Four colored cell masks delineate individual cells.'],
    transcript:['Spatial transcript coordinates','Transcript-to-cell assignments','Colored transcript points with spatial coordinates, before cell assignment.','Transcript points are grouped within four cell boundaries.'],
    multimodal:['Registered images + transcripts','Masks + cell-by-gene matrices','Nuclear stains and transcript coordinates are registered in the same field.','Segmented cells are paired with a cell-by-gene expression matrix.']
  };
  const arrow='<span class="workflow-arrow" aria-hidden="true">'+glyph('arrow')+'</span>';
  const lanes=paperData.families.map((f,i)=>{
    const scene=scenes[f.id];
    return '<article class="workflow-lane family-'+f.color+'" aria-labelledby="family-'+f.id+'">'+
      '<figure class="workflow-input">'+overviewArt(f.id+'-input',scene[2])+'<figcaption><span class="mobile-stage">Input</span>'+scene[0]+'</figcaption></figure>'+
      '<div class="workflow-arrow-in">'+arrow+'</div><div class="workflow-family"><div class="workflow-family-heading"><h4 id="family-'+f.id+'">'+f.label+'</h4><span>'+f.methods.length+' methods</span></div><p>'+f.description+'</p><div class="method-chips">'+f.methods.map(id=>'<span>'+esc(byMethod(id).name)+'</span>').join('')+'</div></div>'+
      '<div class="workflow-arrow-out">'+arrow+'</div><figure class="workflow-output">'+overviewArt(f.id+'-output',scene[3])+'<figcaption><span class="mobile-stage">Output</span>'+scene[1]+'</figcaption></figure></article>';
  }).join('');
  const evaluations=[
    ['accuracy','Accuracy','How well does it match?','Overlap, boundary agreement and detection; transcript assignment and expression fidelity.','Reference and predicted cell outlines overlap, with a visible difference at the boundary.'],
    ['robustness','Robustness','Does it generalize?','Consistent evaluation across platforms, tissues and species.','Xenium, CosMx, MERFISH, Stereo-seq and STARmap connect to a shared evaluation.'],
    ['challenges','Challenging inputs','Where does it struggle?','Whole-slide scale, small gene panels and densely packed cells.','Three challenges: a tiled tissue section, a sparse gene panel and densely packed cells.'],
    ['efficiency','Efficiency & impact','What is the practical cost?','Runtime, RAM and GPU memory; downstream transcript contamination.','Schematic resource bars beside neighboring cells illustrate computational cost and transcript contamination.']
  ];
  return '<div class="overview-subheading"><div><p class="paper-kicker">THE BENCHMARK AT A GLANCE</p><h3>Different inputs. A shared evaluation.</h3></div></div>'+
    '<div class="workflow-board"><div class="workflow-columns" aria-hidden="true"><span>01 / INPUT</span><span>02 / METHOD FAMILY</span><span>03 / OUTPUT</span></div>'+lanes+
    '<div class="workflow-convergence"><span></span><p>'+glyph('arrow')+' One standardized evaluation pipeline</p><span></span></div></div>'+
    '<div class="evaluation-panel"><div class="evaluation-heading"><div><p class="paper-kicker">WHAT WE MEASURE</p><h3>Beyond a single score.</h3></div><p>Accuracy, context and practical cost all matter.</p></div>'+
    '<div class="evaluation-grid">'+evaluations.map(([id,title,question,description,alt],i)=>'<article class="evaluation-card"><div class="evaluation-card-title"><span>0'+(i+1)+'</span><h4>'+title+'</h4></div>'+overviewArt(id,alt,260,178)+'<h5>'+question+'</h5><p>'+description+'</p></article>').join('')+'</div><p class="schematic-note">Conceptual illustrations of the benchmark design · Figure 1a–b</p></div>';
}
function datasetStats(){return paperData.datasetStatistics;}
function datasetBarSvg(rows,key){
  const color=paperColors[key==='cells'?'blue':key==='genes'?'orange':'slate'],values=finiteValues(rows.map(r=>r[key])).filter(v=>v>0);
  const peak=Math.max(1,...values),unit=10**Math.floor(Math.log10(peak)),max=Math.ceil(peak/unit)*unit;
  const W=420,H=350,L=49,R=14,T=24,B=70,pw=W-L-R,ph=H-T-B,y=v=>T+ph-v/max*ph;
  let svg='<svg class="data-svg dataset-bar-svg" viewBox="0 0 '+W+' '+H+'" role="group" aria-label="Mean dataset '+key+' by platform. Bars start at zero on a linear scale; each point is one dataset.">';
  for(let i=0;i<=4;i++){const value=max*i/4,yy=y(value);svg+='<line class="plot-grid" x1="'+L+'" x2="'+(W-R)+'" y1="'+yy+'" y2="'+yy+'"/><text class="svg-label" x="'+(L-9)+'" y="'+(yy+4)+'" text-anchor="end">'+shortNumber(value)+'</text>';}
  platformOrder.forEach((platform,i)=>{
    const group=rows.filter(r=>r.platform===platform&&Number.isFinite(r[key])&&r[key]>0),mean=paperMean(group.map(r=>r[key])),x=L+(i+.5)*pw/5;
    svg+='<text class="svg-label platform-label" x="'+x+'" y="'+(H-37)+'" text-anchor="middle">'+platform+'</text><text class="svg-small" x="'+x+'" y="'+(H-18)+'" text-anchor="middle">n = '+group.length+'</text>';
    if(mean===null)return;
    svg+='<rect class="dataset-mean-bar" x="'+(x-22)+'" y="'+y(mean)+'" width="44" height="'+(mean/max*ph)+'" rx="3" fill="'+color+'" fill-opacity=".2" '+tipAttrs(platform+' · mean '+key,[['Mean per dataset',numberLabel(mean,1)],['Datasets',group.length]],'Arithmetic mean of the datasets on this platform. Each overlaid point is an individual dataset.')+'/>';
    // A compact deterministic beeswarm keeps near-equal counts individually reachable.
    const placed=[];
    [...group].sort((a,b)=>a[key]-b[key]||a.id.localeCompare(b.id)).forEach(r=>{
      const yy=y(r[key]),offsets=[0,6.4,-6.4,12.8,-12.8,19.2,-19.2,25.6,-25.6,32,-32,38.4,-38.4];
      const jitter=offsets.find(dx=>placed.every(p=>Math.hypot(p.x-dx,p.y-yy)>=6.2))??0;
      placed.push({x:jitter,y:yy});
      const details=[['Source dataset',r.id],['Technology',r.technology],['Tissue',r.tissue],['Species',r.species],['Cells',numberLabel(r.cells)],['Genes',numberLabel(r.genes)],['Transcripts',numberLabel(r.transcripts)],['Resolution',r.resolution]];
      svg+='<circle class="plot-point" cx="'+(x+jitter)+'" cy="'+yy+'" r="3" fill="'+color+'" stroke="white" stroke-width="1" '+tipAttrs(r.name,details,'Counts from the supplied dataset statistics. Each point describes the listed source dataset, including any crop.')+' />';
    });
    svg+='<text class="dataset-mean-label" x="'+x+'" y="'+(y(mean)-14)+'" text-anchor="middle">'+shortNumber(mean)+'</text>';
  });
  return svg+'</svg>';
}
function renderDatasetLandscape(){
  const rows=datasetStats(),metrics=[['cells','Cells','blue'],['genes','Genes','orange'],['transcripts','Transcripts','slate']];
  return '<div id="dataset-landscape" class="dataset-landscape"><div class="overview-subheading"><div><p class="paper-kicker">DATASET LANDSCAPE · FIGURE 1C</p><h3>Explore the scale behind the benchmark.</h3><p>31 datasets, three dimensions. Hover, focus or tap a point for its details.</p></div></div><div class="dataset-triptych">'+metrics.map(([key,label,tone])=>{
    const values=rows.map(r=>r[key]),min=Math.min(...values),max=Math.max(...values);
    return '<article class="chart-card dataset-chart dataset-'+tone+'"><div class="dataset-chart-heading"><h4>'+label+'</h4><span>LINEAR SCALE</span></div><p class="dataset-range"><strong>'+shortNumber(min)+'–'+shortNumber(max)+'</strong><span>per dataset</span></p>'+datasetBarSvg(rows,key)+'</article>';
  }).join('')+'</div><div class="dataset-reading-guide"><span class="bar-key"><i></i> Bar & label = platform mean</span><span class="point-key"><i></i> One point = one dataset</span></div><p class="dataset-scope">All bars start at zero. Counts include full samples and cropped regions; genes are reported counts, not nominal panel sizes. Each platform contains 1–13 datasets.</p></div>';
}

// Normalize ranks within the original reference/prior groups. First average
// repeated records per method, then groups per dataset and datasets per platform.
// Platforms have equal weight. Never rank a one-method group as a win.
function bubbleData(track,filters={}){
  const cacheKey=JSON.stringify([track,filters]);if(paperRankCache.has(cacheKey))return paperRankCache.get(cacheKey);
  const groups=paperMetricGroups[track].map(g=>({...g,keys:g.keys.filter(([k])=>sharedMetricKeys(track).includes(k))}));
  const keys=groups.flatMap(g=>g.keys.map(([k])=>k)),rows=benchmarkEngine.select({...filters,track}),byGroup=new Map();
  rows.forEach(r=>{if(!byGroup.has(r.group))byGroup.set(r.group,[]);byGroup.get(r.group).push(r);});
  const methodRows=methods.filter(m=>m.track===track&&rows.some(r=>r.methodId===m.id)).map(m=>({...m,metrics:{}}));
  for(const key of keys){
    const ranked=[];
    for(const group of byGroup.values()){
      const candidates=methodRows.map(m=>{const v=finiteValues(group.filter(r=>r.methodId===m.id).map(r=>benchmarkEngine.reportValue(r.metrics[key])));return{id:m.id,value:paperQuantile(v,.5)};}).filter(r=>r.value!==null);
      if(candidates.length<2)continue;
      const oriented=candidates.map(r=>key==='cell_ratio'?-Math.abs(r.value-1):lowerIsBetter(key)?-r.value:r.value);
      candidates.forEach((c,i)=>{const better=oriented.filter(v=>v>oriented[i]).length,ties=oriented.filter(v=>v===oriented[i]).length,rank=better+(ties+1)/2;ranked.push({id:c.id,dataset:group[0].datasetId,platform:group[0].platform,score:1-(rank-1)/(candidates.length-1)});});
    }
    for(const method of methodRows){
      const observations=rows.filter(r=>r.methodId===method.id),values=finiteValues(observations.map(r=>benchmarkEngine.reportValue(r.metrics[key]))),scores=ranked.filter(r=>r.id===method.id),ds=[...new Set(scores.map(r=>r.dataset))].map(id=>({platform:scores.find(r=>r.dataset===id).platform,value:paperMean(scores.filter(r=>r.dataset===id).map(r=>r.score))}));
      const platformMeans=[...new Set(ds.map(r=>r.platform))].map(p=>paperMean(ds.filter(r=>r.platform===p).map(r=>r.value)));
      method.metrics[key]={raw:paperQuantile(values,.5),score:paperMean(platformMeans),records:values.length,datasets:ds.length,platforms:platformMeans.length};
    }
  }
  methodRows.forEach(m=>m.meanRank=paperMean(Object.values(m.metrics).map(x=>x.score).filter(Number.isFinite)));
  methodRows.sort((a,b)=>(b.meanRank??-1)-(a.meanRank??-1)||a.name.localeCompare(b.name));
  const result={groups,methods:methodRows};paperRankCache.set(cacheKey,result);return result;
}
function bubbleMatrix(track){
  const data=bubbleData(track,{platform:paperState.platform,dataset:paperState.dataset,prior:paperState.prior}),cols=data.groups.flatMap(g=>g.keys.map(([key,label])=>({key,label,color:paperColors[g.color]})));
  const W=1080,L=160,R=20,rowH=44,T=76,H=T+data.methods.length*rowH+16,cw=(W-L-R)/cols.length;
  let svg='<svg class="data-svg bubble-svg" viewBox="0 0 '+W+' '+H+'" role="group" aria-label="'+(track==='image'?'Image-based':'Transcript and multimodal')+' metric rank matrix">',offset=0;
  data.groups.forEach(g=>{const x=L+offset*cw;svg+='<rect x="'+(x+3)+'" y="4" width="'+(g.keys.length*cw-6)+'" height="28" rx="5" fill="'+paperColors[g.color]+'" fill-opacity=".13"/><text class="svg-group-label" x="'+(x+g.keys.length*cw/2)+'" y="23" text-anchor="middle">'+g.label+'</text>';offset+=g.keys.length;});
  cols.forEach((c,j)=>svg+='<text class="svg-small" x="'+(L+(j+.5)*cw)+'" y="56" text-anchor="middle">'+c.label+'</text>');
  data.methods.forEach((m,i)=>{
    const cy=T+(i+.5)*rowH;svg+='<rect x="0" y="'+(cy-rowH/2)+'" width="'+W+'" height="'+rowH+'" rx="4" fill="'+(i%2?'#f3f5f7':'#fff')+'"/><text class="svg-method" x="'+(L-15)+'" y="'+(cy+5)+'" text-anchor="end">'+esc(m.name)+'</text>';
    cols.forEach((c,j)=>{const v=m.metrics[c.key],cx=L+(j+.5)*cw,valid=Number.isFinite(v.score),size=valid?9+29*Math.sqrt(v.score):12,rx=valid?size*(.5-.34*v.score):6,rows=[['Metric',metricLabels[c.key]],['Median value',v.raw===null?'Not available':metricNumber(v.raw,c.key)],['Normalized rank',valid?v.score.toFixed(3)+' / 1':'Not comparable'],['Support',v.records+' records · '+v.datasets+' comparable datasets'],['Platforms ranked',v.platforms]],note=(lowerIsBetter(c.key)?'Lower raw values are better. ':c.key==='cell_ratio'?'A raw ratio closer to 1 is better. ':'Higher raw values are better. ')+'Rank 1 is best; the marker is a descriptive rank, not a probability.';
      svg+='<g class="bubble-hit" '+tipAttrs(m.name,rows,note)+'><rect x="'+(cx-cw/2+1)+'" y="'+(cy-rowH/2+1)+'" width="'+(cw-2)+'" height="'+(rowH-2)+'" fill="transparent"/>'+(valid?'<rect class="bubble-mark" x="'+(cx-size/2)+'" y="'+(cy-size/2)+'" width="'+size+'" height="'+size+'" rx="'+rx+'" fill="'+c.color+'" fill-opacity="'+(.92-.7*v.score)+'" stroke="'+c.color+'" stroke-width="1.3"/>':'<path d="M'+(cx-4)+' '+(cy-4)+'l8 8m-8 0 8-8" stroke="#a4adb5" stroke-width="1.5"/>')+'</g>';
    });
  });
  if(!data.methods.length)svg+='<text class="svg-label" x="540" y="68" text-anchor="middle">No measured methods in this selection.</text>';
  return '<div class="matrix-block"><div class="matrix-heading"><h4>'+(track==='image'?'Image-based methods':'Transcript / multimodal methods')+'</h4><span>'+data.methods.length+' methods <i>·</i> '+cols.length+' metrics</span></div><div class="plot-scroll">'+svg+'</svg></div></div>';
}
function renderPaperLeaderboard(){
  return '<section id="leaderboard" class="paper-section" aria-labelledby="leaderboard-title">'+sectionIntro('02','LEADERBOARD','<span id="leaderboard-title">Performance is a profile.</span>','Compare strengths across complementary metrics, then explore the resources each method needs.')+'<div id="paper-board"><div class="paper-filter-bar"><div class="paper-filters">'+paperSelect('Platform','platform',[['','All platforms'],...platformOrder],paperState.platform)+paperSelect('Dataset','dataset',[['','All datasets'],...datasets.filter(d=>!paperState.platform||d.platform===paperState.platform).map(d=>[d.id,d.name])],paperState.dataset)+paperSelect('Segmentation prior','prior',[['','All states'],['yes','With prior'],['no','Without prior'],['unknown','Unconfirmed']],paperState.prior)+'</div></div><div class="chart-card matrix-card"><div class="matrix-key"><span><b>How to read</b> Larger, squarer markers = better rank.</span><div><span>0</span>'+[0,.25,.5,.75,1].map(v=>'<i style="--size:'+(8+18*Math.sqrt(v))+'px;--round:'+(50-34*v)+'%;--opacity:'+(.92-.7*v)+'"></i>').join('')+'<span>1</span><span class="missing-key">× No comparison</span></div></div>'+['molecule','image'].map(bubbleMatrix).join('')+'<div class="chart-explainer"><h4>Reading the ranks</h4><p>Scores run from 0 (worst) to 1 (best) within matched reference and prior groups, with ties averaged. Results are averaged first within datasets, then across platforms with equal platform weight. Error metrics are reversed; cell-count ratio is scored by distance from 1.</p><p>Image and transcript / multimodal tracks are separate comparisons. Coverage can differ; hover for the median measured value and sample support. A single-method group has no comparative rank.</p></div></div></div><div id="paper-resources">'+renderPaperResources()+'</div></section>';
}
const resourceAxes=[{key:'runtimeSeconds',label:'Runtime',unit:'min'},{key:'ramGiB',label:'CPU memory',unit:'GiB'},{key:'vramGiB',label:'GPU memory',unit:'GiB'}];
function resourceValue(value,key){return value===null?'Not available':numberLabel(key==='runtimeSeconds'?value/60:value,2)+(key==='runtimeSeconds'?' min':' GiB');}
function resourceSummary(){
  return methods.map(m=>{
    const runs=benchmark.resources.filter(r=>r.methodId===m.id&&r.status==='success'&&(!paperState.platform||byDataset(r.datasetId)?.platform===paperState.platform)&&(!paperState.dataset||r.datasetId===paperState.dataset)&&(paperState.resourceMode==='all'||(paperState.resourceMode==='gpu'?r.gpuUsed:!r.gpuUsed)));
    return {...m,runs:runs.length,gpuRuns:runs.filter(r=>r.gpuUsed).length,values:Object.fromEntries(resourceAxes.map(a=>[a.key,paperQuantile(finiteValues(runs.map(r=>r[a.key])),.5)]))};
  });
}
function resourceRadarData(){
  const rows=resourceSummary(),maxima=Object.fromEntries(resourceAxes.map(a=>[a.key,Math.max(0,...rows.map(r=>r.values[a.key]??0))]));
  return {rows,maxima,selected:rows.filter(r=>r.runs&&paperState.resourceMethods.includes(r.id)).map(r=>({...r,scores:resourceAxes.map(a=>r.values[a.key]===null?null:maxima[a.key]>0?r.values[a.key]/maxima[a.key]:0)}))};
}
function resourceRadarSvg(data){
  const W=640,H=365,cx=320,cy=203,radius=139;
  const point=(i,f)=>{const angle=(-90-i*120)*Math.PI/180;return [cx+Math.cos(angle)*radius*f,cy+Math.sin(angle)*radius*f];};
  const coords=points=>points.map(p=>p.map(v=>v.toFixed(2)).join(',')).join(' ');
  let svg='<svg class="data-svg resource-radar-svg" viewBox="0 0 '+W+' '+H+'" role="group" aria-label="Three-axis resource radar: runtime, CPU memory and GPU memory. Smaller values toward the center mean lower resource use.">';
  for(const fraction of [.25,.5,.75,1])svg+='<polygon class="radar-grid" points="'+coords(resourceAxes.map((a,i)=>point(i,fraction)))+'" fill="'+(fraction===1?'#eef3f7':'none')+'" fill-opacity=".45"/>';
  resourceAxes.forEach((a,i)=>{const [x,y]=point(i,1);svg+='<line class="radar-axis" x1="'+cx+'" y1="'+cy+'" x2="'+x+'" y2="'+y+'"/>';});
  for(const fraction of [.25,.5,.75,1])svg+='<text class="radar-tick" x="'+(cx+10)+'" y="'+(cy-radius*fraction+4)+'">'+fraction*100+'%</text>';
  const labels=[[cx,24],[150,312],[490,312]];
  resourceAxes.forEach((a,i)=>{const [x,y]=labels[i];svg+='<text class="radar-axis-title" x="'+x+'" y="'+y+'" text-anchor="middle">'+a.label+'</text><text class="svg-small" x="'+x+'" y="'+(y+19)+'" text-anchor="middle">Max '+resourceValue(data.maxima[a.key],a.key)+'</text>';});
  data.selected.forEach((m,index)=>{
    const [color]=lineStyles[m.id],dash=['','7 4','2 4'][index%3];
    const points=m.scores.map((v,i)=>v===null?null:point(i,v)),valid=points.filter(Boolean);
    const details=resourceAxes.map(a=>[a.label,resourceValue(m.values[a.key],a.key)]).concat([['Successful runs',m.runs],['GPU-used runs',m.gpuRuns]]);
    svg+='<g class="radar-series" '+tipAttrs(m.name,details,'Medians across the current dataset and execution-mode selection. Axes are scaled independently to the highest method median in this view. Zero GPU memory means no GPU memory was recorded; missing values are not zero.')+'>';
    if(valid.length===3)svg+='<polygon class="radar-area" points="'+coords(points)+'" fill="'+color+'" fill-opacity=".1" stroke="'+color+'" stroke-width="2.5"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';
    else if(valid.length===2)svg+='<polyline points="'+coords(valid)+'" fill="none" stroke="'+color+'" stroke-width="2.5" stroke-dasharray="3 4"/>';
    valid.forEach(([x,y])=>svg+='<circle cx="'+x+'" cy="'+y+'" r="4" fill="white" stroke="'+color+'" stroke-width="2.2"/>');
    svg+='</g>';
  });
  if(!data.selected.length)svg+='<text class="svg-label" x="'+cx+'" y="'+(H-12)+'" text-anchor="middle">Select a method with resource data.</text>';
  return svg+'</svg>';
}
function renderPaperResources(){
  const data=resourceRadarData(),runs=data.rows.reduce((n,r)=>n+r.runs,0),scope=paperState.dataset?byDataset(paperState.dataset).name:paperState.platform||'All datasets';
  return '<div class="resource-comparison"><aside class="resource-story"><p class="paper-kicker">THE COST OF A CELL BOUNDARY · FIGURE 6</p><h3>Accuracy meets<br>practical constraints.</h3><p>Compare the time, CPU memory and GPU memory required to draw a cell boundary.</p><div class="resource-reading"><strong>Closer to the center, lower cost.</strong><p>Each axis starts at zero and is scaled to the highest method median in this view. Hover, focus or tap a profile to see its measured values.</p></div><p class="resource-coverage"><strong>'+runs+'</strong> successful runs · '+data.rows.filter(r=>r.runs).length+' methods</p>'+paperSelect('Execution mode','resourceMode',[['all','All runs'],['gpu','GPU used'],['cpu','CPU only']],paperState.resourceMode)+'<div class="resource-hardware"><h4>Benchmark hardware</h4><p>64 physical CPU cores · ~1 TiB RAM<br>8 × RTX 4090 D · 24,564 MiB per GPU</p></div><p class="resource-footnote">Runtime includes executed preprocessing, training, segmentation and postprocessing. Memory is task RAM and peak memory per GPU. The resource snapshot contains 451 records; the manuscript reports 445 completed tasks from a different snapshot.</p></aside><div class="chart-card resource-radar-card"><div class="chart-card-heading"><div><h4>Resource profiles</h4><p>'+esc(scope)+' · Median over successful runs</p></div><span>'+data.selected.length+' selected</span></div>'+resourceRadarSvg(data)+'<div class="resource-methods" role="group" aria-label="Methods in resource radar">'+data.rows.map(m=>{const selected=data.selected.findIndex(r=>r.id===m.id),style=selected<0?'solid':['solid','dashed','dotted'][selected%3];return '<button id="resource-method-'+m.id+'" data-paper-action="resource-method" data-value="'+m.id+'" aria-pressed="'+(selected>=0)+'"'+(!m.runs?' disabled title="No successful runs in this selection"':'')+'><i style="--series-color:'+lineStyles[m.id][0]+';border-top-style:'+style+'"></i>'+esc(m.name)+(!m.runs?' <span>n/a</span>':'')+'</button>';}).join('')+'</div><div class="resource-actions"><span>Select methods to compare</span><button data-paper-action="resource-reset">Reset selection</button></div><p class="resource-chart-note">100% = the highest method median on that axis, not the hardware limit. Axes stay fixed when toggling methods. Missing measurements are omitted.</p></div></div>';
}

const galleryTissues=[['all','All tissues'],['merfish-colon','Colon · MERFISH'],['merfish-liver','Liver · MERFISH'],['xenium-breast-cancer','Breast cancer · Xenium'],['xenium-ccRCC','Kidney · Xenium'],['xenium-lymph','Lymph node · Xenium']];
function paperGalleryRows(){return visualRows().filter(r=>paperState.tissue==='all'||r.galleryGroup===paperState.tissue);}
function renderPaperGallery(){
  const rows=paperGalleryRows(),collection=state.images.filter(r=>paperState.tissue==='all'||r.galleryGroup===paperState.tissue);
  const missing=paperState.tissue==='all'?[]:methods.filter(m=>!collection.some(r=>r.methodId===m.id));
  let content=rows.map(r=>'<article class="gallery-slide"><div class="gallery-slide-title"><span>'+esc(byMethod(r.methodId).name)+'</span><span>'+esc(r.platform)+'</span></div><button class="gallery-image-button" data-action="image" data-id="'+esc(r.id)+'" aria-label="Enlarge '+esc(byMethod(r.methodId).name+' · '+galleryLabel(r))+'"><img src="'+imagePath(r.thumbnail)+'" width="'+r.width+'" height="'+r.height+'" alt="'+esc(byMethod(r.methodId).name+' visualization · '+galleryLabel(r))+'" loading="lazy" decoding="async"><span>Enlarge figure '+glyph('expand')+'</span></button><div class="gallery-slide-caption"><strong>'+esc(galleryLabel(r))+'</strong><span>Supplied visualization · '+esc(byMethod(r.methodId).name)+'</span></div></article>').join('');
  if(!rows.length)content='<div class="gallery-placeholder" role="status">'+glyph('image')+'<h3>'+(state.imageStatus==='error'?'Images could not be loaded':state.imageStatus==='loading'?'Loading figures…':'No figure for this selection')+'</h3><p>'+(state.imageStatus==='ready'?'This method was not included in the supplied tissue collection. Select another method or tissue.':'Please try again.')+'</p>'+(state.imageStatus==='error'?'<button class="paper-secondary" data-action="retry-images">Try again</button>':'')+'</div>';
  return '<section id="gallery" class="paper-section" aria-labelledby="gallery-title">'+sectionIntro('03','SEGMENTATION GALLERY','<span id="gallery-title">See the boundaries for yourself.</span>','Explore '+state.images.length+' visualizations across five tissue collections. Choose a tissue, slide through methods, and enlarge any figure for a closer look.')+'<div class="gallery-explorer"><div class="gallery-explorer-toolbar"><div class="tissue-tabs" role="group" aria-label="Gallery tissue">'+galleryTissues.map(([id,label])=>'<button id="tissue-'+id+'" data-paper-action="tissue" data-value="'+id+'" aria-pressed="'+(paperState.tissue===id)+'">'+label+'</button>').join('')+'</div></div><div class="gallery-subtoolbar"><div><span class="gallery-live-dot"></span><strong>'+rows.length+' '+(rows.length===1?'figure':'figures')+'</strong><span>Scroll to compare · Select to enlarge</span></div>'+selectControl('Method','method',[['','All methods'],...methods.map(m=>[m.id,m.name])],state.visual.method,'visual')+'</div><div id="gallery-track" class="gallery-track" tabindex="0" aria-label="Segmentation figure carousel; use left and right arrow keys">'+content+'</div><div class="gallery-bottom"><p>'+(missing.length?'Not supplied for this tissue: '+esc(missing.map(m=>m.name).join(', '))+'.':'Colors follow each supplied visualization; they are not a shared cell-type legend across methods.')+'</p><div class="gallery-arrows"><button data-paper-action="gallery-prev" aria-label="Previous figures"'+(rows.length<2?' disabled':'')+'>'+glyph('arrow')+'</button><button data-paper-action="gallery-next" aria-label="Next figures"'+(rows.length<2?' disabled':'')+'>'+glyph('arrow')+'</button></div></div></div></section>';
}

const lineStyles={proseg:['#e38032',''],ucs:['#448bb8',''],cellpose:['#173e65',''],mesmer:['#7e929e',''],cellist:['#ea873c','6 4'],boms:['#785c8d',''],genesegnet:['#61816e',''],comseg:['#b56e5d',''],baysor:['#997323',''],bering:['#3a8b8a',''],dissect:['#906b4b',''],cellpose3:['#c58d7c','6 3'],cellsam:['#6685a2','4 3'],stardist:['#7b7d83','2 3'],cellotype:['#779047',''],unseg:['#39849c','3 3']};
function selectedDownstream(){
  return paperData.downstream.series.filter(s=>paperState.lineMethods.includes(s.methodId)&&s.cases[paperState.lineage]);
}
function downstreamSvg(){
  const data=paperData.downstream,series=selectedDownstream(),W=850,H=410,L=68,R=35,T=42,B=67,pw=W-L-R,ph=H-T-B;
  const minDistance=data.binLeft[0],maxDistance=data.binRight.at(-1),x=d=>L+(d-minDistance)/(maxDistance-minDistance)*pw;
  const max=Math.max(10,Math.ceil(Math.max(0,...series.flatMap(s=>s.cases[paperState.lineage].foreign))/10)*10),y=v=>T+ph-v/max*ph;
  let svg='<svg class="data-svg downstream-svg" viewBox="0 0 '+W+' '+H+'" role="group" aria-label="Measured cumulative foreign transcripts per cell against signed distance from the cell boundary, with '+data.distances.length+' samples per curve."><rect x="'+L+'" y="'+T+'" width="'+(x(0)-L)+'" height="'+ph+'" fill="#f5f8fb"/><rect x="'+x(0)+'" y="'+T+'" width="'+(W-R-x(0))+'" height="'+ph+'" fill="#fff5eb"/>';
  for(let i=0;i<=5;i++){const v=max*i/5;svg+='<line class="plot-grid" x1="'+L+'" x2="'+(W-R)+'" y1="'+y(v)+'" y2="'+y(v)+'"/><text class="svg-label" x="'+(L-13)+'" y="'+(y(v)+4)+'" text-anchor="end">'+numberLabel(v,1)+'</text>';}
  [-10,-8,-6,-4,-2,0,2,3].forEach(d=>{const xx=x(d);svg+='<line x1="'+xx+'" x2="'+xx+'" y1="'+(T+ph)+'" y2="'+(T+ph+5)+'" stroke="#9bafbe"/><text class="svg-label" x="'+xx+'" y="'+(T+ph+24)+'" text-anchor="middle">'+(d>0?'+':'')+d+'</text>';});
  svg+='<path d="M'+L+' '+T+'V'+(T+ph)+'H'+(W-R)+'" fill="none" stroke="#b4c4d0" stroke-width="1.2"/><line x1="'+x(0)+'" x2="'+x(0)+'" y1="'+T+'" y2="'+(T+ph)+'" stroke="#b38a68" stroke-width="1.3" stroke-dasharray="4 4"/><text class="svg-small" x="'+L+'" y="20">Cumulative foreign transcripts / cell</text><text class="svg-small" x="'+x(0)+'" y="20" text-anchor="middle">Cell boundary · 0 µm</text><text class="svg-small" x="'+(L+12)+'" y="'+(T+20)+'">INSIDE</text><text class="svg-small" x="'+(x(0)+12)+'" y="'+(T+20)+'">OUTSIDE</text><text class="svg-label" x="'+(L+pw/2)+'" y="'+(H-13)+'" text-anchor="middle">Signed distance from cell boundary (µm)</text>';
  series.forEach(s=>{
    const [color,dash]=lineStyles[s.methodId],values=s.cases[paperState.lineage].foreign;
    svg+='<path class="contamination-line" d="'+values.map((v,i)=>(i?'L':'M')+x(data.distances[i]).toFixed(2)+' '+y(v).toFixed(2)).join(' ')+'" fill="none" stroke="'+color+'" stroke-width="2.5"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>'+values.map((v,i)=>i===data.boundaryIndex||i===values.length-1||i%10===0?'<circle cx="'+x(data.distances[i])+'" cy="'+y(v)+'" r="'+(i===data.boundaryIndex?4:2)+'" fill="'+(i===data.boundaryIndex?'white':color)+'" stroke="'+color+'" stroke-width="1.5"/>':'').join('');
  });
  const lineage=data.lineages.find(([id])=>id===paperState.lineage)[1];
  data.distances.forEach((d,i)=>{
    const left=i===0?L:(x(data.distances[i-1])+x(d))/2,right=i===data.distances.length-1?W-R:(x(d)+x(data.distances[i+1]))/2;
    svg+='<rect class="line-hit" x="'+left+'" y="'+T+'" width="'+(right-left)+'" height="'+ph+'" fill="transparent" '+tipAttrs(lineage+' · '+(d>0?'+':'')+numberLabel(d,3)+' µm',series.map(s=>[byMethod(s.methodId).name,numberLabel(s.cases[paperState.lineage].foreign[i],3)]),'Measured cumulative transcripts per cell. Bin: '+numberLabel(data.binLeft[i],3)+' to '+numberLabel(data.binRight[i],3)+' µm; plotted at its midpoint.'+(i===data.boundaryIndex?' This bin ends at the cell boundary.':''))+' />';
  });
  if(!series.length)svg+='<text class="svg-label" x="'+(W/2)+'" y="'+(T+ph/2)+'" text-anchor="middle">Select a method with data for this lineage.</text>';
  return svg+'</svg>';
}
function renderDownstream(){
  const data=paperData.downstream,selected=selectedDownstream(),available=data.series.filter(s=>s.cases[paperState.lineage]);
  const missing=data.series.filter(s=>!s.cases[paperState.lineage]).map(s=>byMethod(s.methodId).name);
  return '<section id="downstream" class="paper-section" aria-labelledby="downstream-title">'+sectionIntro('04','DOWNSTREAM IMPACT','<span id="downstream-title">Small shifts. Biological consequences.</span>','A cell boundary determines which transcripts become part of its expression profile.')+
    '<div class="downstream-layout"><aside class="downstream-story"><span class="figure-number">FIGURE 4F</span><h3>Where does a cell’s<br>signal end?</h3><p>Trace how foreign-lineage transcripts accumulate from inside a cell to beyond its predicted boundary.</p><div class="boundary-stages"><span>Inside the cell<strong>−10 µm</strong></span>'+glyph('arrow')+'<span>Beyond the boundary<strong>+3.3 µm</strong></span></div><div class="measured-scope"><strong>Measured distance profiles</strong><p>'+data.distances.length+' recorded samples per curve. Hover, focus or tap along the plot to compare methods at the same distance. The vertical line marks the cell boundary.</p></div></aside>'+
    '<div class="chart-card downstream-chart"><div class="chart-card-heading"><div><h4>Boundary-associated contamination</h4><p>'+available.length+' methods with data · '+selected.length+' selected</p></div><div class="pill-controls" role="group" aria-label="Cell lineage">'+data.lineages.map(([v,l])=>'<button id="lineage-'+v+'" data-paper-action="lineage" data-value="'+v+'" aria-pressed="'+(paperState.lineage===v)+'">'+l+'</button>').join('')+'</div></div><div class="plot-scroll">'+downstreamSvg()+'</div>'+
    '<div class="line-legend" role="group" aria-label="Methods in contamination plot">'+data.series.map(s=>{const exists=!!s.cases[paperState.lineage];return '<button id="line-'+s.methodId+'" data-paper-action="line-method" data-value="'+s.methodId+'" aria-pressed="'+(exists&&paperState.lineMethods.includes(s.methodId))+'"'+(!exists?' disabled title="No record for this lineage"':'')+'><i style="--series-color:'+lineStyles[s.methodId][0]+';border-top-style:'+(lineStyles[s.methodId][1]?'dashed':'solid')+'"></i>'+esc(byMethod(s.methodId).name)+(!exists?' <span>n/a</span>':'')+'</button>';}).join('')+'</div><div class="line-actions"><button data-paper-action="line-all">Show all available</button><button data-paper-action="line-reset">Reset selection</button></div>'+
    (missing.length?'<p class="missing-data-note">No Epi / Tumor record for '+esc(missing.join(' or '))+'.</p>':'')+
    '</div></div></section>';
}
function renderPaperRecommendation(){return '<section id="recommendation" class="paper-section recommendation-section" aria-labelledby="recommendation-title">'+sectionIntro('05','RECOMMENDATION','<span id="recommendation-title">Find a method for your next experiment.</span>','SpaSegCompass connects your inputs, analysis goals and available resources with the benchmark evidence.')+renderRecommend()+'</section>';}
function renderPaperPage(){return '<div class="paper-page">'+renderOverview()+renderPaperLeaderboard()+renderPaperGallery()+renderDownstream()+renderPaperRecommendation()+'</div>';}

let tooltipPinned=false,paperNavigationBound=false,paperNavigationPending=false;
function paperActiveSection(sections,activationTop,scrollY,viewportHeight,pageHeight){
  if(!sections.length)return null;
  if(scrollY>0&&pageHeight>0&&scrollY+viewportHeight>=pageHeight-3&&sections.at(-1).top<viewportHeight)return sections.at(-1).id;
  return [...sections].reverse().find(s=>s.top<=activationTop)?.id||sections[0].id;
}
function updatePaperNavigation(){
  const sections=[...document.querySelectorAll('.paper-page > section')].map(s=>({id:s.id,top:s.getBoundingClientRect().top}));
  if(!sections.length)return;
  const headerBottom=document.querySelector('.site-header')?.getBoundingClientRect?.().bottom||80;
  const height=window.innerHeight||0,activationTop=headerBottom+Math.max(24,Math.min(80,height*.1));
  const id=paperActiveSection(sections,activationTop,window.scrollY,height,document.documentElement?.scrollHeight||0);
  document.querySelectorAll('.paper-nav a').forEach(a=>{if(a.hash==='#'+id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
}
function schedulePaperNavigation(){
  if(paperNavigationPending)return;
  if(typeof window.requestAnimationFrame!=='function'){updatePaperNavigation();return;}
  paperNavigationPending=true;window.requestAnimationFrame(()=>{paperNavigationPending=false;updatePaperNavigation();});
}
function setupPaperNavigation(){
  if(!paperNavigationBound){
    window.addEventListener('scroll',schedulePaperNavigation,{passive:true});
    window.addEventListener('resize',schedulePaperNavigation);
    window.addEventListener('hashchange',schedulePaperNavigation);
    window.addEventListener('load',schedulePaperNavigation);
    paperNavigationBound=true;
  }
  updatePaperNavigation();
}

function scrollToPaperHash(){const aliases={'#/':'overview','#/recommend':'recommendation','#/visuals':'gallery','#/explore':'dataset-landscape','#research-form':'research-form'};const id=aliases[location.hash]||location.hash.slice(1);document.getElementById(id)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
function refreshPaperPart(id,html,focusId){const el=document.getElementById(id);if(!el)return;hidePaperTip();el.outerHTML=html;if(focusId)document.getElementById(focusId)?.focus({preventScroll:true});setupPaperNavigation();}
function hidePaperTip(){const tip=document.getElementById('chart-tooltip');if(tip){tip.hidden=true;tip.innerHTML='';}tooltipPinned=false;document.querySelectorAll('.tip-active').forEach(n=>n.classList.remove('tip-active'));}
function showPaperTip(target,event){
  const tip=document.getElementById('chart-tooltip');if(!tip||!target)return;
  let data;try{data=JSON.parse(target.dataset.tip);}catch{return;}
  document.querySelectorAll('.tip-active').forEach(n=>n.classList.remove('tip-active'));target.classList.add('tip-active');
  tip.innerHTML='<strong>'+esc(data.title)+'</strong><dl>'+data.rows.map(([k,v])=>'<div><dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd></div>').join('')+'</dl>'+(data.note?'<p>'+esc(data.note)+'</p>':'')+'<small>Click to pin · Escape to dismiss</small>';tip.hidden=false;
  const box=target.getBoundingClientRect(),x=Number.isFinite(event?.clientX)?event.clientX:box.left+box.width/2,y=Number.isFinite(event?.clientY)?event.clientY:box.top+box.height/2;
  const r=tip.getBoundingClientRect();tip.style.left=Math.max(8,Math.min(x+16,window.innerWidth-r.width-12))+'px';tip.style.top=Math.max(8,Math.min(y+16,window.innerHeight-r.height-12))+'px';
}
document.addEventListener('pointerover',e=>{const el=e.target.closest?.('[data-tip]');if(el&&!tooltipPinned)showPaperTip(el,e);});
document.addEventListener('pointerout',e=>{const el=e.target.closest?.('[data-tip]');if(el&&!el.contains(e.relatedTarget)&&!tooltipPinned)hidePaperTip();});
document.addEventListener('focusin',e=>{const el=e.target.closest?.('[data-tip]');if(el){tooltipPinned=false;showPaperTip(el);}});
document.addEventListener('focusout',e=>{if(e.target.closest?.('[data-tip]')&&!tooltipPinned)hidePaperTip();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')hidePaperTip();const el=e.target.closest?.('[data-tip]');if(el&&['Enter',' '].includes(e.key)){e.preventDefault();showPaperTip(el);tooltipPinned=true;}if(e.target.id==='gallery-track'&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();e.target.scrollBy({left:(e.key==='ArrowRight'?1:-1)*e.target.clientWidth*.8,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}});
document.addEventListener('click',e=>{
  const tip=e.target.closest?.('[data-tip]');if(tip){showPaperTip(tip,e);tooltipPinned=true;return;}if(!e.target.closest?.('#chart-tooltip'))hidePaperTip();
  const b=e.target.closest?.('[data-paper-action]');if(!b)return;const action=b.dataset.paperAction,value=b.dataset.value,id=b.id;
  if(action==='tissue'){paperState.tissue=value;refreshPaperPart('gallery',renderPaperGallery(),id);}
  else if(action==='gallery-next'||action==='gallery-prev'){const el=document.getElementById('gallery-track');el.scrollBy({left:(action==='gallery-next'?1:-1)*el.clientWidth*.8,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
  else if(action==='resource-method'||action==='resource-reset'){
    paperState.resourceMethods=action==='resource-reset'?['cellpose','bering','comseg']:paperState.resourceMethods.includes(value)?paperState.resourceMethods.filter(x=>x!==value):[...paperState.resourceMethods,value];
    hidePaperTip();document.getElementById('paper-resources').innerHTML=renderPaperResources();
    if(id)document.getElementById(id)?.focus({preventScroll:true});
  }
  else if(action==='lineage'||action==='line-method'||action==='line-all'||action==='line-reset'){
    if(action==='lineage')paperState.lineage=value;
    if(action==='line-method')paperState.lineMethods=paperState.lineMethods.includes(value)?paperState.lineMethods.filter(x=>x!==value):[...paperState.lineMethods,value];
    if(action==='line-all')paperState.lineMethods=paperData.downstream.series.filter(s=>s.cases[paperState.lineage]).map(s=>s.methodId);
    if(action==='line-reset')paperState.lineMethods=['proseg','ucs','cellpose','mesmer','cellist','boms'];
    refreshPaperPart('downstream',renderDownstream(),id);
  }
});
document.addEventListener('change',e=>{
  const key=e.target.dataset.paperSelect;if(!key)return;paperState[key]=e.target.value;
  if(key==='platform')paperState.dataset='';
  if(key.startsWith('resource')){document.getElementById('paper-resources').innerHTML=renderPaperResources();document.getElementById('paper-'+key)?.focus({preventScroll:true});}
  else refreshPaperPart('leaderboard',renderPaperLeaderboard(),'paper-'+key);
});
