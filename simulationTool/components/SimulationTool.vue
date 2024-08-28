<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import SimulationProcessList from "./SimulationProcessList/SimulationProcessList.vue";
import SimulationProcess from "./SimulationProcess.vue";
import SimulationProcessJob from "./SimulationProcessJob.vue";
import actions from "../store/actions";
import getters from "../store/getters";
import mutations from "../store/mutations";

// Minimum width for two cards side by side
const MIN_WIDTH = 560;

export default {
    name: "SimulationTool",
    components: {
        SimulationProcessList,
        SimulationProcess,
        SimulationProcessJob
    },
    computed: {
        ...mapGetters("Modules/SimulationTool", Object.keys(getters))
    },
    mounted: async function () {
        await this.checkLoggedIn();
        if (window.innerWidth / 4 < MIN_WIDTH) {
            this.setCurrentMenuWidth({
                side: "secondaryMenu",
                width: MIN_WIDTH + "px"
            });
        }
        this.fetchProcesses();
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
        /**
         * Selects a process by id
         * @returns {void}
         */
        selectProcess (id) {
            if (typeof id === "string") {
                this.setSelectedProcessId(id);
                this.setMode("process");
            }
            else {
                this.setSelectedProcessId(null);
                this.setMode("processes");
            }
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
                this.setMode("processes");
            }
        }
    }
};
</script>

<template>
    <div id="tool-simulationTool">
        <SimulationProcessList
            v-if="mode === 'processes'"
            :processes="processes"
            @selected="selectProcess"
        />

        <SimulationProcess
            v-if="mode === 'process'"
            :process-id="selectedProcessId"
            @selected="selectJob"
            @close="selectProcess"
        />

        <SimulationProcessJob
            v-if="mode === 'job'"
            :job-id="selectedJobId"
            :process-id="selectedProcessId"
            @close="selectJob"
        />
    </div>
</template>

<style lang="scss" scoped>
    #tool-simulationTool {
        overflow: hidden;
    }
</style>
