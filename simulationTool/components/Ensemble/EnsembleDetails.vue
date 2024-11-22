<script>
import { mapMutations, mapGetters } from "vuex";
import SectionHeader from "../SectionHeader.vue";
import AsyncWrapper from "../AsyncWrapper.vue";
import CommentsPanel from "../Comments/CommentsPanel.vue"
import UserDisplay from "../UserDisplay.vue";
import PopConfirm from "../PopConfirm.vue";
import SharingPanel from "../Sharing/SharingPanel.vue";
import JobSelect from "../Job/JobSelect.vue";
import Diagramm from "../Diagramm/Diagramm.vue";

export default {
    name: "EnsembleDetails",
    components: {
        JobSelect,
        AsyncWrapper,
        CommentsPanel,
        PopConfirm,
        SectionHeader,
        SharingPanel,
        UserDisplay,
        Diagramm
    },
    data() {
        return {
            ensemble: null,
            ensembleJobs: [],
            ensembleRequestState: {
                loading: false,
                error: null
            },
            ensembleJobsRequestState: {
                loading: false,
                error: null
            },
            ensembleExecutionRequestState: {
                loading: false,
                error: null
            },
            jobResultsRequestState: {
                loading: false,
                error: null
            },
            isOpen: false,
            jobSelectVisible: false,
            selectedJobs: []
        };
    },
    computed: {
        ...mapGetters("Modules/SimulationTool", [
            "selectedEnsembleId",
            "jobs",
            "jobResultData"
        ]),
        ...mapGetters("Modules/Login", [
            "accessToken",
            "loggedIn"
        ]),
        scenarios: function() {
            return this.ensemble ? this.ensemble.scenario_configs : [];
        },
        filteredJobs: {
            get() {
                if (!this.ensembleJobs || !this.jobs) {
                    return [];
                }
                const ids = this.ensembleJobs.map(j => j.jobID);
                return this.jobs.filter(j => !ids.includes(j.jobID));
            },
            set(newJobs) {
                this.filteredJobs = newJobs;
            }
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
    unmounted() {
        if (this.intervalId) {
            window.clearInterval(this.intervalId);
        }
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", [
            "setMode",
            "setSelectedProcessId",
            "setSelectedJobId",
            "setJobResultData"
        ]),
        showProcessDetails(processId) {
            this.setSelectedProcessId(processId);
            this.setMode('process-details');
        },
        showJobDetails(jobId) {
            this.setSelectedJobId(jobId);
            this.setMode('job-details');
        },
        toggleSettingDetails() {
            this.isOpen = !this.isOpen;
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
            try {
                this.ensembleRequestState.loading = true;
                const response = await fetch(`/api/ensembles/${ensembleId}`,{
                    headers: {
                        "Content-Type": "application/json",
                        ...additionalHeaders
                    }
                });
                const result = await response.json();
                if (!response.ok) {
                    this.ensembleRequestState.error = result.error_message || response.status + ': unknown errror';
                } else {
                    this.ensemble = result;
                }
            } catch (error) {
                this.ensembleRequestState.error = error;
            } finally {
                this.ensembleRequestState.loading = false;
            }
        },
        async fetchEnsembleJobs () {
            if (!this.loggedIn) return;

            try {
                if (this.intervalId) {
                    window.clearInterval(this.intervalId);
                }
                this.ensembleJobsRequestState.loading = true;
                const response = await fetch(`/api/ensembles/${this.selectedEnsembleId}/jobs`,{
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.accessToken}`
                    }
                });
                const result = await response.json();
                if (!response.ok) {
                    this.ensembleJobsRequestState.error = result.error_message || response.status + ': unknown errror';
                    if (this.intervalId) {
                        window.clearInterval(this.intervalId);
                    }
                } else {
                    const hasRunningJobs = result.some(job => job.status === 'running');
                    this.ensembleJobs = result;
                    if (hasRunningJobs) {
                        this.intervalId = window.setInterval(() => this.fetchEnsembleJobs(), 5000);
                        return;
                    }

                    this.fetchJobResults(result);
                }
            } catch (error) {
                this.ensembleJobsRequestState.error = error;
                window.clearInterval(this.intervalId);
            } finally {
                this.ensembleJobsRequestState.loading = false;
            }
        },
        async fetchJobResults(jobs) {
            try {
                const newJobData = {};
                for (const job of jobs) {
                    if (job.status === 'successful') {
                        // check if data is already in store
                        if (this.jobResultData[job.jobID]) {
                            continue;
                        }
                        this.jobResultsRequestState.loading = true;
                        const url = job?.links?.[0]?.href;
                        if (!url) {
                            return;
                        }
                        let additionalHeaders = {};
                        if (this.loggedIn) {
                            additionalHeaders = {
                                Authorization: `Bearer ${this.accessToken}`
                            };
                        }
                        const response = await fetch(url, {
                            headers: {
                                "Content-Type": "application/json",
                                ...additionalHeaders
                            }
                        });
                        const result = await response.json();
                        if (!response.ok) {
                            this.jobResultsRequestState.error = result.error_message || response.status + ': unknown errror';
                        } else {
                            newJobData[job.jobID] = result;
                        }
                    }
                }
                this.setJobResultData({
                    ...newJobData
                });
            } catch (error) {
                this.jobResultsRequestState.error = error || 'unknown error';
                if (this.intervalId) {
                    window.clearInterval(this.intervalId);
                }
            } finally {
                this.jobResultsRequestState.loading = false;
            }
        },
        async executeEnsemble() {
            let additionalHeaders = {};
            if (this.loggedIn) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.accessToken}`
                };
            }

            try {
                this.ensembleExecutionRequestState.loading = true;
                const response = await fetch(`/api/ensembles/${this.selectedEnsembleId}/execute`,{
                    headers: {
                        "Content-Type": "application/json",
                        ...additionalHeaders
                    }
                })
                const result = await response.json();
                if (!response.ok) {
                    this.ensembleExecutionRequestState.error = result.error_message || response.status + ': unknown errror';
                } else {
                    this.ensembleExecutionRequestState.error = undefined;
                    this.fetchEnsemble(this.selectedEnsembleId);
                }
            } catch (error) {
                this.ensembleExecutionRequestState.error = error;
            } finally {
                this.ensembleExecutionRequestState.loading = false;
            }
        },
        async removeJobFromEnsemble(jobId) {
            let additionalHeaders = {};
            if (this.loggedIn) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.accessToken}`
                };
            }

            try {
                this.ensembleJobsRequestState.loading = true;
                    const response = await fetch(`/api/ensembles/${this.selectedEnsembleId}/jobs/${jobId}`,{
                        method: 'DELETE',
                        headers: {
                            "Content-Type": "application/json",
                            ...additionalHeaders
                        }
                    });
                if (!response.ok) {
                    this.ensembleJobsRequestState.error = result.error_message || response.status + ': unknown errror';
                } else {
                    this.fetchEnsembleJobs();
                }
            } catch (error) {
                this.ensembleJobsRequestState.error = error;
            } finally {
                this.ensembleJobsRequestState.loading = false;
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
        },
        async addJobs() {
            const additionalHeaders = {
                Authorization: `Bearer ${this.accessToken}`
            };
            for (const job of this.selectedJobs) {
                await fetch(`/api/ensembles/${this.ensemble.id}/addjob/${job.jobID}`, {
                    headers: {
                        "Content-Type": "application/json",
                        ...additionalHeaders
                    }
                });
            }
            this.fetchEnsembleJobs();
            this.jobSelectVisible = false;
            this.selectedJobs = [];
        }
    }
};
</script>

<template>
    <div class="ensemble-details segment-wrapper">
        <SectionHeader
            :title="$t('additional:modules.tools.simulationTool.ensembleDetails')"
            icon="bi-box-fill"
        />
        <AsyncWrapper :asyncState="ensembleRequestState">
            <div v-if="this.ensemble" class="details-body segment-wrapper">
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
                <div class="models segment-wrapper">
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
                            <button @click="toggleSettingDetails" class="btn btn-link"
                                :title="$t('additional:modules.tools.simulationTool.settings')">
                                <i class="bi bi-gear"></i>
                            </button>
                        </li>
                    </ul>
                    <div v-if="isOpen" class="configuration segment-wrapper">
                        <h4>{{ $t('additional:modules.tools.simulationTool.settings') }}</h4>
                        <ul class="configuration-list">
                            <li v-for="config in ensemble.scenario_configs" :key="config.id" class="config-item">
                                <div>
                                    <strong>{{ $t('additional:modules.tools.simulationTool.scenarioAmount') }}:</strong>
                                    {{ config.sample_size }}
                                </div>
                                <div>
                                    <strong>{{ $t('additional:modules.tools.simulationTool.samplingMethod') }}:</strong>
                                    {{ config.sampling_method }}
                                </div>
                                <div>
                                    <strong>{{ $t('additional:modules.tools.simulationTool.inputParameters') }}:</strong>
                                    <ul class="parameters-list">
                                        <li v-for="(value, key) in config.parameters" :key="key" class="parameter-item">
                                            {{ key }}: {{ value }}
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <AsyncWrapper :asyncState="ensembleJobsRequestState">
                    <div class="jobs segment-wrapper">
                        <h4>
                            {{ $t('additional:modules.tools.simulationTool.includedScenarios') }}
                            <button
                                tabindex="0"
                                class="btn btn-light"
                                type="button"
                                @click="jobSelectVisible = !jobSelectVisible"
                            >
                                <i
                                    class="bi bi-search"
                                    role="img"
                                ></i>
                            </button>
                            <div class="toolbar">
                                <JobSelect
                                    v-if="this.jobSelectVisible"
                                    v-model="selectedJobs"
                                    :filteredJobs="filteredJobs"
                                />
                                    <button
                                        class="btn btn-primary"
                                        v-if="this.jobSelectVisible"
                                        @click="addJobs"
                                        >
                                        {{ $t('additional:modules.tools.simulationTool.addScenarios') }}
                                    </button>
                            </div>
                        </h4>
                        <div class="job-table-wrapper">
                            <table class="job-list-table">
                                <thead>
                                    <tr>
                                        <th>{{ $t('additional:modules.tools.simulationTool.name') }}</th>
                                        <th>{{ $t('additional:modules.tools.simulationTool.model') }}</th>
                                        <th>{{ $t('additional:modules.tools.simulationTool.date') }}</th>
                                        <th>{{ $t('additional:modules.tools.simulationTool.status') }}</th>
                                        <th>{{ $t('additional:modules.tools.simulationTool.user') }}</th>
                                        <th class="action-column"></th>
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
                                            <UserDisplay :user_id="job.user_id" />
                                        </td>
                                        <td class="action-column">
                                            <PopConfirm
                                                :onConfirm="() => this.removeJobFromEnsemble(job.jobID)"
                                                :confirmText="$t('additional:modules.tools.simulationTool.confirmDelete')"
                                            >
                                                <button
                                                    class="btn btn-link link-danger"
                                                    :title="$t('additional:modules.tools.simulationTool.removeJob')"
                                                >
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </PopConfirm>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </AsyncWrapper>
                <div class="charts">
                    <h4>{{ $t('additional:modules.tools.simulationTool.charts') }}</h4>
                    <AsyncWrapper :asyncState="jobResultsRequestState">
                        <div class="diagram-wrapper">
                            <Diagramm />
                        </div>
                    </AsyncWrapper>
                </div>
                <div class="panel-container">
                    <div class="notes">
                        <h4>{{ $t('additional:modules.tools.simulationTool.notes') }}</h4>
                        <CommentsPanel
                            endPoint="ensembles"
                            :entityId="ensemble.id?.toString()"
                        />
                    </div>
                    <div class="sharing">
                        <h4>{{ $t('additional:modules.tools.simulationTool.sharing') }}</h4>
                        <SharingPanel
                            endPoint="ensembles"
                            :entityId="ensemble.id?.toString()"
                        />
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
                <AsyncWrapper :asyncState="ensembleExecutionRequestState" class="execution-feedback"/>
            </div>
        </AsyncWrapper>
    </div>
</template>

<style lang="scss" scoped>
    .ensemble-details {
        height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        overflow: auto;
        width: 100%;
        box-sizing: border-box;
    }

    .details-body {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow-y: auto;
        flex: 1 1 auto;
    }

    .details-header {
        margin-bottom: 1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-height: 4rem;
        flex-shrink: 0;
    }

    .models,
    .jobs,
    .job-table-wrapper {
        overflow-y: auto;
        flex: 1 1 auto;
    }

    .models {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-height: 300px;
        min-height: 50px;
        flex-shrink: 0;
    }

    .jobs {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-height: 200px;
        max-height: 300px;
        flex-shrink: 0;
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

            &.action-column {
                width: 40px;
                padding: 0;
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

        .status {
            display: inline-block;
            padding: .25rem .5rem;
            border-radius: .5rem;
            font-size: .875rem;
            font-weight: 500;
            color: white;
        }
    }

    .charts {
        padding-bottom: 1rem;
    }

    .panel-container {
        display: flex;
        gap: 1rem;
        flex: 1 1 50%;
        align-items: stretch;
        height: 200px;
    }

    .notes, .sharing {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        flex-shrink: 0;
    }

    .toolbar {
        display: flex;
        justify-content: flex-end;
        margin-top: 1rem;
        flex-direction: column;

        button {
            margin: 10px;
            align-self: end;
        }
    }

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

    h3, h4 {
        margin: 0;
    }
</style>
