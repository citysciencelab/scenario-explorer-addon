<script>
import Multiselect from "vue-multiselect";

export default {
    name: "SimulationJobList",
    components: {
        Multiselect
    },
    props: {
        "jobs": {
            type: Array,
            required: true,
            default: []
        }
    },
    data () {
        return {
            options: [
                { name: "running", code: "running" },
                { name: "successful", code: "successful" },
                { name: "failed", code: "failed" }
            ],
            selectedStatus: [],
            searchString: ""
        }
    },
    computed: {
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
        clearSearch() {
            this.searchString = '';
        }
    },
};
</script>

<template>
    <div class="job-list">
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
            />
        </div>
        <table class="job-list-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Modell</th>
                    <th>Datum</th>
                    <th>Status</th>
                    <th>User</th>
                    <th>Ensembles</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="job in filteredJobs">
                    <td><div>{{job.jobID}}</div></td>
                    <td><div>{{job.processID}}</div></td>
                    <td><div>{{job.started}}</div></td>
                    <td><div>{{job.status}}</div></td>
                    <td><div>{{job.user}}</div></td>
                    <td><div>{{job.ensembles}}</div></td>
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
                max-height: 2em;
                word-break: break-word;
            }
        }
    }
</style>
