<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import Multiselect from "vue-multiselect";
import SectionHeader from "../SectionHeader.vue";
import LoadingMask from "../LoadingMask.vue";
import UserDisplay from "../UserDisplay.vue";

export default {
    name: "JobList",
    components: {
        UserDisplay,
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
        ...mapGetters("Modules/Login", [
            "loggedIn"
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
                if (!this.loggedIn) {
                    const jobs = localStorage.getItem('jobs');
                    if (!jobs) {
                        return [];
                    }
                    let ids = jobs.split(',');
                    const otherIds = filteredJobs.map(job => job.jobID);
                    filteredJobs = filteredJobs.filter(job => {
                        return ids.includes(job.jobID);
                    });
                    ids = ids.filter(id => otherIds.includes(id));
                    localStorage.setItem('jobs', ids);
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
        onEnsembleClick(ensembleId) {
            this.setSelectedEnsembleId(ensembleId);
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
                :options="this.options"
                :multiple="true"
                :open="true"
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
                <template #option="p">
                    <div class="option__desc">
                        <span class="option__title" :class="p.option.name">
                            {{ p.option.name }}
                        </span>
                    </div>
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
        <div v-else class="table-wrapper">
            <table class="job-list-table">
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
                            <button
                                class="btn btn-link"
                                @click="onJobClick(job)"
                            >
                                {{this.getJobName(job)}}
                            </button>
                        </td>
                        <td>
                            {{this.getModelName(job)}}
                        </td>
                        <td>
                            {{this.formatDateTime(job.started)}}
                        </td>
                        <td>
                            <div class="status" :class="job.status">
                                {{job.status}}
                            </div>
                        </td>
                        <td>
                            <UserDisplay :user_id="job.user_id" />
                        </td>
                        <td>
                            <button
                                v-for="ensemble in job.ensembles"
                                class="btn btn-link"
                                @click="onEnsembleClick(ensemble.id)"
                            >
                                {{ensemble.name}}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .job-list {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .table-wrapper {
            flex: 1;
            overflow: auto;
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

            td > div:not(.status) {
                white-space: normal;
                display: -webkit-box;
                line-clamp: 2;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-word;
            }
        }
    }
</style>
