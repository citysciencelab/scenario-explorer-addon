<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import SectionHeader from "../SectionHeader.vue";
import Diagramm from "../Diagramm/Diagramm.vue";
import AsyncWrapper from "../AsyncWrapper.vue";
import CommentsPanel from "../Comments/CommentsPanel.vue"
import SharingPanel from "../Sharing/SharingPanel.vue"
import Config from "../../../../portal/simulation/config";
import { and, equalTo } from "ol/format/filter";

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
            },
            displayMapFilters: [],
            mapFilters: [],
            filterOnClient: false
        };
    },
    computed: {
        ...mapGetters(["layerConfigById"]),
        ...mapGetters("Modules/SimulationTool", ["selectedJobId", "jobResultData"]),
        ...mapGetters("Modules/Login", ["accessToken", "loggedIn"])
    },
    mounted() {
        this.fetchJob(this.selectedJobId);
        this.initMapFilters();
        this.updateLayer();
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
                this.initMapFilters();
            }
        }
    },
    watch: {
        job(newJob) {
            if (newJob) {
                this.fetchJobResultData();
                setTimeout(() => {
                    this.fetchJobLayer(newJob);
                    this.initMapFilters();
                }, 3000);
        }
    },
    mapFilters: {
        // watch (deeply) for changes in mapFilters to initiate new WFS requests or filter data in client
        handler: function (newVal, oldVal) {
            if (!oldVal.length) {
                return;
            }

            this.updateLayer(newVal);
        },
        deep: true,
    },
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
        /**
         * Update the layer features, filtered on the server via WFS filter
         */
         async updateLayerServer() {
            const filter = this.getFilterString();

            // at least one filter is required - do not try to fetch all features
            if (!filter) {
                return;
            }

            const url = this.getWFSUrl(filter);
            const geojson = await fetch(url).then((res) => res.json());
            const features = new GeoJSON().readFeatures(geojson);
            this.updateSource(features);
            this.renderChart();
        },
        /**
         * Returns the XML representation of the given map filters as an XML string
         * to include into a WFS request.
         *
         */
         getFilterString() {
            const filters = this.mapFilters.filter((mf) => mf.active);

            let olFilter = undefined;

            if (filters.length) {
                olFilter =
                    filters.length < 2
                        ? equalTo(filters[0].key, filters[0].value)
                        : and(
                              ...filters.map((mf) => equalTo(mf.key, mf.value))
                          );
            }
         },
        /**
         * Updates the layer features
         */
         async updateLayer() {
            if (this.filterOnClient) {
                this.updateLayerClient();
            } else {
                this.updateLayerServer();
            }
        },
        /**
         * Update the layer features, loads all data initially and filters on the client
         */
         async updateLayerClient() {
            if (!this.features) {
                const url = this.getWFSUrl();
                const geojson = await fetch(url).then((res) => res.json());
                this.features = new GeoJSON().readFeatures(geojson);
            }

            // filter features by mapFilters
            const filteredFeatures = this.features.filter((feature) => {
                return this.mapFilters.every((mf) => {
                    if (!mf.active) {
                        // if filter is not active this check is passed
                        return true;
                    }

                    const { key, value } = mf;
                    const properties = feature.getProperties();
                    const featureValue =
                        typeof value === "number"
                            ? Number(properties[key])
                            : properties[key];

                    return value === featureValue;
                });
            });

            this.updateSource(filteredFeatures);
            this.renderChart();
        },
        /**
         * Initially set the job's filter values retrieved from the job's config
         */
         initMapFilters() {
       
            if (!this.job || !this.job.results_metadata || !Array.isArray(this.job.results_metadata.values)) {
                this.mapFilters = [];
                this.displayMapFilters = [];
                return;
            }

            this.mapFilters = this.job.results_metadata.values
             .map((filterEntry) => {
                 const key = Object.keys(filterEntry)[0];
                 const filterValues = filterEntry[key];
                 console.log(filterValues)
                    const { type, min, max, values } = filterValues;

                    // we do not filter for float values
                    if (type.startsWith("float")) {
                        return null;
                    }

                    // we do not filter if there is only one possible value (int)
                    if (
                        type.startsWith("int") &&
                        typeof min === "number" &&
                        min === max
                    ) {
                        return null;
                    }

                    // we do not filter if there is only one possible value (string)
                    if (type.startsWith("string") && values.length <= 1) {
                        return null;
                    }

                    const value = type === "string" ? values[0] : min;
                    const filter = {
                        key,
                        active: false,
                        value,
                    };

                    if (type === "string") {
                        filter.options = values;
                    } else {
                        filter.min = min;
                        filter.max = max;
                        filter.step = 1;
                    }

                    return filter;
                })
                .filter(Boolean);

            this.displayMapFilters = JSON.parse(JSON.stringify(this.mapFilters));
        },
        /**
         * Helper function to update a filter value
         * @param {String} key The filter key
         * @param {String | Number} value The filter's new value
         * @param {Boolean} active If the filter is active
         */
         setMapFilter(key, value, active) {
            const filter = this.displayMapFilters.find((mf) => mf.key === key);
            filter.value = value;
            filter.active = active;
        },
        /**
         * Commtis the current display filters to the actual applied filter values.
         * Note that new requests are only fired when the applied filters object changes.
         */
         commitMapFilters() {
            this.mapFilters = JSON.parse(JSON.stringify(this.displayMapFilters));
        },
    }
};
</script>

<template>
    <div class="job-details segment-wrapper">
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
                <div class="links segment-wrapper">
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
                <div class="parameter segment-wrapper">
                    <h4>
                        {{ $t('additional:modules.tools.simulationTool.parameters') }}
                        <button
                                tabindex="0"
                                class="btn btn-light"
                                type="button"
                                @click="jobSelectVisible = !jobSelectVisible"
                            >
                                <i
                                    class="bi-plus-circle"
                                    role="img"
                                ></i>
                            </button>
                    </h4>
                    <ul v-if="this.jobSelectVisible">
                        <li v-for="(value, key) in job?.parameters.inputs" :key="key">
                            <strong>{{key}}</strong>: {{value}}
                        </li>
                    </ul>
                </div>
                <div class="filter segment-wrapper">
                    <h4>{{ $t('additional:modules.tools.simulationTool.filter') }}</h4>
                <ul>
                    <li v-for="filter in displayMapFilters" :key="filter.key">
                        <label :title="filter.key">{{ filter.key }}</label>
                        <input
                            type="checkbox"
                            :checked="filter.active"
                            @change="
                                (event) => {
                                    setMapFilter(
                                        filter.key,
                                        filter.value,
                                        event.target.checked
                                    );
                                    commitMapFilters();
                                }
                            "
                        />
                        <input
                            v-if="typeof filter.value === 'number'"
                            type="range"
                            :min="filter.min ?? 0"
                            :max="filter.max ?? 0"
                            :step="filter.step"
                            :value="filter.value"
                            :disabled="!filter.active"
                            @input="
                                (event) => {
                                    setMapFilter(
                                        filter.key,
                                        Number(event.target.value),
                                        filter.active
                                    );
                                    if (filterOnClient) {
                                        commitMapFilters();
                                    }
                                }
                            "
                            @change="
                                (event) => {
                                    if (!filterOnClient) {
                                        commitMapFilters();
                                    }
                                }
                            "
                        />

                        <select
                            v-else
                            class="form-select"
                            :value="filter.value"
                            :disabled="!filter.active"
                            @change="
                                (event) => {
                                    setMapFilter(
                                        filter.key,
                                        event.target.value,
                                        filter.active
                                    );
                                    commitMapFilters();
                                }
                            "
                        >
                            <option
                                v-for="option in filter.options"
                                :value="option"
                            >
                                {{ option }}
                            </option>
                        </select>

                        <span v-if="typeof filter.value === 'number'">{{
                            filter.value
                        }}</span>
                    </li>
                </ul>
                </div>

                <div class="charts segment-wrapper">
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
        max-height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        overflow: auto;
        width: 100%;
        box-sizing: border-box;
    }

    .flex-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
        flex: 0 1 auto;
    }

    .details-body, 
    .panel-container, 
    .charts, 
    .links, 
    .filter, 
    .parameter,
    .notes, 
    .sharing {
        flex: 0 1 auto;
        overflow: auto;
        min-height: 50px;
    }

    .panel-container {
        display: flex;
        gap: 1rem;
        overflow: hidden;
        flex: 1 1 50%;
        align-items: stretch;
        height: 200px;
        padding-bottom: 1rem;
    }

    .notes, .sharing {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        flex-shrink: 0;
    }

    .charts {
        width: 100%;
        box-sizing: border-box; 
    }

    .job-filter {
    padding: 1em 0;
    }

    .filter input {
        outline: none;
    }

    .filter ul {
        padding: 0;
    }

    .filter li {
        display: grid;
        padding: 1em 0;
        grid-template-columns: 6em auto 1fr minmax(2em, auto);
        gap: 1em;
        align-items: center;
    }

    .filter li label {
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
