/**
 * User type definition
 * @typedef {Object} SimulationToolState
 * @property {string} id the ID of the simulation tool
 * @property {string} mode the current view: 'processes', 'process', 'job' or 'map'
 * @property {Array.<Object>} processes a list of processes
 * @property {string} selectedProcessId the selected process id
 * @property {string} selectedJobId the selected job id
 * @property {string} name displayed as title (config-param)
 * @property {string} icon icon next to title (config-param)
 * @property {boolean} renderToWindow if true, tool is rendered in a window, else in sidebar (config-param)
 * @property {boolean} resizableWindow if true, window is resizable (config-param)
 * @property {boolean} isVisibleInMenu if true, tool is selectable in menu (config-param)
 * @property {boolean} deactivateGFI flag if tool should deactivate gfi (config-param)
 * @property {Number} initialWidth Size of the sidebar when opening.
 * @property {Number} initialWidthMobile Mobile size of the sidebar when opening.
 */
const state = {
    id: "simulationTool",
    // 'process-list' | 'process-details' | 'job' | 'job-details' | 'job-execution' | 'ensemble-list'
    mode: "home-panel",
    ensembles: [],
    ensemblesLoading: false,
    userNameCache: {},
    process: null,
    processes: [],
    processesLoading: false,
    jobs: [],
    jobsLoading: false,
    selectedProcessId: null,
    selectedJobId: null,
    selectedEnsembleId: null,
    jobResultData: null,
    // defaults for config.json parameters
    name: "Sim Tool",
    icon: "bi-sliders2",
    renderToWindow: true,
    resizableWindow: true,
    isVisibleInMenu: true,
    deactivateGFI: false,
    initialWidth: 500,
    initialWidthMobile: 300
};

export default state;
