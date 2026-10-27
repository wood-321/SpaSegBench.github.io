/* Presentation metadata and imported paper measurements. Recommendation evidence stays separate. */
const paperData = {
  study: { datasets:31, methods:16, platforms:5, technologies:7, completedRuns:445, applicableTasks:466, source:'SpaSegBench.pdf, Abstract and Results 2.1' },
  families: [
    { id:'image', label:'Image-based', input:'Nuclear & membrane staining', description:'Find cell shapes and boundaries from microscopy.', color:'blue', methods:['cellpose','cellpose3','cellsam','cellotype','mesmer','stardist','unseg'], output:'Cell masks' },
    { id:'transcript', label:'Transcript-based', input:'Spatial transcript coordinates', description:'Group molecules using point-cloud or graph models.', color:'orange', methods:['baysor','boms','proseg','bering','comseg'], output:'Transcript-to-cell assignments' },
    { id:'multimodal', label:'Multimodal', input:'Registered images + transcripts', description:'Combine molecular context with image guidance.', color:'slate', methods:['ucs','cellist','genesegnet','dissect'], output:'Masks + cell-by-gene matrices' }
  ],
  datasetStatistics: paperMeasurements.datasets,
  downstream: paperMeasurements.downstream
};
