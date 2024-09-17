<script>
import { mapMutations, mapGetters } from "vuex";
import SectionHeader from "../SectionHeader.vue";

export default {
    name: "JobDetails",
    components: {
        SectionHeader
    },
    data() {
        return {
            job: null
        };
    },
    computed: {
        ...mapGetters("Modules/SimulationTool", [
            "selectedJobId"
        ]),
        ...mapGetters("Modules/Login", [
            "accessToken",
            "loggedIn"
        ])
    },
    mounted() {
        this.fetchJob(this.selectedJobId);
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", [
            "setMode"
        ]),
        /**
         * Fetches a job from the simulation backend
         * @param {String} jobId
         */
        async fetchJob (jobId) {
            let additionalHeaders = {};
            if (this.loggedIn) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.accessToken}`
                };
            }

            this.job = await fetch(`${Config.simulationApiUrl}/jobs/${jobId}`,{
                headers: {
                    "Content-Type": "application/json",
                    ...additionalHeaders
                }
            }).then((res) => res.json());
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
        <SectionHeader title="Szenario Details" icon="bi-box-fill" />
        <div v-if="this.job" class="details-body">
            <div class="details-header">
                <h3 :title="job.jobID">{{ job.process_title }} -> {{ job.name }}</h3>
                <div>
                    <strong>gestartet:</strong> {{ this.formatDateTime(job.started) }}
                </div>
                <div>
                    <strong>abgeschlossen:</strong> {{ this.formatDateTime(job.finished) }}
                </div>
                <div class="status" :class="job.status">
                    {{job.status}}
                </div>
            </div>
            <div class="links">
                <h4>Links</h4>
                <ul>
                    <li v-for="(link, index) in job.links" :key="link.rel">
                        <i class="bi bi-link"></i>
                        <a :href="link.href" target="_blank">{{link.title}}</a>
                    </li>
                </ul>
            </div>
            <div class="parameter">
                <h4>Parameter</h4>
                <ul>
                    <li v-for="(value, key) in job.parameters.inputs" :key="key">
                        <strong>{{key}}</strong>: {{value}}
                    </li>
                </ul>
            </div>
            <div class="filter">
                <h4>Filter</h4>
            </div>
            <div class="graphs">
                <h4>Graphen</h4>
            </div>
            <div class="notes">
                <h4>Notizen</h4>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .job-details {
        max-height: 100%;
        display: flex;
        flex-direction: column;
        padding: 1rem;

        .details-body {
            display: grid;
            gap: 1rem;
            grid-template-areas:
                "header header"
                "links links"
                "parameter filter"
                "graphs notes";
            grid-template-columns: 1fr 1fr;

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

            .links {
                grid-area: links;
            }

            .header {
                grid-area: header;
            }

            .parameter {
                grid-area: parameter;
            }

            .filter {
                grid-area: filter;
            }

            .graphs {
                grid-area: graphs;
            }

            .notes {
                grid-area: notes;
            }
        }

    }
</style>
