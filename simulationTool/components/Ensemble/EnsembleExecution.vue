<script>
import { mapMutations, mapGetters } from "vuex";
import SectionHeader from "../SectionHeader.vue";
import ProcessSelect from "../Process/ProcessSelect.vue";
import Config from "../../../../portal/simulation/config";
import EnsembleInput from "./EnsembleInputs/EnsembleInput.vue";

export default {
    name: "EnsembleExecution",
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
            executionValues: {
                sample_size: 10
            },
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
            "setMode"
        ]),
        updateExecutionValue(processId, key, value) {
            this.executionValues[processId] = this.executionValues[processId] || {};
            this.executionValues[processId][key] = value;
            console.log(JSON.parse(JSON.stringify(this.executionValues)));
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
                    job_name,
                    ...inputs
                } = this.executionValues;

                let additionalHeaders = {};
                if (this.loggedIn) {
                    additionalHeaders = {
                        Authorization: `Bearer ${this.accessToken}`
                    };
                }

                console.log("TODO");
                // TODO: Implement the execution of the job ensemble
            }
        }
    }
};
</script>

<template>
    <div class="ensemble-execution">
        <SectionHeader title="Neues Ensemble" icon="bi-box-fill" />
        <form
            ref="form"
            class="execution-form"
        >
            <input
                id="name_input"
                class="form-control"
                type="text"
                placeholder="Name des Ensembles"
                v-model="executionValues.ensemble_name"
                required
            />
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
                                    :modelValue="executionValues?.[process.id]?.[key]"
                                    @update:modelValue="(value) => updateExecutionValue(process.id, key, value)"
                                />
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <h4>Einstellungen</h4>
            <div class="settings">
                <label for="size_input">Anzahl der Szenarien:</label>
                <input
                    id="size_input"
                    class="form-control"
                    type="number"
                    v-model="executionValues.sample_size"
                    required
                />
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
    .ensemble-execution {
        max-height: 100%;
        display: flex;
        flex-direction: column;
        padding: 1rem;

        .execution-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;

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
            }

            .process-details {
                display: flex;
                flex-direction: column;
                gap: .25rem;
                padding: 1rem;
                border: 1px solid #ccc;
                border-radius: 0.5rem;
            }

            .inputs {
                display: flex;
                flex-direction: column;
                gap: .25rem;

                .input-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
            }

            .settings {
                display: flex;
                flex-direction: column;
                gap: .25rem;
            }

            button {
                align-self: flex-end;
            }
        }
    }
</style>
