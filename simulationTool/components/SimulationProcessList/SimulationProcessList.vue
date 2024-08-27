<script>
import Multiselect from "vue-multiselect";
import ProcessCard from './ProcessCard.vue';

export default {
    name: "SimulationProcessList",
    components: {
        Multiselect,
        ProcessCard
    },
    props: {
        "processes": {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            selectedTags: [],
            filteredProcesses: [],
            options: []
        }
    },
    computed: {
        filteredProcesses: {
            get() {
                if (this.selectedTags.length === 0) {
                    return this.processes;
                }
                return this.processes.filter(process => {
                    return this.selectedTags.some(tag => process.keywords.includes(tag.name));
                });
            },
            set(newProcesses) {
                this.filteredProcesses = newProcesses;
            }
        },
        options: {
            get() {
                return this.processes.reduce((acc, process) => {
                    process.keywords.forEach(keyword => {
                        if (!acc.some(tag => tag.name === keyword)) {
                            acc.push({name: keyword});
                        }
                    });
                    return acc;
                }, []);
            },
            set(newOptions) {
                this.options = newOptions;
            }
        }
    },
    emits: ["selected"]
};
</script>

<template>
    <div class="process-list">
        <h3>{{ $t("additional:modules.tools.simulationTool.models") }}</h3>
        <div class="process-list-toolbar">
            <div class="input-group search-wrapper">
                <input type="search" class="form-control" placeholder="Suche …" aria-label="Suche">
                <button class="btn btn-primary" disabled="" aria-label="Suche" type="button">
                    <i class="bi-search" role="img">
                    </i>
                </button>
            </div>
            <multiselect
                v-model="selectedTags"
                placeholder="Filter …"
                label="name"
                track-by="code"
                :options="options"
                :multiple="true"
            />
        </div>
        <div class="card-wrapper">
            <ProcessCard
                v-for="process in filteredProcesses"
                :key="process.id"
                :process="process"
                @selected="$emit('selected', process.id)"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
@import "~bootstrap/scss/card";

.process-list {
    height: 100%;

    .process-list-toolbar {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1rem;

        .search-wrapper {
            button.btn {
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
            }
        }
    }

    .card-wrapper {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); /* Automatische Spaltenanpassung */
        gap: 1rem;
        max-height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
}

</style>
