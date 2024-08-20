<script>
import SimulationPagination from "./SimulationPagination.vue";

export default {
    name: "SimulationProcessJobsTable",
    components: {SimulationPagination},
    props: {
        "process": {
            type: Object,
            required: true
        },
        "jobs": {
            type: Array,
            required: true
        },
        "loadingJobs": {
            type: Boolean,
            required: true
        }
    },
    emits: ["selected"],
    data () {
        return {
            jobsPerPage: 6,
            currentJobsPageIndex: 0,
            expandedParameterJobIds: []
        };
    },
    computed: {
        numberOfJobsPages () {
            return Math.ceil((this.jobs?.length || 0) / this.jobsPerPage);
        },
        currentPageJobs () {
            const start = this.currentJobsPageIndex * this.jobsPerPage,
                end = start + this.jobsPerPage;

            return (this.jobs || []).slice(start, end);
        }
    },
    methods: {
        displayParameters (parameters) {
            const params = {...parameters};

            delete params.mode;

            const entries = Object.entries(params).map(([key, value]) => [
                this.process.inputs[key].title,
                value
            ]);

            return Object.fromEntries(entries);
        },
        areParametersExpanded (jobId) {
            return Boolean(this.expandedParameterJobIds.includes(jobId));
        },
        toggleExpandParameters (jobId) {
            if (this.areParametersExpanded(jobId)) {
                this.expandedParameterJobIds =
                    this.expandedParameterJobIds.filter((id) => id !== jobId);
            }
            else {
                this.expandedParameterJobIds.push(jobId);
            }
        },
        getFormattedParameterValue (value) {
            return Array.isArray(value) ? value.join(", ") : value;
        }
    }
};
</script>

<template v-if="process">
    <section>
        <h4>Jobs</h4>
        <div
            v-if="jobs?.length"
            class="job-grid"
        >
            <div class="grid-header">
                {{ $t("additional:modules.tools.simulationTool.job") }}
            </div>
            <div class="grid-header">
                {{ $t("additional:modules.tools.simulationTool.status") }}
            </div>
            <div class="grid-header">
                {{ $t("additional:modules.tools.simulationTool.parameters") }}
            </div>
            <div class="grid-header">
                {{ $t("additional:modules.tools.simulationTool.result") }}
            </div>

            <template
                v-for="job in currentPageJobs"
                :key="job.jobID"
            >
                <div class="job-date">
                    {{
                        job.parameters.inputs.name ||
                            new Date(job.started).toLocaleString()
                    }}
                </div>
                <div>
                    <span
                        :title="job.status === 'failed' ? job.message : ''"
                        :class="{
                            status: true,
                            'text-bg-info':
                                job.status !== 'successful' &&
                                job.status !== 'failed',
                            'text-bg-success': job.status === 'successful',
                            'text-bg-danger': job.status === 'failed',
                        }"
                    >
                        {{ job.status }}
                    </span>
                </div>
                <div class="job-parameter-button">
                    <button
                        class="btn btn-secondary btn-sm"
                        @click="toggleExpandParameters(job.jobID)"
                    >
                        {{
                            areParametersExpanded(job.jobID)
                                ? $t(
                                    "additional:modules.tools.simulationTool.hide"
                                )
                                : $t(
                                    "additional:modules.tools.simulationTool.show"
                                )
                        }}
                    </button>
                </div>
                <div>
                    <span
                        v-if="job.status === 'failed'"
                        class="text-danger"
                    >
                        n/a
                    </span>
                    <a
                        v-if="job.status === 'successful'"
                        href="#"
                        @click="$emit('selected', job.jobID)"
                    >
                        {{ $t("additional:modules.tools.simulationTool.show") }}
                    </a>
                </div>

                <div
                    v-if="areParametersExpanded(job.jobID)"
                    class="job-parameter"
                >
                    <table>
                        <tr
                            v-for="(value, key) in displayParameters(job.parameters.inputs)"
                            :key="key"
                        >
                            <th>{{ key }}:{{ " " }}</th>
                            <td>
                                {{ getFormattedParameterValue(value) }}
                            </td>
                        </tr>
                    </table>
                </div>
            </template>
        </div>
        <div class="jobs-table-footer">
            <SimulationPagination
                v-if="jobs?.length > jobsPerPage"
                :items-per-page="jobsPerPage"
                :current-page-index="currentJobsPageIndex"
                :number-of-pages="numberOfJobsPages"
                @pageChange="currentJobsPageIndex = $event"
            />

            <div
                v-if="jobs?.length && loadingJobs"
                class="loader text-black-50"
            >
                <span class="spinner-border spinner-border-sm" />{{ $t("additional:modules.tools.simulationTool.loading") }}:
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.time {
    white-space: nowrap;
}

.status {
    padding: 0.1em 0.5em;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.jobs-table-footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1em;
}

.pagination {
    margin: 0;
}

.loader {
    display: flex;
    align-items: center;
    column-gap: 0.5em;
    white-space: nowrap;
}

.job-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 1em;

    .grid-header {
        white-space: nowrap;
        color: #666;
        font-weight: bold;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .job-date {
        white-space: nowrap;
    }

    .job-parameter-button button {
        padding: 0.1em 0.5em;
        min-width: 4em;
    }

    .job-parameter {
        grid-column: 1 / -1;
        padding-left: 1em;
        border-left: 4px solid rgba(0, 0, 0, 0.1);

        table {
            line-height: 1.4;
        }

        td {
            padding-left: 1em;
        }
    }
}
</style>
