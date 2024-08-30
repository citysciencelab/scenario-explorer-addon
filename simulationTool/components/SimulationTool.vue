<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import ProcessList from "./Process/ProcessList.vue";
import SimulationProcess from "./SimulationProcess.vue";
import SimulationProcessJob from "./SimulationProcessJob.vue";
import JobList from "./Job/JobList.vue";
import SideMenu from "./SideMenu.vue";
import EnsembleList from "./Ensemble/EnsembleList.vue";
import actions from "../store/actions";
import getters from "../store/getters";
import mutations from "../store/mutations";
import JobExecution from "./Job/JobExecution.vue";
import ProcessDetails from "./Process/ProcessDetails.vue";

const MIN_WIDTH = 900;

export default {
    name: "SimulationTool",
    components: {
        EnsembleList,
        JobExecution,
        JobList,
        ProcessDetails,
        ProcessList,
        SideMenu,
        SimulationProcess,
        SimulationProcessJob
    },
    computed: {
        ...mapGetters("Modules/SimulationTool", Object.keys(getters))
    },
    mounted: async function () {
        await this.checkLoggedIn();
        this.maximizeDrawer();
        this.fetchProcesses();
        this.fetchJobs();
    },
    /**
     * Put initialize here if mounting occurs after config parsing
     * @returns {void}
     */
    methods: {
        ...mapActions("Modules/Login", [
            "checkLoggedIn"
        ]),
        ...mapMutations("Menu", [
            "setCurrentMenuWidth"
        ]),
        ...mapMutations("Modules/SimulationTool", Object.keys(mutations)),
        ...mapActions("Modules/SimulationTool", Object.keys(actions)),
        maximizeDrawer () {
            if (window.innerWidth / 4 < MIN_WIDTH) {
                this.setCurrentMenuWidth({
                    side: "secondaryMenu",
                    width: MIN_WIDTH + "px"
                });
            }
        },
        /**
         * Selects a process by id
         * @returns {void}
         */
        selectProcess ({id, mode}) {
            this.setSelectedProcessId(id);
            this.setMode(mode);
        },
        /**
         * Selects a job by id
         * @returns {void}
         */
        selectJob (id) {
            this.setSelectedJobId(typeof id === "string" ? id : null);

            if (typeof id === "string") {
                this.setMode("job");
            }
            else if (this.selectedProcessId) {
                this.setMode("process");
            }
            else {
                this.setMode("process-list");
            }
        },
        navigate(evt) {
            const key = evt.target.dataset.key;
            if (key) {
                this.setMode(key);
            }
        }
    }
};
</script>

<template>
    <div id="tool-simulationTool">
        <div class="content">
            <ProcessList
                v-if="mode === 'process-list'"
                :processes="processes"
                @selected="selectProcess"
            />
            <ProcessDetails
                v-if="mode === 'process-details'"
                @close="() => setMode('process-list')"
            />
            <SimulationProcess
                v-if="mode === 'process'"
                :process-id="selectedProcessId"
                @selected="selectJob"
                @close="() => setMode('process-list')"
            />
            <SimulationProcessJob
                v-if="mode === 'job'"
                :job-id="selectedJobId"
                :process-id="selectedProcessId"
                @close="() => setMode('process-list')"
            />
            <JobList
                v-if="mode === 'job-list'"
                @close="() => setMode('process-list')"
                :jobs="jobs"
            />
            <JobExecution
                v-if="mode === 'job-execution'"
                @close="() => setMode('job-list')"
            />
            <EnsembleList
                v-if="mode === 'ensemble-list'"
                @close="() => setMode('process-list')"
                :ensembles="ensembles"
            />
        </div>
        <SideMenu />
    </div>
</template>

<style lang="scss" scoped>
    #tool-simulationTool {
        height: 100%;
        overflow: hidden;
        display: flex;

        .content {
            flex: 1;
            padding: 1rem;
        }

    }
</style>
