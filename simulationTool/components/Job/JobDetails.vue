<script>
import { mapMutations, mapGetters } from "vuex";
import SectionHeader from "../SectionHeader.vue";
import Diagramm from "../Diagramm/Diagramm.vue";
import AsyncWrapper from "../AsyncWrapper.vue";
import CommentsPanel from "../Comments/CommentsPanel.vue"

export default {
    name: "JobDetails",
    components: {
        CommentsPanel,
        SectionHeader,
        AsyncWrapper,
        Diagramm
    },
    data() {
        return {
            job: null,
            jobRequestState: {
                loading: false,
                error: null
            },
            resultRequestState: {
                loading: false,
                error: null
            }
        };
    },
    computed: {
        ...mapGetters("Modules/SimulationTool", ["selectedJobId"]),
        ...mapGetters("Modules/Login", ["accessToken", "loggedIn"])
    },
    mounted() {
        this.fetchJob(this.selectedJobId);
    },
    watch: {
        job: 'fetchJobResultData'
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", ["setMode", "setJobResultData"]),
        async fetchJob(jobId) {
            let additionalHeaders = {};
            if (this.loggedIn) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.accessToken}`
                };
            }

            try {
                this.jobRequestState.loading = true;
                const response = await fetch(`/api/jobs/${jobId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        ...additionalHeaders
                    }
                })
                const result = await response.json();
                if (!response.ok) {
                    this.jobRequestState.error = result.error_message || response.status + ': unknown errror';
                } else {
                    this.job = result;
                }
            } catch (error) {
                this.jobRequestState.error = error || 'unknown error';
            } finally {
                this.jobRequestState.loading = false;
            }

        },
        async fetchJobResultData() {
            const url = this.job?.links?.[0]?.href;
            if (!url) {
                return;
            }
            let additionalHeaders = {};
            if (this.loggedIn) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.accessToken}`
                };
            }

            try {
                this.resultRequestState.loading = true;
                const response = await fetch(url, {
                    headers: {
                        "Content-Type": "application/json",
                        ...additionalHeaders
                    }
                });
                const result = await response.json();
                if (!response.ok) {
                    this.resultRequestState.error = result.error_message || response.status + ': unknown errror';
                } else {
                    this.setJobResultData(result);
                }
            } catch (error) {
                this.resultRequestState.error = error || 'unknown error';
            } finally {
                this.resultRequestState.loading = false;
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
    }
};
</script>

<template>
    <div class="job-details">
        <SectionHeader
            :title="$t('additional:modules.tools.simulationTool.scenarioDetails')"
            icon="bi-box-fill"
        />
        <AsyncWrapper :asyncState="jobRequestState">
            <div v-if="job" class="details-body">
                <div class="details-header">
                    <h3 :title="job?.jobID">{{ job?.process_title }} -> {{ job?.name }}</h3>
                    <div>
                        <strong>
                            {{ $t('additional:modules.tools.simulationTool.started') }}:
                        </strong>
                        {{ this.formatDateTime(job?.started) }}
                    </div>
                    <div>
                        <strong>
                            {{ $t('additional:modules.tools.simulationTool.completed') }}:
                        </strong>
                        {{ this.formatDateTime(job?.finished) }}
                    </div>
                    <div class="status" :class="job?.status">
                        {{ job?.status }}
                    </div>
                </div>

                <div class="links">
                    <h4>{{ $t('additional:modules.tools.simulationTool.links') }}</h4>
                    <ul>
                        <li v-for="(link, index) in job?.links" :key="link.rel">
                            <i class="bi bi-link"></i>
                            <a :href="link.href" target="_blank">{{link.title}}</a>
                        </li>
                    </ul>
                </div>
                <div class="parameter">
                    <h4>{{ $t('additional:modules.tools.simulationTool.parameters') }}</h4>
                    <ul>
                        <li v-for="(value, key) in job?.parameters.inputs" :key="key">
                            <strong>{{key}}</strong>: {{value}}
                        </li>
                    </ul>
                </div>
                <div class="filter">
                    <h4>{{ $t('additional:modules.tools.simulationTool.filter') }}</h4>
                </div>

                <div class="charts">
                    <h4>{{ $t('additional:modules.tools.simulationTool.charts') }}</h4>
                    <AsyncWrapper :asyncState="resultRequestState">
                        <div class="diagram-wrapper">
                            <Diagramm />
                        </div>
                    </AsyncWrapper>
                </div>

                <div class="notes">
                    <h4>{{ $t('additional:modules.tools.simulationTool.notes') }}</h4>
                    <CommentsPanel
                        endPoint="jobs"
                        :entityId="job.jobID"
                    />
                </div>
            </div>
        </AsyncWrapper>
    </div>
</template>

<style lang="scss" scoped>
.job-details {
    max-height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    overflow: hidden;

        .details-body {
            overflow: hidden;
            display: grid;
            gap: 1rem;
            grid-template-areas:
                "header header"
                "links links"
                "parameter filter"
                "charts notes";
            grid-template-columns: 1fr 1fr;

        ul {
            list-style: none;
            padding-left: 0.5rem;

            li {
                margin-bottom: 0.5rem;

                i {
                    margin-right: 0.25rem;
                }
            }

            div.status {
                display: inline-block;
                padding: .25rem .5rem;
                border-radius: .5rem;
                font-size: .875rem;
                font-weight: 500;
                color: white;
            }

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
        }

        .links {
            overflow: hidden;
            grid-area: links;
        }

        .header {
            grid-area: header;
            overflow: hidden;
        }

        .parameter {
            grid-area: parameter;
            overflow: hidden;
        }

        .filter {
            grid-area: filter;
            overflow: hidden;
        }

        .charts {
            grid-area: charts;
            overflow: hidden;
        }

        .notes {
            grid-area: notes;
            overflow: hidden;
            display: inherit;
        }

        .diagram-wrapper {
            border: 1px solid #ccc;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            padding: 20px;
        }
    }
}
</style>
