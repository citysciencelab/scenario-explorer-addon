<script>
import { mapMutations, mapGetters } from "vuex";
import SectionHeader from "../SectionHeader.vue";
import ProcessSelect from "../Process/ProcessSelect.vue";
import Config from "../../../../portal/simulation/config";
import EnsembleInput from "./EnsembleInputs/EnsembleInput.vue";

export default {
    name: "EnsembleCreation",
    components: {
        EnsembleInput,
        SectionHeader,
        ProcessSelect
    },
    data() {
        return {
            processSelectVisible: false,
            selectedProcesses: [],
            processDetails: [],
            creationValues: {},
            apiUrl: Config.simulationApiUrl
        };
    },
    watch: {
        async selectedProcesses() {
            this.processDetails = await Promise.all(
                this.selectedProcesses.map((process) => {
                    return this.fetchProcess(process.id);
                })
            );
            // add default values for sample size and sampling method
            for (const process of this.processDetails) {
                if (!this.creationValues?.[process.id]?.sample_size) {
                    this.updateExecutionValue(process.id, 'sample_size', 10);
                }
                if (!this.creationValues?.[process.id]?.sampling_method) {
                    this.updateExecutionValue(process.id, 'sampling_method', 'lhs');
                }
            }
            // remove values for processes that are not selected anymore
            Object.keys(this.creationValues).forEach((processId) => {
                if (!this.selectedProcesses.find((process) => process.id === processId)) {
                    delete this.creationValues[processId];
                }
            });
        }
    },
    computed: {
        ...mapGetters("Modules/Login", [
            "accessToken",
            "loggedIn"
        ])
    },
    mounted() {
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", [
            "setMode",
            "setSelectedEnsembleId"
        ]),
        updateExecutionValue(processId, key, value) {
            this.creationValues[processId] = this.creationValues[processId] || {};
            this.creationValues[processId][key] = value;
        },
        /**
         * Fetches a process from the simulation backend
         * @param {String} processId
         */
        async fetchProcess (processId) {
            let additionalHeaders = {};
            if (this.loggedIn) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.accessToken}`
                };
            }

            return await fetch(`${this.apiUrl}/processes/${processId}`,{
                headers: {
                    "Content-Type": "application/json",
                    ...additionalHeaders
                }
            }).then((res) => res.json());
        },
        async execute (event) {
            event.preventDefault();

            const formIsValid = this.$refs.form.reportValidity();

            if (formIsValid) {
                const {
                    name,
                    description,
                    ...inputs
                } = this.creationValues;

                let additionalHeaders = {};
                if (this.loggedIn) {
                    additionalHeaders = {
                        Authorization: `Bearer ${this.accessToken}`
                    };
                }

                const scenario_configs = Object.keys(inputs).map((process_id) => {
                    const {
                        sample_size,
                        sampling_method,
                        ...parameters
                    } = inputs[process_id];
                    return {
                        process_id,
                        sample_size,
                        sampling_method,
                        parameters
                    };
                });

                const result = await fetch('/api/ensembles', {
                    method: "POST",
                    body: JSON.stringify({
                        name,
                        description,
                        scenario_configs
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        ...additionalHeaders
                    }
                }).then((res) => res.json());

                // TODO: Handle errors

                this.setMode("ensemble-details");
                this.setSelectedEnsembleId(result.id);
            }
        }
    }
};
</script>

<template>
    <div class="ensemble-creation">
        <SectionHeader title="Neues Ensemble" icon="bi-box-fill" />
        <form
            ref="form"
            class="creation-form"
        >
            <input
                id="name_input"
                class="form-control"
                type="text"
                placeholder="Name des Ensembles"
                v-model="creationValues.name"
                required
            />
            <textarea
                id="name_input"
                class="form-control"
                placeholder="Beschreibung des Ensembles"
                v-model="creationValues.description"
                required
            ></textarea>
            <div>
                <h4 class="title-with-button">
                    <span>Enthaltene Modelle</span>
                    <button
                        tabindex="0"
                        class="btn btn-light"
                        type="button"
                        :title="processSelectVisible ? 'Schließen' : 'Modelle hinzufügen'"
                        @click="processSelectVisible = !processSelectVisible"
                    >
                        <i
                            class="bi-plus-circle"
                            role="img"
                            :style="{ transform: processSelectVisible ? 'rotate(45deg)' : 'rotate(0deg)' }"
                        ></i>
                    </button>
                </h4>
                <ProcessSelect
                    v-if="processSelectVisible"
                    id="process_selector"
                    v-model="selectedProcesses"
                />
            </div>
            <div class="process-details-container">
                <div
                    class="process-details"
                    v-for="process in processDetails"
                    :key="process.id"
                >
                    <h4>{{ process.title }}</h4>
                    <p>{{ process.description }}</p>
                    <div v-if="process" class="inputs">
                        <h4>Einstellungen</h4>
                        <div class="settings">
                            <label :for="`size_input-${process.id}`">
                                Anzahl der Szenarien:
                            </label>
                            <input
                                :id="`size_input-${process.id}`"
                                class="form-control"
                                type="number"
                                min="1"
                                max="1000"
                                :value="creationValues?.[process.id]?.sample_size"
                                @change="(evt) => updateExecutionValue(process.id, 'sample_size', evt.target.value)"
                                required
                            />
                            <label :for="`sampling_method_input-${process.id}`">
                                Sampling Methode:
                            </label>
                            <select
                                :id="`sampling_method_input-${process.id}`"
                                class="form-control"
                                :value="creationValues?.[process.id]?.sampling_method"
                                @change="(evt) => updateExecutionValue(process.id, 'sampling_method', evt.target.value)"
                                required
                                disabled
                            >
                                <option value="lhs" selected>Latin Hypercube Sampling</option>
                            </select>
                        </div>
                        <h4>Eingabeparameter</h4>
                        <template
                            v-for="(input, key) in process.inputs"
                            :key="`label_${key}`"
                        >
                            <div class="input-wrapper">
                                <label
                                    :title="input.description"
                                    :for="`input_${key}`"
                                >
                                    {{ `${input.title} ${input.required || input.minOccurs > 0 ? '*' : ''}` }}
                                </label>
                                <EnsembleInput
                                    :id="`input_${key}`"
                                    :data="input"
                                    :modelValue="creationValues?.[process.id]?.[key]"
                                    @update:modelValue="(value) => updateExecutionValue(process.id, key, value)"
                                />
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <button
                class="btn btn-primary btn-lg"
                type="submit"
                @click="execute"
            >
                <i class="bi bi-collection-fill">&nbsp;</i>
                Ensemble ausführen
            </button>
        </form>
    </div>
</template>

<style lang="scss" scoped>
    .ensemble-creation {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 1rem;

        .creation-form {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            overflow: hidden;

            .title-with-button {
                display: flex;
                align-items: center;

                button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 2.5rem;
                    height: 2.5rem;
                    font-size: 1.5rem;

                    i {
                        display: flex;
                        transition: transform 0.2s;
                    }
                }
            }

            .process-list {
                width: 50%;
            }

            .process-details-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: .25rem;
                overflow: auto;
            }

            .process-details {
                display: flex;
                flex-direction: column;
                gap: .25rem;
                padding: 1rem;
                border: 1px solid #ccc;
                border-radius: 0.5rem;
            }

            .inputs, .setttings {
                display: flex;
                flex-direction: column;
                gap: .25rem;
            }

            .inputs .input-wrapper {
                display: flex;
                flex-direction: column;
                gap: .5rem;
            }

            button {
                align-self: flex-end;
            }
        }
    }
</style>
