/* AriAdne: capability rules, scoped evidence and explicit missingness bounds. */
function createBenchmarkEngine(data, catalog, settings={}) {
  const finite = v => typeof v === 'number' && Number.isFinite(v);
  const mean = a => a.length ? a.reduce((s,x)=>s+x,0)/a.length : null;
  const median = a => {const v=a.filter(finite).sort((x,y)=>x-y);return v.length?(v[Math.floor(v.length/2)]+v[Math.floor((v.length-1)/2)])/2:null;};
  const ranks = a => a.map(v=>1+a.filter(x=>x<v).length+(a.filter(x=>x===v).length-1)/2);
  const profiles = {
    image: {Balanced:[.35,.20,.20,.25],Morphology:[.20,.25,.35,.20],Detection:[.55,.10,.10,.25],Spatial:[.30,.10,.35,.25]},
    molecule: {Balanced:[.20,.25,.20,.20,.15],Detection:[.35,.20,.10,.25,.10],Quantification:[.10,.25,.40,.20,.05],Typing:[.15,.25,.15,.35,.10],Spatial:[.20,.20,.10,.15,.35]}
  };
  const axisNames={image:['detection','overlap','boundary','instance'],molecule:['detection','assignment','quantification','expression','localization']};
  const registry={
    image:{detection:[['detection_fbeta',1,1]],overlap:[['dice',1,1]],boundary:[['boundary_fbeta',1,1]],instance:[['sq',1,1/3],['aji',1,1/3],['mda',1,1/3]]},
    molecule:{detection:[['detection_fbeta',1,1]],assignment:[['overall_correct',1,1]],quantification:[['count_pearson',1,.25],['count_spearman',1,.25],['count_mae',-1,.25],['count_rmse',-1,.25]],expression:[['vec_cosine',1,.25],['vec_pearson',1,.25],['vec_js_dist',-1,.5]],localization:[['loc_mean_um',-1,.25],['loc_median_um',-1,.25],['loc_p95_um',-1,.5]]}
  };
  const sharedMetrics=Object.fromEntries(['image','molecule'].map(track=>{
    const entries=data.observations.filter(r=>r.primary!==false&&r.track===track),ids=catalog.filter(m=>m.track===track).map(m=>m.id);
    return [track,[...new Set(entries.flatMap(r=>Object.keys(r.metrics)))].filter(key=>ids.length&&ids.every(id=>entries.some(r=>r.methodId===id&&r.metrics[key]?.status==='measured'&&finite(r.metrics[key]?.value))))];
  }));
  if(settings.sharedOnly)for(const track of ['image','molecule']){
    const originalAxes=[...axisNames[track]],shared=sharedMetrics[track];
    const allowed=key=>key==='detection_fbeta'?[track==='image'?'image_precision':'precision',track==='image'?'image_recall':'recall'].every(k=>shared.includes(k)):key==='boundary_fbeta'?shared.includes('boundary_f1'):shared.includes(key);
    for(const [axis,leaves] of Object.entries(registry[track])){
      const available=leaves.filter(([key])=>allowed(key)),total=available.reduce((sum,l)=>sum+l[2],0);
      if(!available.length)delete registry[track][axis];
      else registry[track][axis]=available.map(([key,direction,weight])=>[key,direction,weight/total]);
    }
    axisNames[track]=originalAxes.filter(axis=>registry[track][axis]);
    for(const [goal,values] of Object.entries(profiles[track])){
      const kept=axisNames[track].map(axis=>values[originalAxes.indexOf(axis)]),total=kept.reduce((a,b)=>a+b,0);
      profiles[track][goal]=kept.map(v=>v/total);
    }
  }
  const capability={
    cellpose:{family:'image',prep:'Confirm image channels, physical scale and the segmentation target.'},
    cellpose3:{family:'image',prep:'Use the recorded cyto3 weights; check missed cells as well as precision.'},
    cellsam:{family:'image',prep:'Check model compatibility and detection coverage on representative image regions.'},
    mesmer:{family:'image',membrane:true,prep:'Provide nuclear and membrane signals for whole-cell boundaries; set image_mpp.'},
    stardist:{family:'image',wholeConditional:true,prep:'Choose target-appropriate weights; nuclear models do not establish whole-cell accuracy.'},
    cellotype:{family:'image',prep:'Confirm image domain, target and model weights.'},
    unseg:{family:'image',membrane:true,prep:'Provide compatible nuclear and membrane stains.'},
    baysor:{family:'transcript',free:true,prep:'Check transcript coordinates, background handling, cell scale and minimum molecule settings.'},
    bering:{family:'transcript',uncertain:true,prep:'Confirm the trained model, labels, image inputs and domain transfer for the selected configuration.'},
    boms:{family:'transcript',uncertain:true,prep:'Confirm the exact software version and input contract.'},
    proseg:{family:'prior',prep:'Prepare initial cell assignments or a registered nuclear mask. Missed prior cells may remain missing.'},
    ucs:{family:'prior',prep:'Create a gene map and nuclear mask with identical H/W and registration; record resolution and gene dimension.'},
    comseg:{family:'prior',centers:true,prep:'Provide RNA coordinates and compatible nuclear masks or centers; verify the required output format.'},
    cellist:{family:'prior',prep:'Check initial nuclear segmentation and image–expression registration across the entire ROI.'},
    genesegnet:{family:'joint',prep:'Use registered images and transcripts; check training-domain overlap and held-out performance.'},
    dissect:{family:'joint',prep:'Register image and transcript inputs; check output coverage and evaluation provenance.'}
  };
  function weights(track,goal='Balanced',custom) {
    const names=axisNames[track];if(!names)throw Error('Unknown evidence track.');
    goal=({Quality:'Morphology',Localization:'Spatial',Assignment:'Balanced'})[goal]||goal;
    const w=custom||Object.fromEntries(names.map((n,i)=>[n,(profiles[track][goal]||profiles[track].Balanced)[i]]));
    if(Object.keys(w).some(k=>!names.includes(k))||names.some(k=>!finite(w[k])||w[k]<0)||Math.abs(Object.values(w).reduce((a,b)=>a+b,0)-1)>1e-9)throw Error('Quality weights must be nonnegative and sum to one across this track.');
    return {...w};
  }
  function fbeta(p,r,beta=1){return finite(p)&&finite(r)?(p+r===0?0:(1+beta*beta)*p*r/(beta*beta*p+r)):null;}
  function select(f={}){return data.observations.filter(r=>r.primary&&(!f.track||f.track==='all'||r.track===f.track)&&(!f.platform||r.platform===f.platform)&&(!f.dataset||r.datasetId===f.dataset)&&(!f.prior||(f.prior==='yes'?r.prior===true:f.prior==='no'?r.prior===false:r.prior===null)));}
  function getMetric(row,name,beta=1,independentOnly=false){
    const get=n=>{const m=row.metrics[n];return m?.status==='measured'&&finite(m.value)&&m.referenceStatus!=='reference_concordance'&&(!independentOnly||m.referenceStatus==='independent')?m.value:null;};
    if(name==='detection_fbeta')return fbeta(get(row.track==='image'?'image_precision':'precision'),get(row.track==='image'?'image_recall':'recall'),beta);
    if(name==='boundary_fbeta')return fbeta(get('boundary_precision'),get('boundary_recall'))??get('boundary_f1');
    return get(name);
  }
  function utilities(rows,goal='Balanced',custom,options={}){
    const groups=new Map(),output=[];
    for(const row of rows.filter(r=>r.primary!==false)){
      if(!groups.has(row.group))groups.set(row.group,new Map());
      if(!groups.get(row.group).has(row.methodId))groups.get(row.group).set(row.methodId,row);
    }
    for(const unique of groups.values()){
      const group=[...unique.values()],track=group[0].track;
      if(group.some(r=>r.track!==track))throw Error('Comparison groups cannot mix tracks.');
      const w=weights(track,goal,custom),beta=goal==='Detection'?2:1,normalized=new Map(group.map(r=>[r.id,{}]));
      for(const leaves of Object.values(registry[track]))for(const [name,direction] of leaves){
        const available=group.map(row=>({row,value:getMetric(row,name,beta,options.independentOnly)})).filter(e=>finite(e.value));
        if(available.length<2)continue;
        const rank=ranks(available.map(e=>e.value*direction));
        // Keep the full comparator set fixed. A missing competitor can rank
        // anywhere, so even an observed metric may have an ordinal interval.
        available.forEach((e,i)=>normalized.get(e.row.id)[name]={lower:(rank[i]-1)/(group.length-1),upper:(rank[i]-1+group.length-available.length)/(group.length-1)});
      }
      const entries=group.map(row=>{
        const scores=normalized.get(row.id),axes={},axisBounds={};let lower=0,missing=0;
        for(const [axis,leaves] of Object.entries(registry[track])){
          let lo=0,unknown=0;
          for(const [name,,weight] of leaves){if(scores[name]){lo+=weight*scores[name].lower;unknown+=weight*(scores[name].upper-scores[name].lower);}else unknown+=weight;}
          axisBounds[axis]={lower:lo,upper:lo+unknown,coverage:1-unknown};axes[axis]=unknown<1e-9?lo:null;lower+=w[axis]*lo;missing+=w[axis]*unknown;
        }
        return {row,lower,upper:lower+missing,coverage:1-missing,axes,axisBounds,utility:missing<1e-9?lower:null,metricsUsed:Object.keys(scores),reason:missing>1e-9?'incomplete_evidence':null};
      });
      const complete=entries.filter(e=>finite(e.utility)),rank=ranks(complete.map(e=>-e.utility));complete.forEach((e,i)=>e.rank=rank[i]);output.push(...entries);
    }
    return output;
  }
  function reportValue(m){return m?.status==='measured'&&finite(m.value)?m.value:null;}
  function summarize(filters={},goal='Balanced'){
    const rows=select(filters),evaluated=utilities(rows,goal);
    return catalog.filter(m=>!filters.track||filters.track==='all'||m.track===filters.track).map(method=>{
      const observations=rows.filter(r=>r.methodId===method.id),scores=evaluated.filter(e=>e.row.methodId===method.id),values={},metricCounts={};
      for(const name of new Set(observations.flatMap(r=>Object.keys(r.metrics)))){const a=observations.map(r=>reportValue(r.metrics[name])).filter(finite);values[name]=median(a);metricCounts[name]=a.length;}
      const complete=scores.filter(s=>finite(s.utility));
      return {...method,...values,metricCounts,observations,scores,datasets:new Set(observations.map(r=>r.datasetId)).size,overall:mean(complete.map(s=>s.utility)),medianRank:median(complete.map(s=>s.rank)),utilityCoverage:mean(scores.map(s=>s.coverage)),nGroups:complete.length,priorStates:[...new Set(observations.map(r=>r.prior))],excludedRows:observations.filter(r=>Object.values(r.metrics).some(m=>['incomparable','invalid','unresolved'].includes(m.status))).length,mixedPrior:new Set(observations.map(r=>r.prior)).size>1};
    }).filter(m=>m.observations.length);
  }
  function compare(a,b){return(a.medianRank??Infinity)-(b.medianRank??Infinity)||(b.overall??-Infinity)-(a.overall??-Infinity)||a.name.localeCompare(b.name);}
  function metadata(row){const key=row.inventoryId||({'xenium_7':'xenium7','xenium_9':'xenium9','xenium_10':'xenium10'})[row.datasetId]||row.datasetId;return(data.inventory||[]).find(i=>i.id===key);}
  function similarity(row,q){
    const meta=metadata(row),features=[],missing=[];let distance=0,total=0;
    const add=(key,d,w)=>{features.push(key);distance+=d*w;total+=w;};
    if(q.platform&&q.platform!=='Other')add('platform',row.platform===q.platform?0:1,.2);
    if(q.tissue){if(meta)add('tissue',meta.tissue.toLowerCase().includes(q.tissue.toLowerCase())?0:1,.2);else missing.push('tissue');}
    if(q.species&&q.species!=='Unknown'){if(meta)add('species',meta.species===q.species?0:1,.1);else missing.push('species');}
    if(+q.genes>0){if(meta?.panelGenes)add('panel size',Math.min(1,Math.abs(Math.log2(+q.genes/meta.panelGenes))/4),.2);else missing.push('panel size');}
    for(const key of ['transcripts','pixels','density'])if(+q[key]>0)missing.push(key);
    if(q.stain&&q.stain!=='unknown')missing.push('used staining channels');
    return{weight:total?Math.exp(-distance/total):1,features,missing};
  }
  function assessResources(methodId,q){
    const all=(data.resources||[]).filter(r=>r.methodId===methodId),mode=q.gpu==='Not available'?all.filter(r=>!r.gpuUsed):all;
    const number=v=>v!==''&&v!=null&&Number.isFinite(+v)&&+v>0?+v:null;
    const ram=number(q.memory),vram=number(q.vram),time=number(q.runtime),fits=r=>(!ram||r.ramGiB<=ram)&&(!r.gpuUsed||!vram||r.vramGiB<=vram)&&(!time||r.runtimeSeconds<=time*3600);
    const compatible=mode.filter(fits),verified=mode.filter(r=>r.runVerified&&r.roiLinkStatus==='matched'&&q.runId&&r.runId===q.runId&&q.hardwareId===r.hardwareId),over=mode.filter(r=>!fits(r));
    let status='conditional',note='Historical successful runs; new data and hardware require a pilot.';
    if(!all.length){status='unknown';note='No measured resource records are available.';}
    else if(q.gpu==='Not available'&&!mode.length)note='No CPU-only run was observed; a CPU configuration requires verification.';
    else if(verified.length){status=verified.some(fits)?'feasible':'infeasible';note=status==='feasible'?'A verified matching run fits the limits; allow operating headroom.':'The verified original configuration exceeds a hard limit.';}
    else if(mode.length&&!compatible.length&&(ram||vram||time))note='None of the observed configurations in this mode fits all entered limits. A smaller tile/batch requires separate verification.';
    const report=mode;
    const modes=[false,true].map(gpu=>{const rows=report.filter(r=>r.gpuUsed===gpu);return{label:gpu?'GPU used':'CPU only',runs:rows.length,runtimeMedian:median(rows.map(r=>r.runtimeSeconds)),ramMedian:median(rows.map(r=>r.ramGiB)),vramMax:rows.length?Math.max(...rows.map(r=>r.vramGiB)):null};}).filter(m=>m.runs);
    return{status,note,total:all.length,cpuRuns:all.filter(r=>!r.gpuUsed).length,withinBudget:compatible.length,overBudget:over.length,runtimeMedian:median(report.map(r=>r.runtimeSeconds)),ramMedian:median(report.map(r=>r.ramGiB)),ramMax:report.length?Math.max(...report.map(r=>r.ramGiB)):null,vramMax:report.length?Math.max(...report.map(r=>r.vramGiB)):null,mode:q.gpu==='Not available'?'CPU-only':'Observed CPU/GPU mix',modes,sourceRows:report.map(r=>r.sourceRow),predicted:false,verifiedRows:verified.filter(fits)};
  }
  function recommend(query){
    const q={track:'molecule',goal:'Balanced',platform:'Other',target:'Whole cell',input:'image_transcripts',priorType:'none',stain:'unknown',allowPrior:'yes',gpu:'Available',priority:'Accuracy',...query};
    let w;try{w=weights(q.track,q.goal,q.customWeights);}catch(error){return{decision:'invalid_input',rows:[],exploratoryRows:[],excluded:[],warnings:[],weights:{},reason:error.message};}
    const result={decision:'conditional_candidates',rows:[],exploratoryRows:[],excluded:[],warnings:[],weights:w,certified:false,confidence:'descriptive',rules:[],comparison:null};
    const invalid=['memory','vram','runtime','transcripts','pixels','genes','density','pixelSize','maxP95'].filter(k=>q[k]!==''&&q[k]!=null&&(!Number.isFinite(+q[k])||+q[k]<=0));
    for(const key of ['minRecall','minAssignment','minPQ'])if(q[key]!==''&&q[key]!=null&&(!Number.isFinite(+q[key])||+q[key]<0||+q[key]>1))invalid.push(key);
    if(invalid.length)return{...result,decision:'invalid_input',reason:'Check the values for: '+invalid.join(', ')+'.'};
    const hasImage=['image','image_transcripts'].includes(q.input),hasRNA=['transcripts','image_transcripts','bins'].includes(q.input);
    if(q.analyte==='protein'&&q.track==='molecule')return{...result,decision:'pilot_required',reason:'The RNA benchmark does not validate protein-molecule segmentation. Select image segmentation if suitable images are available.',rules:['R20']};
    if((q.track==='image'&&!hasImage)||(q.track==='molecule'&&!hasRNA))return{...result,decision:'no_feasible_candidate',reason:'This evidence track requires '+(q.track==='image'?'images.':'spatial RNA measurements.'),rules:['R01']};
    const candidates=[];
    for(const method of catalog.filter(m=>m.track===q.track)){
      const cap=capability[method.id],reasons=[],conditions=[],rules=['R01'],config={...method,preparation:[cap.prep],pipeline:false,priorType:q.priorType};let excluded=null;
      if(cap.family==='joint'&&!hasImage)excluded='Registered images are required for this image–transcript configuration.';
      if(cap.family==='prior'){
        if(q.priorType==='none'){
          if(hasImage&&q.allowPrior==='yes'){config.pipeline=true;config.name='Nuclear segmentation → '+method.name;conditions.push('Generate and register an external nuclear prior; this combined workflow has not been benchmarked.');rules.push('R02');}
          else excluded='Initial cell/nuclear information is required. Provide a prior or allow generation from an image.';
        }else if(q.priorType==='unknown')conditions.push('Confirm the available prior and registration.');
        else if(q.priorType==='centroids'&&!cap.centers)conditions.push('Centers alone are not a verified input here; construct the required mask or assignments.');
      }
      if(cap.membrane&&q.target==='Whole cell'&&q.stain!=='nuclear_membrane'){
        if(q.stain==='unknown')conditions.push('Confirm nuclear and membrane signals for whole-cell segmentation.');else excluded='This whole-cell configuration requires compatible nuclear and membrane signals.';
      }
      if(q.stain==='he'&&q.track==='image')conditions.push('H&E compatibility and weights require verification; fluorescence performance does not transfer directly.');
      if(q.target==='Nucleus')conditions.push('The benchmark does not certify a nucleus-specific ranking; verify target-specific weights and evaluation.');
      if(cap.wholeConditional&&q.target==='Whole cell')conditions.push('Confirm whole-cell model weights; a nuclear model does not meet this target.');
      if(cap.uncertain)conditions.push('Confirm the exact version and input/model contract.');
      if(q.dimension==='3D')conditions.push('Verify 3D support, coordinates and weights; these summaries do not establish a 3D ranking.');
      if(q.input==='bins')conditions.push('Validate the weighted-bin/UMI adapter, spatial resolution and registration.');
      if(excluded){result.excluded.push({id:method.id,name:method.name,reason:excluded});continue;}
      config.resources=assessResources(method.id,q);
      if(config.resources.status==='infeasible'){result.excluded.push({id:method.id,name:method.name,reason:config.resources.note});continue;}
      let evidence=select({track:q.track}).filter(r=>r.methodId===method.id&&!r.issues.includes('row_quarantined')&&r.roiLinkStatus!=='conflict'&&!r.issues.includes('reference_platform_mismatch'));
      if(config.pipeline||(q.priorType==='external_nuclei'&&cap.family==='prior'))evidence=[];
      else if(q.priorType==='external_nuclei')evidence=evidence.filter(r=>r.track==='image'||r.prior===false);
      else if(q.priorType==='none')evidence=evidence.filter(r=>r.track==='image'||r.prior===false);
      else if(q.priorType==='platform')evidence=evidence.filter(r=>r.track==='image'||r.prior===true);
      if(q.target==='Nucleus'||q.dimension==='3D'||q.stain==='he')evidence=[];
      config.evidence=evidence;config.conditions=conditions;config.rules=rules;config.reasons=reasons;config.inputStatus=conditions.length?'conditional':'compatible';config.evidenceLevel=evidence.length?'descriptive':'capability_only';
      config.supportFeatures=[...new Set(evidence.flatMap(r=>similarity(r,q).features))];config.unknownFeatures=[...new Set(evidence.flatMap(r=>similarity(r,q).missing))];config.supportWeight=mean(evidence.map(r=>similarity(r,q).weight))||0;candidates.push(config);
    }
    if(!candidates.length)return{...result,decision:'no_feasible_candidate',reason:'No compatible configuration satisfies these inputs. Review exclusions or allow a preparatory step.'};
    const grouped=new Map();
    for(const c of candidates)for(const row of c.evidence){if(!grouped.has(row.group))grouped.set(row.group,new Map());grouped.get(row.group).set(c.id,row);}
    const signatures=new Map();
    for(const [group,entries] of grouped){if(entries.size<2)continue;const signature=[...entries.keys()].sort().join(',');if(!signatures.has(signature))signatures.set(signature,[]);signatures.get(signature).push(group);}
    const blocks=[...signatures.entries()].map(([signature,groups])=>({ids:signature.split(','),groups,affinity:mean(groups.map(g=>similarity([...grouped.get(g).values()][0],q).weight))}));
    blocks.sort((a,b)=>b.affinity-a.affinity||b.ids.length*b.groups.length-a.ids.length*a.groups.length||a.ids.join().localeCompare(b.ids.join()));
    const block=blocks[0];
    if(block){
      const rows=block.groups.flatMap(g=>[...grouped.get(g).values()]),descriptive=utilities(rows,q.goal,w),independent=utilities(rows,q.goal,w,{independentOnly:true});
      result.comparison={groups:block.groups.length,methods:block.ids,mode:'within_group_rank',featuresOnly:true};
      for(const c of candidates.filter(c=>block.ids.includes(c.id))){
        const scores=descriptive.filter(s=>s.row.methodId===c.id),verified=independent.filter(s=>s.row.methodId===c.id);
        const aggregate=(list,key)=>{const ww=list.map(s=>similarity(s.row,q).weight);return list.reduce((sum,s,i)=>sum+s[key]*ww[i],0)/ww.reduce((a,b)=>a+b,0);};
        c.bounds={lower:aggregate(scores,'lower'),upper:aggregate(scores,'upper'),coverage:aggregate(scores,'coverage')};c.independentBounds={lower:aggregate(verified,'lower'),upper:aggregate(verified,'upper'),coverage:aggregate(verified,'coverage')};
        c.axes=Object.fromEntries(axisNames[q.track].map(axis=>[axis,Object.fromEntries(['lower','upper','coverage'].map(key=>[key,aggregate(scores.map(s=>({...s,...s.axisBounds[axis]})),key)]))]));
        c.sourceRows=scores.map(s=>s.row.source);c.nGroups=scores.length;c.rawMetrics=Object.fromEntries([...new Set(scores.flatMap(s=>Object.keys(s.row.metrics)))].map(key=>[key,median(scores.map(s=>reportValue(s.row.metrics[key])).filter(finite))]));
        c.reasons.push('Compared on '+scores.length+' shared provisional group(s); unknown-reference measurements remain descriptive.');
      }
    }
    for(const c of candidates){
      c.sourceRows ||= c.evidence.map(r=>r.source);c.nGroups ||= 0;c.rawMetrics ||= {};c.qualityFloorStatus='not_requested';
      for(const [field,key,direction] of [['minRecall',q.track==='image'?'image_recall':'recall',1],['minAssignment','overall_correct',1],['minPQ','pq',1],['maxP95','loc_p95_um',-1]])if((!settings.sharedOnly||sharedMetrics[q.track].includes(key))&&q[field]!==''&&q[field]!=null){
        const values=c.evidence.map(r=>getMetric(r,key,1,true)).filter(finite);
        if(values.length&&values.some(v=>direction*(v-Number(q[field]))<0)){c.qualityFloorStatus='observed_violation';c.conditions.push('Some independent observations violate the requested '+key+' threshold.');}
        else{if(c.qualityFloorStatus!=='observed_violation')c.qualityFloorStatus='unverified';c.conditions.push('The requested '+key+' threshold is not verified for your data.');}
      }
      if(q.goal==='Detection')c.reasons.push('Recall is emphasized with F2; precision and instance/assignment coverage remain visible.');
      if(q.track==='molecule'&&q.goal==='Quantification')c.reasons.push(settings.sharedOnly?'Count errors and expression correlations guide this comparison.':'Count errors and overall correct assignment matter alongside expression correlations.');
      if(q.goal==='Spatial')c.reasons.push(q.track==='image'?'Boundary and instance separation are emphasized.':'Tail localization error (p95) is retained alongside mean and median error.');
      if(q.density)c.conditions.push('Include crowded and sparse regions in the pilot; no calibrated density-specific winner is asserted.');
      if(q.transcripts||q.pixels)c.conditions.push('Measure processed input size in a contiguous pilot ROI; no validated size-to-cost curve is available.');
      if(q.pixelSize)c.preparation.push('Use the supplied physical scale ('+Number(q.pixelSize)+' µm/pixel) to register inputs and configure any resampling; do not infer scale from image dimensions.');
      c.reasons.push(c.resources.cpuRuns+' successful CPU-only run(s) among '+c.resources.total+' resource observations.');
    }
    const eligible=candidates.filter(c=>c.qualityFloorStatus!=='observed_violation');
    for(const c of candidates.filter(c=>c.qualityFloorStatus==='observed_violation'))result.excluded.push({id:c.id,name:c.name,reason:'Independent historical measurements violate a requested quality floor; review the original records.'});
    if(!eligible.length)return{...result,decision:'pilot_required',reason:'No candidate clears the requested historical quality checks. Review the thresholds and evaluate a representative pilot.'};
    const penalty=c=>(q.gpu==='Not available'&&!c.resources.cpuRuns?2:0)+((q.memory||q.vram||q.runtime)&&!c.resources.withinBudget?1:0);
    const compared=eligible.filter(c=>c.bounds),activeAxes=Object.keys(w).filter(k=>w[k]>0);
    // Pareto dominance must hold on every active quality axis; a scalar score
    // must not discard a method with a complementary boundary/assignment profile.
    const robust=compared.filter(c=>!compared.some(other=>other.id!==c.id&&penalty(other)<=penalty(c)&&activeAxes.every(k=>other.axes[k].lower>=c.axes[k].upper-1e-9)&&activeAxes.some(k=>other.axes[k].lower>c.axes[k].upper+1e-9)));
    const order=(a,b)=>{
      return penalty(a)-penalty(b)||Number(!a.bounds)-Number(!b.bounds)||b.supportWeight-a.supportWeight||(b.bounds?.lower||0)-(a.bounds?.lower||0)||a.conditions.length-b.conditions.length||a.name.localeCompare(b.name);
    };
    const pool=[...robust,...eligible.filter(c=>!c.bounds)].sort(order),first=pool[0]||eligible.sort(order)[0];
    const alternatives=pool.filter(c=>c.id!==first.id),bestPenalty=alternatives.length?Math.min(...alternatives.map(penalty)):0;
    const complement=c=>first.axes&&c.axes?activeAxes.reduce((sum,k)=>sum+w[k]*Math.max(0,c.axes[k].lower-first.axes[k].lower),0):0;
    const supportedAlternatives=alternatives.filter(c=>penalty(c)===bestPenalty&&c.bounds);
    supportedAlternatives.sort((a,b)=>complement(b)-complement(a)||order(a,b));
    const second=supportedAlternatives[0]||alternatives[0];
    if(second)second.reasons.push(first.axes&&second.axes&&complement(second)>0?'Retained for a complementary quality profile on the shared comparison block.':'Retained as another configuration to test; statistical complementarity is not established.');
    result.rows=[first,...(second?[second]:[])];result.exploratoryRows=result.rows;result.allCandidates=candidates;
    result.reason='A conditional shortlist for a small pilot, combining compatible inputs, complementary quality measures and observed resource use.';
    if(result.rows.every(c=>penalty(c)>0)){result.decision='pilot_required';result.reason='No observed in-mode configuration fits every entered limit. These are adaptation candidates, not configurations confirmed to meet your budget.';}
    result.rules=['R01','R03','R15','R16','R17','R18','R19',...(q.density?['R12']:[])];
    result.warnings.push('Quality intervals describe missing evidence, not confidence intervals or predicted accuracy. Independent sample-level validation is not complete.');
    if(!block)result.warnings.push('No shared block supports numerical ranking for these configurations. This shortlist uses input compatibility and execution evidence.');
    if(q.platform==='Other'||!select({platform:q.platform,track:q.track}).length)result.warnings.push('This platform is outside measured coverage. Compatible methods remain eligible, with a local pilot required.');
    if(q.priority==='Speed')result.warnings.push('No quality–resource run links are verified in this snapshot. Historical runtimes are shown; a joint speed/quality score is withheld.');
    if(q.priority==='Memory')result.warnings.push('Memory is screened against your entered RAM and per-card VRAM limits. Historical medians alone do not establish that a new workload will fit.');
    if(q.priorType==='none'&&hasImage&&q.allowPrior==='yes')result.warnings.push('External-prior workflows require their own quality and cost measurements. Do not add prior-generation time twice.');
    result.pilot=['Choose contiguous representative ROIs, including crowded or weakly stained regions.','Fix coordinates, filters, prior source and configuration across the comparison.','Measure end-to-end time, task RAM and per-card VRAM; check the required quality axes.','Without independent ground truth, report intrinsic QC only, not measured recall or assignment accuracy.'];
    return result;
  }
  return{select,utilities,summarize,recommend,weights,ranks,mean,median,reportValue,compare,registry,profiles,capability,fbeta,assessResources,similarity,sharedMetrics};
}
const benchmarkEngine=createBenchmarkEngine(benchmark,methods,{sharedOnly:true});
