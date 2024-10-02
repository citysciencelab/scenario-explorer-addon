<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import Multiselect from "vue-multiselect";
import SectionHeader from "../SectionHeader.vue";
import LoadingMask from "../LoadingMask.vue";

export default {
    name: "JobList",
    components: {
        LoadingMask,
        Multiselect,
        SectionHeader
    },
    data () {
        return {
            options: [
                { name: "accepted", code: "accepted" },
                { name: "running", code: "running" },
                { name: "successful", code: "successful" },
                { name: "failed", code: "failed" },
                { name: "dismissed", code: "dismissed" }
            ],
            selectedStatus: [],
            searchString: ""
        }
    },
    computed: {
        ...mapGetters("Modules/SimulationTool", [
            "jobs",
            "jobsLoading"
        ]),
        filteredJobs: {
            get() {
                let filteredJobs = this.jobs;
                if (this.selectedStatus.length) {
                    filteredJobs = filteredJobs.filter(job => {
                        return this.selectedStatus.some(status =>
                            job.status === status.code
                        );
                    });
                }
                if (this.searchString) {
                    filteredJobs = filteredJobs.filter(job => {
                        return Object.values(job)
                            .join()
                            .toLowerCase()
                            .includes(this.searchString.toLowerCase());
                    });
                }
                return filteredJobs;
            },
            set(newJobs) {
                this.filteredJobs = newJobs;
            }
        }
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", [
            "setMode",
            "setSelectedJobId",
            "setSelectedProcessId",
            "setSelectedEnsembleId"
        ]),
        ...mapActions("Modules/SimulationTool", [
            "fetchJobs"
        ]),
        clearSearch() {
            this.searchString = '';
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
        getEnsembleName(job) {
            return job.ensemble_name || job.ensemble_id;
        },
        onEnsembleClick(job) {
            this.setSelectedEnsembleId(job.ensemble_id);
            this.setMode("ensemble-details");
        },
    },
};
</script>

<template>
    <div class="job-list">
        <SectionHeader :title="$t('additional:modules.tools.simulationTool.scenarios')" icon="bi-box-fill">
            <template #actions>
                <button
                    class="btn btn-primary"
                    @click="() => {
                        this.setMode('job-execution')
                        this.setSelectedProcessId(null)
                    }"
                >
                    <i class="bi bi-plus-lg">&nbsp;</i>
                    <span>{{ $t('additional:modules.tools.simulationTool.newScenario') }}</span>
                </button>
            </template>
        </SectionHeader>
        <div class="job-list-toolbar">
            <div class="input-group search-wrapper">
                <input
                    class="form-control"
                    :placeholder="$t('additional:modules.tools.simulationTool.search') + ' …'"
                    :aria-label="$t('additional:modules.tools.simulationTool.search')"
                    v-model="searchString"
                >
                <i
                    v-if="searchString"
                    class="bi-x-lg"
                    role="img"
                    @click="clearSearch"
                ></i>
                <i
                    v-else
                    class="bi-search"
                    role="img"
                ></i>
            </div>
            <multiselect
                v-model="selectedStatus"
                :placeholder="$t('additional:modules.tools.simulationTool.filter') + ' …'"
                :aria-label="$t('additional:modules.tools.simulationTool.filter')"
                label="name"
                track-by="code"
                :options="options"
                :multiple="true"
            >
                <template #tag="{ option, remove }">
                    <span class="multiselect__tag" :class="option.code" >
                        <span>{{ option.name }}</span>
                        <i
                            tabindex="1"
                            class="multiselect__tag-icon"
                            @click="remove(option)"
                        ></i>
                    </span>
                </template>
            </multiselect>
            <button
                class="btn btn-primary btn-sm"
                @click="this.fetchJobs"
                :title="$t('additional:modules.tools.simulationTool.refresh')"
            >
                <i class="bi-arrow-clockwise"></i>
            </button>
        </div>
        <LoadingMask
            v-if="jobsLoading"
            :label="$t('additional:modules.tools.simulationTool.loadingScenarios') + '...'"
        />
        <table v-else class="job-list-table">
            <thead>
                <tr>
                    <th>{{ $t('additional:modules.tools.simulationTool.name') }}</th>
                    <th>{{ $t('additional:modules.tools.simulationTool.model') }}</th>
                    <th>{{ $t('additional:modules.tools.simulationTool.date') }}</th>
                    <th>{{ $t('additional:modules.tools.simulationTool.status') }}</th>
                    <th>{{ $t('additional:modules.tools.simulationTool.user') }}</th>
                    <th>{{ $t('additional:modules.tools.simulationTool.ensembles') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="job in filteredJobs">
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
                    <td>
                        <div>
                            <button
                                class="btn btn-link"
                                @click="onEnsembleClick(job)"
                            >
                                {{this.getEnsembleName(job)}}
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss" scoped>
    .job-list {
        height: 100%;
        display: flex;
        flex-direction: column;

        .accepted {
            background-color: var(--bs-info);
        }
        .running {
            background-color: var(--bs-warning);
        }
        .successful {
            background-color: var(--bs-success);
        }
        .dismissed {
            background-color: var(--bs-secondary);
        }
        .failed {
            background-color: var(--bs-danger);
        }

        .job-list-toolbar {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            margin-bottom: 1rem;

            .search-wrapper {
                input.form-control {
                    border-top-right-radius: 5px !important;
                    border-bottom-right-radius: 5px !important;
                }
                i {
                    z-index: 10;
                    position: absolute;
                    right: 1em;
                    top: 50%;
                    transform: translate(0, -50%);
                }
            }

            >button {
                align-self: center;
            }
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
            }
        }
    }
</style>
