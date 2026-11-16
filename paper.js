/* The living-paper presentation layer. All quality/resource measurements come
 * from data.js. SpaSegCompass remains in app.js + engine.js, without new weights.
 */
const paperState={overviewTab:'metrics',tissue:'all',lineage:'myeloid',lineMethods:['proseg','ucs','cellpose','mesmer','cellist','boms']};
const paperColors={blue:'#358BC1',orange:'#F39A3D',slate:'#60A592',teal:'#60A592',lightBlue:'#81BFE3'};
const platformOrder=['Xenium','CosMx','MERFISH','Stereo-seq','STARmap'];
const numberLabel=(n,digits=0)=>Number.isFinite(n)?n.toLocaleString('en-US',{maximumFractionDigits:digits}):'Not available';
const shortNumber=n=>n>=1e9?+(n/1e9).toFixed(1)+'B':n>=1e6?+(n/1e6).toFixed(1)+'M':n>=1000?+(n/1000).toFixed(1)+'k':String(+n.toFixed(1));
const paperMean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:null;
const finiteValues=a=>a.filter(Number.isFinite);
function paperTip(title,rows,note=''){return esc(JSON.stringify({title,rows,note}));}
function tipAttrs(title,rows,note=''){return 'tabindex="0" role="button" aria-label="'+esc(title+'. '+rows.map(r=>r.join(': ')).join('. '))+'" data-tip="'+paperTip(title,rows,note)+'"';}
function sectionIntro(id,title){return '<div class="paper-section-heading"><h2 id="'+id+'-title">'+title+'</h2></div>';}

function renderOverview(){
  return '<section id="overview" class="paper-section overview-section" aria-labelledby="overview-title">'+
    '<div class="overview-intro"><div class="paper-hero"><h1 id="overview-title">SpaSeg<span>Bench</span></h1>'+
    '<p class="hero-subtitle">Benchmarking cell segmentation for subcellular spatial transcriptomics</p>'+
    '<div class="hero-actions"><a class="paper-primary" href="#gallery">Explore gallery '+glyph('arrow')+'</a><a class="paper-secondary" href="#recommendation">Find a method '+glyph('arrow')+'</a></div></div>'+
    '<div class="study-stats">'+[[31,'Datasets'],[16,'Methods'],[445,'Completed runs'],[5,'Platforms']].map(([n,label],i)=>'<div class="study-stat stat-'+i+'"><strong>'+n+'</strong><span>'+label+'</span></div>').join('')+'</div></div>'+
    '<div class="overview-explorer"><div class="overview-tabs" role="tablist" aria-label="Benchmark overview">'+['metrics','datasets'].map(id=>'<button type="button" id="overview-tab-'+id+'" role="tab" aria-selected="'+(paperState.overviewTab===id)+'" aria-controls="overview-panel-'+id+'" tabindex="'+(paperState.overviewTab===id?'0':'-1')+'" data-paper-action="overview-tab" data-value="'+id+'">'+(id==='metrics'?'Metrics':'Datasets')+'</button>').join('')+'</div>'+
    '<div id="overview-panel-metrics" class="overview-panel" role="tabpanel" aria-labelledby="overview-tab-metrics" tabindex="0"'+(paperState.overviewTab==='metrics'?'':' hidden')+'>'+renderFramework()+'</div>'+
    '<div id="overview-panel-datasets" class="overview-panel" role="tabpanel" aria-labelledby="overview-tab-datasets" tabindex="0"'+(paperState.overviewTab==='datasets'?'':' hidden')+'>'+renderDatasetLandscape()+'</div></div></section>';
}
function setOverviewTab(value,focus=false){
  if(!['metrics','datasets'].includes(value))return;
  paperState.overviewTab=value;hidePaperTip();
  document.querySelectorAll('[data-paper-action="overview-tab"]').forEach(button=>{const active=button.dataset.value===value;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
  ['metrics','datasets'].forEach(id=>{const panel=document.getElementById('overview-panel-'+id);if(panel)panel.hidden=id!==value;});
  if(focus)document.getElementById('overview-tab-'+value)?.focus({preventScroll:true});
  schedulePaperNavigation();
}
function overviewArt(name,alt,width=240,height=154){
  return '<img class="overview-diagram" src="assets/overview/'+name+'.svg?v=10" alt="'+esc(alt)+'" width="'+width+'" height="'+height+'" loading="lazy" decoding="async">';
}
function renderFramework(){
  const evaluations=[
    ['accuracy','Accuracy','Boundary, detection and transcript-assignment quality.','Reference and predicted cell outlines overlap, with a visible difference at the boundary.'],
    ['robustness','Robustness','Consistency across platforms, tissues and species.','Xenium, CosMx, MERFISH, Stereo-seq and STARmap connect to a shared evaluation.'],
    ['challenges','Challenging inputs','Large samples, small gene panels and dense cells.','A tiled tissue section, a sparse gene panel and densely packed cells.'],
    ['efficiency','Efficiency & impact','Runtime, memory and downstream contamination.','Resource bars and neighboring cells illustrate computational cost and transcript contamination.']
  ];
  return '<div class="evaluation-grid">'+evaluations.map(([id,title,description,alt])=>'<article class="evaluation-card"><h3>'+title+'</h3>'+overviewArt(id,alt,260,178)+'<p>'+description+'</p></article>').join('')+'</div>';
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
  return '<div id="dataset-landscape" class="dataset-landscape"><div class="dataset-triptych">'+metrics.map(([key,label,tone])=>{
    const values=rows.map(r=>r[key]),min=Math.min(...values),max=Math.max(...values);
    return '<article class="chart-card dataset-chart dataset-'+tone+'"><div class="dataset-chart-heading"><h4>'+label+'</h4></div><p class="dataset-range"><strong>'+shortNumber(min)+'–'+shortNumber(max)+'</strong><span>per dataset</span></p>'+datasetBarSvg(rows,key)+'</article>';
  }).join('')+'</div><div class="dataset-reading-guide"><span class="bar-key"><i></i> Bar & label = platform mean</span><span class="point-key"><i></i> One point = one dataset</span></div><p class="dataset-scope">Counts include full samples and cropped regions; genes are reported counts, not nominal panel sizes.</p></div>';
}

function leaderboardProfileKeys(options){
  const defaults=state.track==='image'?['pq','dice','boundary_f1','image_recall']:['f1','assign_accuracy','count_pearson','loc_p95_um'];
  return [...new Set([state.metric,...defaults,...options.map(([key])=>key)])].filter(key=>options.some(([id])=>id===key)).slice(0,4);
}
function leaderboardMetricLabel(key){return ({image_recall:'Recall',boundary_f1:'Boundary F1',assign_accuracy:'Assignment',count_pearson:'Count r',loc_p95_um:'P95 · µm'})[key]||metricLabels[key];}
function leaderboardProfile(rows,keys){
  const best=Object.fromEntries(keys.map(key=>{const values=rows.map(row=>row[key]).filter(Number.isFinite);return [key,values.length&&!metricInterpretation(key).startsWith('Descriptive')?(lowerIsBetter(key)?Math.min(...values):Math.max(...values)):null];}));
  return '<div class="board-profile"><div class="board-profile-heading"><h3>Metric profile</h3><span>Click a metric to rank</span></div><div class="board-table-scroll" role="region" aria-label="Method metric comparison" tabindex="0"><table class="board-table"><colgroup><col class="board-method-column">'+keys.map(()=>'<col>').join('')+'<col></colgroup><caption class="sr-only">Median metrics by method, ordered by '+esc(selectedMetricLabel())+'. Dataset counts refer to the selected ranking metric.</caption><thead><tr><th scope="col">Method</th>'+keys.map(key=>'<th scope="col"'+(key===state.metric?' class="selected-metric" aria-sort="'+(state.direction==='asc'?'ascending':'descending')+'"':'')+'><button id="profile-metric-'+key+'" data-action="profile-metric" data-id="'+key+'" aria-label="Rank by '+esc(metricLabels[key])+'">'+esc(leaderboardMetricLabel(key))+'<span aria-hidden="true">'+(lowerIsBetter(key)?'↓':'↑')+'</span></button></th>').join('')+'<th scope="col" title="Datasets with a measured value for the selected metric">Datasets</th></tr></thead><tbody>'+rows.map((row,index)=>{
    const coverage=new Set(row.observations.filter(r=>Number.isFinite(benchmarkEngine.reportValue(r.metrics[state.metric]))).map(r=>r.datasetId)).size;
    return '<tr><th scope="row"><button data-action="method" data-id="'+row.id+'"><span class="board-position">'+(Number.isFinite(row[state.metric])?String(rows.findIndex(r=>r[state.metric]===row[state.metric])+1).padStart(2,'0'):'—')+'</span>'+esc(row.name)+'</button></th>'+keys.map(key=>'<td class="'+(key===state.metric?'selected-metric ':'')+(Number.isFinite(row[key])&&row[key]===best[key]?'best-value':'')+'">'+metricNumber(row[key],key)+'</td>').join('')+'<td class="board-coverage">'+coverage+'</td></tr>';
  }).join('')+'</tbody></table></div></div>';
}
function renderPaperLeaderboard(){
  const options=metricOptions();
  if(!options.some(([key])=>key===state.metric)){state.metric=options[0]?.[0]||'';state.direction=lowerIsBetter(state.metric)?'asc':'desc';}
  const rows=options.length?rankRows():[],records=rows.flatMap(row=>row.observations),coverage=new Set(records.map(row=>row.datasetId)).size;
  return '<section id="leaderboard" class="paper-section" aria-labelledby="leaderboard-title">'+sectionIntro('leaderboard','Leaderboard')+
    '<div class="leaderboard-workspace"><div class="leaderboard-controls"><div class="board-track-row">'+trackHighlights()+'<p class="board-scope"><strong>'+rows.length+'</strong> '+(rows.length===1?'method':'methods')+' <span>·</span> <strong>'+coverage+'</strong> '+(coverage===1?'dataset':'datasets')+' <span>·</span> '+records.length+' '+(records.length===1?'record':'records')+'</p></div><div class="ranking-filters">'+
    selectControl('Metric','metric',options,state.metric)+
    selectControl('Platform','platform',[['','All platforms'],...platformOrder],state.platform)+
    selectControl('Dataset','dataset',[['','All datasets'],...datasets.filter(d=>!state.platform||d.platform===state.platform).map(d=>[d.id,d.name])],state.dataset)+
    selectControl('Segmentation prior','prior',[['','All states'],['yes','With prior'],['no','Without prior'],['unknown','Unconfirmed']],state.prior)+
    '</div></div><div class="board-comparison">'+(rows.length?'<div class="leaderboard-bars">'+chart(rows)+'</div>'+leaderboardProfile(rows,leaderboardProfileKeys(options)):'<div class="empty-compact" role="status"><strong>No comparable measurements</strong><button class="text-button" data-action="reset-filters">Clear filters</button></div>')+
    '</div><div class="leaderboard-note"><span>Median measured values · Dataset coverage varies.</span><span>Bold = best in column · Select a method for details</span></div></div></section>';
}

const galleryTissues=[['all','All tissues'],['merfish-colon','Colon · MERFISH'],['merfish-liver','Liver · MERFISH'],['xenium-breast-cancer','Breast cancer · Xenium'],['xenium-ccRCC','Kidney · Xenium'],['xenium-lymph','Lymph node · Xenium']];
function paperGalleryRows(){return visualRows().filter(r=>paperState.tissue==='all'||r.galleryGroup===paperState.tissue);}
function renderPaperGallery(){
  const rows=paperGalleryRows(),collection=state.images.filter(r=>paperState.tissue==='all'||r.galleryGroup===paperState.tissue);
  const missing=paperState.tissue==='all'?[]:methods.filter(m=>!collection.some(r=>r.methodId===m.id));
  let content=rows.map(r=>'<article class="gallery-slide"><div class="gallery-slide-title"><span>'+esc(byMethod(r.methodId).name)+'</span><span>'+esc(r.platform)+'</span></div><button class="gallery-image-button" data-action="image" data-id="'+esc(r.id)+'" aria-label="Enlarge '+esc(byMethod(r.methodId).name+' · '+galleryLabel(r))+'"><img src="'+imagePath(r.thumbnail)+'" width="'+r.width+'" height="'+r.height+'" alt="'+esc(byMethod(r.methodId).name+' visualization · '+galleryLabel(r))+'" loading="lazy" decoding="async"><span>Enlarge figure '+glyph('expand')+'</span></button><div class="gallery-slide-caption"><strong>'+esc(galleryLabel(r))+'</strong><span>Supplied visualization · '+esc(byMethod(r.methodId).name)+'</span></div></article>').join('');
  if(!rows.length)content='<div class="gallery-placeholder" role="status">'+glyph('image')+'<h3>'+(state.imageStatus==='error'?'Images could not be loaded':state.imageStatus==='loading'?'Loading figures…':'No figure for this selection')+'</h3><p>'+(state.imageStatus==='ready'?'This method was not included in the supplied tissue collection. Select another method or tissue.':'Please try again.')+'</p>'+(state.imageStatus==='error'?'<button class="paper-secondary" data-action="retry-images">Try again</button>':'')+'</div>';
  return '<section id="gallery" class="paper-section" aria-labelledby="gallery-title">'+sectionIntro('gallery','Gallery')+'<div class="gallery-explorer"><div class="gallery-explorer-toolbar"><div class="tissue-tabs" role="group" aria-label="Gallery tissue">'+galleryTissues.map(([id,label])=>'<button id="tissue-'+id+'" data-paper-action="tissue" data-value="'+id+'" aria-pressed="'+(paperState.tissue===id)+'">'+label+'</button>').join('')+'</div></div><div class="gallery-subtoolbar"><div><span class="gallery-live-dot"></span><strong>'+rows.length+' '+(rows.length===1?'figure':'figures')+'</strong><span>Scroll to compare · Select to enlarge</span></div>'+selectControl('Method','method',[['','All methods'],...methods.map(m=>[m.id,m.name])],state.visual.method,'visual')+'</div><div id="gallery-track" class="gallery-track" tabindex="0" aria-label="Segmentation figure carousel; use left and right arrow keys">'+content+'</div><div class="gallery-bottom"><p>'+(missing.length?'Not supplied for this tissue: '+esc(missing.map(m=>m.name).join(', '))+'.':'Colors follow each supplied visualization; they are not a shared cell-type legend across methods.')+'</p><div class="gallery-arrows"><button data-paper-action="gallery-prev" aria-label="Previous figures"'+(rows.length<2?' disabled':'')+'>'+glyph('arrow')+'</button><button data-paper-action="gallery-next" aria-label="Next figures"'+(rows.length<2?' disabled':'')+'>'+glyph('arrow')+'</button></div></div></div></section>';
}

const lineStyles={"ucs":["#358BC1",""],"cellpose":["#F39A3D",""],"mesmer":["#60A592",""],"proseg":["#C77F9B",""],"cellsam":["#358BC1","7 4"],"baysor":["#F39A3D","7 4"],"genesegnet":["#60A592","7 4"],"cellist":["#C77F9B","7 4"],"stardist":["#358BC1","2 3"],"comseg":["#F39A3D","2 3"],"bering":["#60A592","2 3"],"boms":["#C77F9B","2 3"],"unseg":["#358BC1","8 3 2 3"],"dissect":["#F39A3D","8 3 2 3"],"cellotype":["#60A592","8 3 2 3"],"cellpose3":["#C77F9B","8 3 2 3"]};
function selectedDownstream(){
  return paperData.downstream.series.filter(s=>paperState.lineMethods.includes(s.methodId)&&s.cases[paperState.lineage]);
}
function downstreamSvg(){
  const data=paperData.downstream,series=selectedDownstream(),W=850,H=410,L=68,R=35,T=42,B=67,pw=W-L-R,ph=H-T-B;
  const minDistance=data.binLeft[0],maxDistance=data.binRight.at(-1),x=d=>L+(d-minDistance)/(maxDistance-minDistance)*pw;
  const max=Math.max(10,Math.ceil(Math.max(0,...series.flatMap(s=>s.cases[paperState.lineage].foreign))/10)*10),y=v=>T+ph-v/max*ph;
  let svg='<svg class="data-svg downstream-svg" viewBox="0 0 '+W+' '+H+'" role="group" aria-label="Measured cumulative foreign transcripts per cell against signed distance from the cell boundary, with '+data.distances.length+' samples per curve."><rect x="'+L+'" y="'+T+'" width="'+(x(0)-L)+'" height="'+ph+'" fill="#F3FAFF"/><rect x="'+x(0)+'" y="'+T+'" width="'+(W-R-x(0))+'" height="'+ph+'" fill="#FFF6EB"/>';
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
  return '<section id="downstream" class="paper-section" aria-labelledby="downstream-title">'+sectionIntro('downstream','Downstream')+
    '<div class="downstream-layout"><aside class="downstream-story"><h3>Transcript contamination</h3><p>Trace how foreign-lineage transcripts accumulate from inside a cell to beyond its predicted boundary.</p><div class="boundary-stages"><span>Inside the cell<strong>−10 µm</strong></span>'+glyph('arrow')+'<span>Beyond the boundary<strong>+3.3 µm</strong></span></div><div class="measured-scope"><strong>Measured distance profiles</strong><p>'+data.distances.length+' recorded samples per curve. Hover, focus or tap along the plot to compare methods at the same distance. The vertical line marks the cell boundary.</p></div></aside>'+
    '<div class="chart-card downstream-chart"><div class="chart-card-heading"><div><h4>Boundary-associated contamination</h4><p>'+available.length+' methods with data · '+selected.length+' selected</p></div><div class="pill-controls" role="group" aria-label="Cell lineage">'+data.lineages.map(([v,l])=>'<button id="lineage-'+v+'" data-paper-action="lineage" data-value="'+v+'" aria-pressed="'+(paperState.lineage===v)+'">'+l+'</button>').join('')+'</div></div><div class="plot-scroll">'+downstreamSvg()+'</div>'+
    '<div class="line-legend" role="group" aria-label="Methods in contamination plot">'+data.series.map(s=>{const exists=!!s.cases[paperState.lineage];return '<button id="line-'+s.methodId+'" data-paper-action="line-method" data-value="'+s.methodId+'" aria-pressed="'+(exists&&paperState.lineMethods.includes(s.methodId))+'"'+(!exists?' disabled title="No record for this lineage"':'')+'><svg class="series-swatch" viewBox="0 0 28 8" aria-hidden="true"><path d="M0 4H28" fill="none" stroke="'+lineStyles[s.methodId][0]+'" stroke-width="2" stroke-dasharray="'+lineStyles[s.methodId][1]+'"/></svg>'+esc(byMethod(s.methodId).name)+(!exists?' <span>n/a</span>':'')+'</button>';}).join('')+'</div><div class="line-actions"><button data-paper-action="line-all">Show all available</button><button data-paper-action="line-reset">Reset selection</button></div>'+
    (missing.length?'<p class="missing-data-note">No Epi / Tumor record for '+esc(missing.join(' or '))+'.</p>':'')+
    '</div></div></section>';
}
function renderPaperRecommendation(){return '<section id="recommendation" class="paper-section recommendation-section" aria-labelledby="recommendation-title">'+sectionIntro('recommendation','Recommendation')+renderRecommend()+'</section>';}
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

function scrollToPaperHash(){const aliases={'#/':'overview','#/recommend':'recommendation','#/visuals':'gallery','#/explore':'dataset-landscape','#research-form':'research-form'};const id=aliases[location.hash]||location.hash.slice(1);if(id==='dataset-landscape')setOverviewTab('datasets');document.getElementById(id)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
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
  if(action==='overview-tab'){setOverviewTab(value,true);}
  else if(action==='tissue'){paperState.tissue=value;refreshPaperPart('gallery',renderPaperGallery(),id);}
  else if(action==='gallery-next'||action==='gallery-prev'){const el=document.getElementById('gallery-track');el.scrollBy({left:(action==='gallery-next'?1:-1)*el.clientWidth*.8,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
  else if(action==='lineage'||action==='line-method'||action==='line-all'||action==='line-reset'){
    if(action==='lineage')paperState.lineage=value;
    if(action==='line-method')paperState.lineMethods=paperState.lineMethods.includes(value)?paperState.lineMethods.filter(x=>x!==value):[...paperState.lineMethods,value];
    if(action==='line-all')paperState.lineMethods=paperData.downstream.series.filter(s=>s.cases[paperState.lineage]).map(s=>s.methodId);
    if(action==='line-reset')paperState.lineMethods=['proseg','ucs','cellpose','mesmer','cellist','boms'];
    refreshPaperPart('downstream',renderDownstream(),id);
  }
});
document.addEventListener('keydown',e=>{
  const tab=e.target.closest?.('[data-paper-action="overview-tab"]');
  if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  e.preventDefault();
  setOverviewTab(e.key==='Home'?'metrics':e.key==='End'?'datasets':paperState.overviewTab==='metrics'?'datasets':'metrics',true);
});
