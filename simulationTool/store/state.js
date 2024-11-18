/**
 * User type definition
 * @typedef {Object} SimulationToolState
 * @property {Array.<Object>} ensembles a list of ensembles
 * @property {boolean} ensemblesLoading flag indicating if ensembles are loading
 * @property {string} id the ID of the simulation tool
 * @property {Object} jobResultData data of the job result
 * @property {Array.<Object>} jobs a list of jobs
 * @property {boolean} jobsLoading flag indicating if jobs are loading
 * @property {string} mode the current view: 'processes', 'process', 'job' or 'map'
 * @property {Object|null} process the current process
 * @property {Array.<Object>} processes a list of processes
 * @property {boolean} processesLoading flag indicating if processes are loading
 * @property {Array.<Object>} providers a list of providers
 * @property {boolean} providersLoading flag indicating if providers are loading
 * @property {string|null} selectedEnsembleId the selected ensemble id
 * @property {string|null} selectedJobId the selected job id
 * @property {string|null} selectedProcessId the selected process id
 * @property {Object} userDetailsCache cache for user details
 */
const state = {
    ensembles: [],
    ensemblesLoading: false,
    id: "simulationTool",
    name: "additional:modules.tools.simulationTool.toolName",
    description: "additional:modules.tools.simulationTool.toolDescription",
    jobResultData: {},
    jobs: [],
    jobsLoading: false,
    mode: "home-panel",
    process: null,
    processes: [],
    processesLoading: false,
    providers: [],
    providersLoading: false,
    selectedEnsembleId: null,
    selectedJobId: null,
    selectedProcessId: null,
    userDetailsCache: {}
};

export default state;
