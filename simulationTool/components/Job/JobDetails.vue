<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import SectionHeader from "../SectionHeader.vue";
import Diagramm from "../Diagramm/Diagramm.vue";
import AsyncWrapper from "../AsyncWrapper.vue";
import CommentsPanel from "../Comments/CommentsPanel.vue"
import SharingPanel from "../Sharing/SharingPanel.vue"

export default {
    name: "JobDetails",
    components: {
        CommentsPanel,
        SectionHeader,
        AsyncWrapper,
        Diagramm,
        SharingPanel
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
        ...mapGetters(["layerConfigById"]),
        ...mapGetters("Modules/SimulationTool", ["selectedJobId", "jobResultData"]),
        ...mapGetters("Modules/Login", ["accessToken", "loggedIn"])
    },
    mounted() {
        this.fetchJob(this.selectedJobId);
    },
    unmounted() {
        if (this.intervalId) {
            window.clearInterval(this.intervalId);
        }
        if (this.job) {
            let layerObject = this.layerConfigById(this.job.jobID);
            if (layerObject) {
                this.addOrReplaceLayer({
                    layerId: this.job.jobID,
                    visibility: false
                });
            }
        }
    },
    watch: {
        job: function(newJob) {
            if (newJob) {
                this.fetchJobResultData();
                setTimeout(() => {
                    this.fetchJobLayer(newJob);
                }, 3000);
            }
        }
    },
    methods: {
        ...mapActions(["addLayerToLayerConfig", "addOrReplaceLayer"]),
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
                    if (this.intervalId) {
                        window.clearInterval(this.intervalId);
                    }
                } else {
                    this.job = result;
                }
                if (result.status !== 'running') {
                    this.jobRequestState.loading = false;
                }
            } catch (error) {
                this.jobRequestState.error = error || 'unknown error';
                if (this.intervalId) {
                    window.clearInterval(this.intervalId);
                }
            } finally {
                this.jobRequestState.loading = false;
            }
        },
        async fetchJobResultData() {
            // check if data is already in store
            if (this.jobResultData[this.selectedJobId]) {
                return;
            }

            if (this.intervalId) {
                window.clearInterval(this.intervalId);
            }
            if (this.job.status === 'running') {
                this.intervalId = window.setInterval(() => this.fetchJob(this.selectedJobId), 5000);
                return;
            }

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
                    if (this.intervalId) {
                        window.clearInterval(this.intervalId);
                    }
                } else {
                    this.setJobResultData({
                        ...this.jobResultData,
                        [this.selectedJobId]: result
                    });
                }
            } catch (error) {
                this.resultRequestState.error = error || 'unknown error';
                if (this.intervalId) {
                    window.clearInterval(this.intervalId);
                }
            } finally {
                this.resultRequestState.loading = false;
            }
        },
        async fetchJobLayer(job) {
            // check if layer exists on geoserver
            const response = await fetch('/geoserver/CUT/wms?service=WMS&version=1.1.1&request=DescribeLayer&layers=CUT:' + job.jobID);
            if (!response.ok || !(await response.text()).includes("WMS_DescribeLayerResponse")) {
                return;
            }

            // set visible if already in map
            let layerObject = this.layerConfigById(job.jobID);
            if (layerObject) {
                this.addOrReplaceLayer({layerId: job.jobID, visibility: true});
            // otherwise add to map
            } else {
                layerObject = {
                    id: job.jobID,
                    name: "Szenario - " + job.name,
                    typ: "WMS",
                    layers: ['CUT:' + job.jobID],
                    url: '/geoserver/CUT/wms',
                    version: '1.1.1',
                    visibility: true,
                    type: "layer",
                    showInLayerTree: true
                };
                await this.addLayerToLayerConfig({layerConfig: layerObject, parentKey: 'subjectlayer'});
            }
        },
        async downloadJobResultData() {
            if (!this.jobResultData) {
                return;
            }
            const blob = new Blob([JSON.stringify(this.jobResultData, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.job.jobID + '_result.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
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
                <div class="title">
                    <h3 :title="job?.jobID">{{ job?.process_title }} -> {{ job?.name }}</h3>
                </div>
                <div class="subtitle">
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
                </div>
                <div class="status-wrapper">
                    <div class="status" :class="job?.status">
                        {{ job?.status }}
                    </div>
                </div>
                <div class="links">
                    <h4>{{ $t('additional:modules.tools.simulationTool.links') }}</h4>
                    <ul>
                        <li v-for="(link, index) in job?.links" :key="link.rel">
                            <button
                                v-if="jobResultData"
                                title="Download"
                                class="btn btn-link"
                                @click="downloadJobResultData"
                            >
                                <i class="bi bi-download"></i>
                            </button>
                            {{link.title}}
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
                <div class="panel-container">
                    <div class="notes" v-if="this.loggedIn">
                        <h4>{{ $t('additional:modules.tools.simulationTool.notes') }}</h4>
                        <CommentsPanel
                            endPoint="jobs"
                            :entityId="job.jobID"
                        />
                    </div>
                    <div class="sharing" v-if="this.loggedIn">
                        <h4>{{ $t('additional:modules.tools.simulationTool.sharing') }}</h4>
                        <SharingPanel
                            endPoint="jobs"
                            :entityId="job.jobID?.toString()"
                        />
                    </div>
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

    .details-body {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        flex: 1;
        overflow: hidden;

        .links {

            ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
        }

        .diagram-wrapper {
            border: 1px solid #ccc;
            box-shadow: var(--bs-box-shadow);
            border-radius: 10px;
            padding: 20px;
        }
    }

    .panel-container {
            display: flex;
            gap: 1rem;
            overflow: hidden;
            flex: 1;
            align-items: stretch;
        }

    .notes, .sharing {
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
            overflow: auto;
        }
}
</style>
