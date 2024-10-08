<script>
import {mapGetters, mapActions, mapMutations} from "vuex";

import actions from "../store/actions";
import getters from "../store/getters";
import mutations from "../store/mutations";

import EnsembleDetails from "./Ensemble/EnsembleDetails.vue";
import EnsembleCreation from "./Ensemble/EnsembleCreation.vue";
import EnsembleList from "./Ensemble/EnsembleList.vue";
import JobDetails from "./Job/JobDetails.vue";
import JobExecution from "./Job/JobExecution.vue";
import JobList from "./Job/JobList.vue";
import ProcessDetails from "./Process/ProcessDetails.vue";
import ProcessList from "./Process/ProcessList.vue";
import SideMenu from "./SideMenu.vue";

const MIN_WIDTH = 900;

export default {
    name: "SimulationTool",
    components: {
        EnsembleDetails,
        EnsembleCreation,
        EnsembleList,
        JobDetails,
        JobExecution,
        JobList,
        ProcessDetails,
        ProcessList,
        SideMenu
    },
    computed: {
        ...mapGetters("Modules/SimulationTool", Object.keys(getters))
    },
    mounted: async function () {
        await this.checkLoggedIn();
        this.maximizeDrawer();
        this.fetchProcesses();
        this.fetchJobs();
        this.fetchEnsembles();
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
        },
        navigate(evt) {
            const kensemblesey = evt.target.dataset.key;
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
                @selected="selectProcess"
            />
            <ProcessDetails
                v-if="mode === 'process-details'"
                @selected="selectProcess"
                @close="() => setMode('process-list')"
            />
            <JobList
                v-if="mode === 'job-list'"
                @close="() => setMode('process-list')"
            />
            <JobExecution
                v-if="mode === 'job-execution'"
                @close="() => setMode('job-list')"
            />
            <JobDetails
                v-if="mode === 'job-details'"
                @close="() => setMode('job-list')"
            />
            <EnsembleList
                v-if="mode === 'ensemble-list'"
                @close="() => setMode('process-list')"
            />
            <EnsembleCreation
                v-if="mode === 'ensemble-creation'"
                @close="() => setMode('ensemble-list')"
            />
            <EnsembleDetails
                v-if="mode === 'ensemble-details'"
                @close="() => setMode('ensemble-list')"
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

<style lang="scss">
    .multiselect__option {
        background-color: unset;

        .option__desc .option__title {
            padding: .25rem .5rem;
            border-radius: .5rem;
        }
    }

    .multiselect__option--highlight,
    .multiselect__option--highlight:after {
        background-color: var(--bs-primary);
        color: var(--bs-primary-text-emphasis);
    }

    .multiselect__tag-icon::after {
        color: unset;
    }
</style>
