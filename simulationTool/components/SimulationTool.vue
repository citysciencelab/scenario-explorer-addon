<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import SimulationProcesses from "./SimulationProcesses.vue";
import SimulationProcess from "./SimulationProcess.vue";
import SimulationProcessJob from "./SimulationProcessJob.vue";
import actions from "../store/actions";
import getters from "../store/getters";
import mutations from "../store/mutations";

export default {
    name: "SimulationTool",
    components: {
        SimulationProcesses,
        SimulationProcess,
        SimulationProcessJob
    },
    computed: {
        ...mapGetters("Modules/SimulationTool", Object.keys(getters))
    },
    mounted: async function () {
        await this.checkLoggedIn();
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
    <div id="template">
        <div id="tool-simulationTool">
            <SimulationProcesses
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
    </div>
</template>

<style lang="scss" scoped>
    #tool-simulationTool {
        background: white;
    }
</style>
