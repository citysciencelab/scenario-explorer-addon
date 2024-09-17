<script>
import SimulationProcessJobsTable from "./SimulationProcessJobsTable.vue";
import SimulationProcessJobExecution from "./SimulationProcessJobExecution.vue";
import Config from "../../../portal/simulation/config";

export default {
    name: "SimulationProcess",
    components: {SimulationProcessJobsTable, SimulationProcessJobExecution},
    props: {
        "processId": {
            type: String,
            required: true
        }
    },
    emits: ["selected"],
    data () {
        return {
            process: null,
            jobs: [],
            loadingJobs: false
        };
    },
    computed: {
        inputsConfig () {
            return this.process?.inputs || {};
        }
    },
    mounted () {
        this.fetchProcess(this.processId);
        this.fetchJobs(this.processId);
    },
    methods: {
        /**
         * Fetches a process from the simulation backend
         * @param {String} processId
         */
        async fetchProcess (processId) {
            let additionalHeaders = {};
            if (this.$store.getters["Modules/Login/loggedIn"]) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.$store.getters["Modules/Login/accessToken"]}`
                };
            }

            this.process = await fetch(`/api/processes/${processId}`,{
                headers: {
                    "Content-Type": "application/json",
                    ...additionalHeaders
                }
            }).then((res) => res.json());
        },
        /**
         * Fetches the job list from the simulation backend
         * @param {String} processId
         */
        async fetchJobs (processId) {
            this.loadingJobs = true;

            let additionalHeaders = {};
            if (this.$store.getters["Modules/Login/loggedIn"]) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.$store.getters["Modules/Login/accessToken"]}`
                };
            }

            this.jobs = await fetch(`/api/jobs/?processID=${processId}`, {
                headers: {
                    "Content-Type": "application/json",
                    ...additionalHeaders
                }
            })
                .then((res) => res.json())
                .then((json) => json.jobs);

            this.loadingJobs = false;

            // update jobs list if there are jobs running
            if (
                this.jobs.some((job) => ["accepted", "running"].includes(job.status)
                )
            ) {
                setTimeout(() => this.fetchJobs(processId), 5000);
            }
        }
    }
};
</script>

<template>
    <div>
        <div class="process-details">
            <div
                :class="{
                    'process-header': true,
                    'placeholder-glow': !process,
                }"
            >
                <a
                    class="bootstrap-icon"
                    href="#"
                    title="Back"
                    @click="$emit('close')"
                >
                    <i class="bi-chevron-left" />
                    <span class="sr-only">Back</span>
                </a>

                <h3
                    :class="{ placeholder: !process }"
                    :aria-hidden="!process"
                >
                    {{
                        process?.title ||
                            $t("additional:modules.tools.simulationTool.loading")
                    }}
                </h3>
            </div>

            <p v-if="process">
                {{ process.description }}
            </p>
            <p
                v-else
                class="placeholder-glow"
                aria-hidden
            >
                <span class="placeholder col-3" />
                <span class="placeholder col-4" />
                <span class="placeholder col-4" />
                <span class="placeholder col-6" />
                <span class="placeholder col-3" />
            </p>
        </div>

        <div
            v-if="process"
            class="process-content"
        >
            <SimulationProcessJobsTable
                :process="process"
                :jobs="jobs"
                :loading-jobs="loadingJobs"
                @selected="($event) => $emit('selected', $event)"
            />

            <SimulationProcessJobExecution
                :process-id="processId"
                :inputs-config="inputsConfig"
                @executed="fetchJobs(processId)"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.process-details {
    position: sticky;
    top: -1.25rem;
    margin: -1.25rem -1.25rem 2rem;
    padding: 1.25rem 1.25rem 0;
    background: white;
}

.process-details::after {
    content: "";
    display: block;
    // border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}

.process-header {
    display: flex;
    align-items: center;
    column-gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.process-header > * {
    margin: 0;
}

.process-content {
    display: grid;
    gap: 2rem;
}
</style>
