<script>
import { mapMutations, mapGetters } from "vuex";
import SectionHeader from "../SectionHeader.vue";

export default {
    name: "EnsembleDetails",
    components: {
        SectionHeader
    },
    data() {
        return {
            ensemble: null,
            ensembleJobs: [],
            executionResult: null
        };
    },
    computed: {
        ...mapGetters("Modules/SimulationTool", [
            "selectedEnsembleId"
        ]),
        ...mapGetters("Modules/Login", [
            "accessToken",
            "loggedIn"
        ]),
        scenarios: function() {
            return this.ensemble ? this.ensemble.scenario_configs : [];
        }
    },
    watch: {
        ensemble: function() {
            if (this.ensemble) {
                this.fetchEnsembleJobs();
            }
        }
    },
    mounted() {
        this.fetchEnsemble(this.selectedEnsembleId);
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", [
            "setMode",
            "setSelectedProcessId",
            "setSelectedJobId"
        ]),
        showProcessDetails(processId) {
            this.setSelectedProcessId(processId);
            this.setMode('process-details');
        },
        showJobDetails(jobId) {
            this.setSelectedJobId(jobId);
            this.setMode('job-details');
        },
        /**
         * Fetches a ensemble from the simulation backend
         * @param {String} ensembleId
         */
        async fetchEnsemble (ensembleId) {
            let additionalHeaders = {};
            if (this.loggedIn) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.accessToken}`
                };
            }
            this.ensemble = await fetch(`/api/ensembles/${ensembleId}`,{
                headers: {
                    "Content-Type": "application/json",
                    ...additionalHeaders
                }
            }).then((res) => res.json());
        },
        async fetchEnsembleJobs () {
            let additionalHeaders = {};
            if (this.loggedIn) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.accessToken}`
                };
            }
            this.ensembleJobs = await fetch(`/api/ensembles/${this.selectedEnsembleId}/jobs`,{
                headers: {
                    "Content-Type": "application/json",
                    ...additionalHeaders
                }
            }).then((res) => res.json());
        },
        async executeEnsemble() {
            let additionalHeaders = {};
            if (this.loggedIn) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.accessToken}`
                };
            }
            const response = await fetch(`/api/ensembles/${this.selectedEnsembleId}/execute`,{
                headers: {
                    "Content-Type": "application/json",
                    ...additionalHeaders
                }
            })
            if (response.ok) {
                this.executionResult = await response.json();
                this.fetchEnsemble(this.selectedEnsembleId);
            }
        },
        formatDateTime(dateTime) {
            return new Date(dateTime).toLocaleString({
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });
        },
        getJobName(job) {
            return job.name || job.jobID;
        },
        getModelName(job) {
            return job.process_title || job.processID;
        },
        onJobClick(job) {
            this.setSelectedJobId(job.jobID);
            this.setMode("job-details");
        }
    }
};
</script>

<template>
    <div class="ensemble-details">
        <SectionHeader
            :title="$t('additional:modules.tools.simulationTool.ensembleDetails')"
            icon="bi-box-fill"
        />
        <div v-if="this.ensemble" class="details-body">
            <div class="details-header">
                <h3 :title="ensemble.id">{{ ensemble.name }}</h3>
                <div>
                    <strong>
                        {{ $t('additional:modules.tools.simulationTool.created') }}:
                    </strong>
                    {{ this.formatDateTime(ensemble.created) }}
                </div>
                <div class="status" :class="ensemble.status">
                    {{ensemble.description}}
                </div>
            </div>
            <div class="models">
                <h4>{{ $t('additional:modules.tools.simulationTool.includedModels') }}</h4>
                <ul class="scenario-list">
                    <li v-for="scenario in scenarios" :key="scenario.id">
                        <strong>{{scenario.process_id}}</strong>
                        <button
                            class="btn btn-link"
                            @click="this.showProcessDetails(scenario.process_id)"
                            :title="$t('additional:modules.tools.simulationTool.modelDetails')"
                        >
                            <i class="bi bi-box-arrow-up-right"></i>
                        </button>
                    </li>
                </ul>
            </div>
            <div class="jobs">
                <h4>{{ $t('additional:modules.tools.simulationTool.includedScenarios') }}</h4>
                <div class="job-table-wrapper">
                    <table class="job-list-table">
                        <thead>
                            <tr>
                                <th>{{ $t('additional:modules.tools.simulationTool.name') }}</th>
                                <th>{{ $t('additional:modules.tools.simulationTool.model') }}</th>
                                <th>{{ $t('additional:modules.tools.simulationTool.date') }}</th>
                                <th>{{ $t('additional:modules.tools.simulationTool.status') }}</th>
                                <th>{{ $t('additional:modules.tools.simulationTool.user') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="job in ensembleJobs">
                                <td>
                                    <div>
                                        <button
                                            class="btn btn-link"
                                            @click="onJobClick(job)"
                                        >
                                            {{this.getJobName(job)}}
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        {{this.getModelName(job)}}
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        {{this.formatDateTime(job.started)}}
                                    </div>
                                </td>
                                <td>
                                    <div class="status" :class="job.status">
                                        {{job.status}}
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        {{job.user}}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="toolbar">
                <button
                    class="btn btn-primary"
                    @click="executeEnsemble"
                >
                    {{ $t('additional:modules.tools.simulationTool.executeEnsemble') }}
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .ensemble-details {
        max-height: 100%;
        display: flex;
        flex-direction: column;
        padding: 1rem;

        .details-body {
            display: grid;
            gap: 1rem;
            grid-template-areas:
                "header header"
                "models models"
                "jobs jobs"
                "graphs notes"
                "toolbar toolbar";
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto auto auto auto;
            overflow: hidden;

            ul {
                list-style: none;
                padding-left: .5rem;

                li {
                    margin-bottom: .5rem;

                    i {
                        margin-right: .25rem;
                    }
                }
            }

            .job-table-wrapper {
                overflow: auto;
                max-height: 100%;
            }

            .job-list-table {
                width: 100%;
                table-layout: fixed;
                border-collapse: collapse;

                th, td {
                    padding: .5rem;
                    text-align: left;
                    overflow: hidden;
                    text-overflow: ellipsis;

                    &:not(:last-child) {
                        border-right: 2px solid var(--bs-default);
                    }
                }

                th {
                    white-space: nowrap;
                }

                td > div {
                    white-space: normal;
                    display: -webkit-box;
                    line-clamp: 2;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-word;
                }

                div.status {
                    display: inline-block;
                    padding: .25rem .5rem;
                    border-radius: .5rem;
                    font-size: .875rem;
                    font-weight: 500;
                    color: white;

                    &.accepted {
                        background-color: var(--bs-info);
                    }
                    &.running {
                        background-color: var(--bs-warning);
                    }
                    &.successful {
                        background-color: var(--bs-success);
                    }
                    &.dismissed {
                        background-color: var(--bs-secondary);
                    }
                    &.failed {
                        background-color: var(--bs-danger);
                    }
                }
            }

            .details-header {
                grid-area: header;
            }

            .models {
                overflow: hidden;
                grid-area: models;
            }

            .jobs {
                overflow: hidden;
                grid-area: jobs;
            }

            .graphs {
                grid-area: graphs;
            }

            .notes {
                grid-area: notes;
            }

            .toolbar {
                grid-area: toolbar;
                display: flex;
                justify-content: flex-end;
            }
        }

    }
</style>
