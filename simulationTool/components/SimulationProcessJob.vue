<script>
import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";

import Chart from "chart.js";
import {GeoJSON, WFS} from "ol/format";
import {and, equalTo} from "ol/format/filter";

export default {
    name: "SimulationProcessJob",
    props: {
        jobId: {
            type: String,
            required: true
        },
        processId: {
            type: String,
            required: true
        }
    },
    emits: ["close"],
    data () {
        return {
            job: null, // the loaded job data
            chart: null, // the chart.js chart
            chartType: "line", // the currently rendered chart type
            chartData: null, // the computed chart data
            layer: null, // the map layer used for this job
            displayMapFilters: [], // internally used filters settings
            mapFilters: [], // the filter settings
            filterOnClient: false // flag wether server or clint filtering will be used, read from the job's layer config
        };
    },
    watch: {
        chartType () {
            this.renderChart();
        },
        mapFilters: {
            // watch (deeply) for changes in mapFilters to initiate new WFS requests or filter data in client
            handler: function (newVal, oldVal) {
                if (!oldVal.length) {
                    return;
                }

                this.updateLayer(newVal);
            },
            deep: true
        }
    },
    async mounted () {
        await this.fetchJob(this.jobId);
        this.initMapFilters();
        this.createLayer();
        this.updateLayer();
    },

    beforeDestroy () {
        // clear the layer's source to remove everything from the map
        this.layer?.layer.getSource().clear();
    },
    methods: {
        /**
         * Fetches the job details
         * @param {String} jobId Id of the job to fetch
         */
        async fetchJob (jobId) {
            this.job = await fetch(`${Config.simulationApiUrl}/jobs/${jobId}`, {
                headers: {"content-type": "application/json"}
            }).then((res) => res.json());
        },

        /**
         * Calculates and returns the data to render charts.
         * TODO: this is currently bound to a specific model, need to discuss how this will be defined per model
         */
        getChartData () {
            const result = {},
                graphData = this.layer
                    .get("layerSource")
                    .getFeatures()
                    .map((feature) => {
                        const properties = {...feature.getProperties()};

                        delete properties.geometry;
                        return properties;
                    });

            for (const data of graphData) {
                // Count agents per Stadtviertel
                const id = data.AgentID.split("-")[0];

                result[id] = result[id] ? result[id] + 1 : 1;
            }

            this.chartData = {
                labels: Object.keys(result),
                data: Object.values(result)
            };
        },

        /**
         * Render new chart or update existing one
         */
        renderChart () {
            try {
                this.getChartData();
            }
            catch (err) {
                console.error("Chart could not be rendered!", err);
                return;
            }

            const data = {
                labels: this.chartData.labels,
                datasets: [
                    {
                        data: this.chartData.data,
                        backgroundColor: "cornflowerblue"
                    }
                ]
            };

            // Update or remove previous chart
            if (this.chart && this.chart.config.type === this.chartType) {
                this.chart.data.datasets[0].data = data.datasets[0].data;
                this.chart.update();
                return;
            }

            this.chart?.destroy();

            // Render new chart
            const context = this.$refs.chart.getContext("2d");

            this.chart = new Chart(context, {
                type: this.chartType,
                data,
                options: {
                    legend: {
                        display: false
                    }
                }
            });
        },

        /**
         * Get the corresponding layer configured in the services file
         */
        createLayer () {
            if (!this.layer) {
                this.layer = rawLayerList.getLayerWhere({
                    isSimulationLayer: true,
                    simModelId: this.processId
                });

                if (!this.layer) {
                    throw new Error(
                        `No matching layer found for simModelId '${this.processId}`
                    );
                }

                // read and save the load mode for this layer/model
                this.filterOnClient = Boolean(this.layer.filterOnClient);
            }
        },

        /**
         * Updates the layer features
         */
        async updateLayer () {
            if (this.filterOnClient) {
                this.updateLayerClient();
            }
            else {
                this.updateLayerServer();
            }
        },

        /**
         * Returns the XML representation of the given map filters as an XML string
         * to include into a WFS request.
         *
         */
        getFilterString () {
            const filters = this.mapFilters.filter((mf) => mf.active);

            let olFilter;

            if (filters.length) {
                olFilter =
                    filters.length < 2
                        ? equalTo(filters[0].key, filters[0].value)
                        : and(
                            ...filters.map((mf) => equalTo(mf.key, mf.value))
                        );
            }

            // we need this to get the XML representation of the filter
            const requestBody = new WFS().writeGetFeature({
                    featureTypes: ["empty"],
                    filter: olFilter
                }),
                queryNode = requestBody.firstChild;

            if (queryNode.firstChild) {
                return queryNode.innerHTML;
            }

            return null;
        },

        /**
         * Construct the WFS url to fetch a GeoJson - we have to do it manually because
         * the masterportal's "getFeaturePOST" function does not support a custom output format
         *
         * @param {string} filter An XML filter string
         */
        getWFSUrl (filter) {
            const mapProjection = mapCollection.getMapView("2D").getProjection(),
                url = new URL(this.layer.url);

            url.searchParams.append("service", "WFS");
            url.searchParams.append("version", this.layer.version);
            url.searchParams.append("request", "GetFeature");
            url.searchParams.append("typeName", `CUT:${this.jobId}`);
            url.searchParams.append("outputFormat", "application/json");
            url.searchParams.append("srsName", mapProjection.getCode());

            if (filter) {
                url.searchParams.append("filter", filter);
            }

            return url.toString();
        },

        /**
         * Update the layer features, filtered on the server via WFS filter
         */
        async updateLayerServer () {
            const filter = this.getFilterString();

            // at least one filter is required - do not try to fetch all features
            if (!filter) {
                return;
            }

            const url = this.getWFSUrl(filter),
                geojson = await fetch(url).then((res) => res.json()),
                features = new GeoJSON().readFeatures(geojson);

            this.updateSource(features);
            this.renderChart();
        },

        /**
         * Update the layer features, loads all data initially and filters on the client
         */
        async updateLayerClient () {
            if (!this.features) {
                const url = this.getWFSUrl(),
                    geojson = await fetch(url).then((res) => res.json());

                this.features = new GeoJSON().readFeatures(geojson);
            }

            // filter features by mapFilters
            const filteredFeatures = this.features.filter((feature) => {
                return this.mapFilters.every((mf) => {
                    if (!mf.active) {
                        // if filter is not active this check is passed
                        return true;
                    }

                    const {key, value} = mf,
                        properties = feature.getProperties(),
                        featureValue =
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
         * Updates the layer's source
         * @param {ol.Feature[]} features The feature to show on the map
         */
        updateSource (features) {
            const source = this.layer.get("layerSource");

            source.clear();
            source.addFeatures(features);
        },

        /**
         * Initially set the job's filter values retrieved from the job's config
         */
        initMapFilters () {
            const resultValues = this.job.results_metadata.values;

            if (!resultValues) {
                return;
            }

            this.mapFilters = resultValues
                .map((filterEntry) => {
                    const key = Object.keys(filterEntry)[0],
                        filterValues = filterEntry[key],
                        {type, min, max, values} = filterValues;

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

                    const value = type === "string" ? values[0] : min,
                        filter = {
                            key,
                            active: false,
                            value
                        };

                    if (type === "string") {
                        filter.options = values;
                    }
                    else {
                        filter.min = min;
                        filter.max = max;
                        filter.step = 1;
                    }

                    return filter;
                })
                .filter(Boolean);

            this.displayMapFilters = structuredClone(this.mapFilters);
        },

        /**
         * Helper function to update a filter value
         * @param {String} key The filter key
         * @param {String | Number} value The filter's new value
         * @param {Boolean} active If the filter is active
         */
        setMapFilter (key, value, active) {
            const filter = this.displayMapFilters.find((mf) => mf.key === key);

            filter.value = value;
            filter.active = active;
        },

        /**
         * Commtis the current display filters to the actual applied filter values.
         * Note that new requests are only fired when the applied filters object changes.
         */
        commitMapFilters () {
            this.mapFilters = structuredClone(this.displayMapFilters);
        }
    }
};
</script>

<template>
    <div>
        <div class="job-details">
            <div :class="{ 'job-header': true, 'placeholder-glow': !job }">
                <a
                    class="bootstrap-icon"
                    href="#"
                    :title="$t('additional:modules.tools.simulationTool.back')"
                    @click="$emit('close')"
                >
                    <i class="bi-chevron-left" />
                    <span class="sr-only">
                        {{ $t("additional:modules.tools.simulationTool.back") }}
                    </span>
                </a>

                <h3
                    :class="{ placeholder: !job }"
                    :aria-hidden="!job"
                >
                    {{
                        job
                            ? $t(
                                "additional:modules.tools.simulationTool.job"
                            ) +
                                ` "${
                                    job.parameters.inputs.name ||
                                    new Date(job.started).toLocaleString()
                                }"`
                            : $t(
                                "additional:modules.tools.simulationTool.loading"
                            )
                    }}
                </h3>
            </div>

            <div
                v-if="job"
                class="job-data"
            >
                <div>
                    {{ $t("additional:modules.tools.simulationTool.status") }}:
                    <span
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
                <div>
                    {{ $t("additional:modules.tools.simulationTool.started") }}:
                    {{ new Date(job.started).toLocaleString() }}
                </div>
                <div>
                    {{ $t("additional:modules.tools.simulationTool.ended") }}:
                    {{ new Date(job.finished).toLocaleString() }}
                </div>
            </div>
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
            v-if="job"
            class="job-filter"
        >
            <h4>
                {{
                    $t(
                        "additional:modules.tools.simulationTool.propertyFilter"
                    )
                }}:
            </h4>
            <ul>
                <li
                    v-for="filter in displayMapFilters"
                    :key="filter.key"
                >
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
                    >
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
                    >

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
                            :key="option"
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

        <div
            v-if="job"
            class="job-graphs"
            :class="{ 'job-graphs': true, visible: Boolean(chartData) }"
        >
            <h4>{{ $t("additional:modules.tools.simulationTool.charts") }}</h4>
            <ul class="nav nav-pills nav-fill">
                <li
                    v-for="type in ['line', 'radar', 'bar']"
                    :key="type"
                    class="nav-item"
                >
                    <a
                        :class="{
                            'nav-link': true,
                            active: chartType === type,
                        }"
                        :aria-current="chartType === type ? 'page' : false"
                        href="#"
                        @click.prevent="chartType = type"
                    >{{
                        $t(
                            `additional:modules.tools.simulationTool.chart-${type}`
                        )
                    }}</a>
                </li>
            </ul>

            <canvas
                ref="chart"
                width="400"
                height="300"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.job-details {
    position: sticky;
    top: -1.25rem;
    margin: -1.25rem -1.25rem 1rem;
    padding: 1.25rem 1.25rem 0;
    background: white;
}

.job-details::after {
    content: "";
    display: block;
    border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}

.job-header {
    display: flex;
    align-items: center;
    column-gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.job-header > * {
    margin: 0;
}

.job-data {
    display: grid;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
}

.status {
    padding: 0.1em 0.5em;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.job-graphs {
    display: none;
    gap: 1rem;

    &.visible {
        display: grid;
    }
}

.job-graphs canvas {
    margin-top: 2rem;
}

.job-filter {
    padding: 1em 0;
}

.job-filter input {
    outline: none;
}

.job-filter ul {
    padding: 0;
}

.job-filter li {
    display: grid;
    padding: 1em 0;
    grid-template-columns: 6em auto 1fr minmax(2em, auto);
    gap: 1em;
    align-items: center;
}

.job-filter li label {
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
