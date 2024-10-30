<script>
import {mapGetters, mapActions, mapMutations} from "vuex";

import actions from "../store/actions";
import getters from "../store/getters";
import mutations from "../store/mutations";

import EnsembleDetails from "./Ensemble/EnsembleDetails.vue";
import EnsembleCreation from "./Ensemble/EnsembleCreation.vue";
import EnsembleList from "./Ensemble/EnsembleList.vue";
import HomePanel from "./HomePanel.vue";
import JobDetails from "./Job/JobDetails.vue";
import JobExecution from "./Job/JobExecution.vue";
import JobList from "./Job/JobList.vue";
import ProcessDetails from "./Process/ProcessDetails.vue";
import ProcessList from "./Process/ProcessList.vue";
import SideMenu from "./SideMenu.vue";
import TutorialPanel from "./HelpSection/TutorialPanel.vue";
import HelpPanel from "./HelpSection/HelpPanel.vue";

const MIN_WIDTH = 900;

export default {
    name: "SimulationTool",
    components: {
        EnsembleDetails,
        EnsembleCreation,
        EnsembleList,
        HomePanel,
        HelpPanel,
        JobDetails,
        JobExecution,
        JobList,
        ProcessDetails,
        ProcessList,
        SideMenu,
        TutorialPanel
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
            />
            <HomePanel
                v-if="mode === 'home-panel'"
                @selected="selectProcess"
            />
            <HelpPanel
                v-if="mode === 'help-panel'"
            />
            <JobList
                v-if="mode === 'job-list'"
                :jobs="jobs"
            />
            <JobExecution
                v-if="mode === 'job-execution'"
            />
            <JobDetails
                v-if="mode === 'job-details'"
            />
            <EnsembleList
                v-if="mode === 'ensemble-list'"
                :ensembles="ensembles"
            />
            <EnsembleCreation
                v-if="mode === 'ensemble-creation'"
            />
            <EnsembleDetails
                v-if="mode === 'ensemble-details'"
            />
            <TutorialPanel
                v-if="mode === 'tutorial-panel'"
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

    .status {
        display: inline-block;
        padding: .25rem .5rem;
        border-radius: .5rem;
        font-size: .875rem;
        font-weight: 500;
    }

    .accepted {
        background-color: var(--bs-info);
        color: black;
    }
    .running {
        background-color: var(--bs-warning);
        color: black;
    }
    .successful {
        background-color: var(--bs-success);
        color: white;
    }
    .dismissed {
        background-color: var(--bs-secondary);
        color: white;
    }
    .failed {
        background-color: var(--bs-danger);
        color: white;
    }
</style>
