<script>
import { mapMutations, mapGetters } from "vuex";
import SectionHeader from "../SectionHeader.vue";
import SimulationJobExecutionInput from "../SimulationJobExecutionInput.vue";
import Config from "../../../../portal/simulation/config";

export default {
    name: "JobExecution",
    components: {
        SectionHeader,
        SimulationJobExecutionInput
    },
    data() {
        return {
            process: null,
            executionValues: {}
        };
    },
    computed: {
        ...mapGetters("Modules/SimulationTool", [
            "selectedProcessId"
        ]),
        ...mapGetters("Modules/Login", [
            "accessToken",
            "loggedIn"
        ])
    },
    mounted() {
        this.fetchProcess(this.selectedProcessId);
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", [
            "setSelectedJobId",
            "setMode"
        ]),
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

            this.process = await fetch(`/api/processes/${processId}`,{
                headers: {
                    "Content-Type": "application/json",
                    ...additionalHeaders
                }
            }).then((res) => res.json());
        },
        updateExecutionValue (key, value) {
            this.executionValues[key] = value;
        },
        resetExecutionValues (newInputsConfig = this.process.inputs) {
            this.executionValues = {};
            Object.entries(newInputsConfig).forEach(([key, input]) => {
                if (input.schema.type === "array") {
                    this.executionValues[key] = [""];
                }
            });
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

                const result = await fetch(`/api/processes/${this.selectedProcessId}/execution`, {
                    method: "POST",
                    body: JSON.stringify({
                        job_name,
                        inputs
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        ...additionalHeaders
                    }
                }).then((res) => res.json());

                this.resetExecutionValues();

                this.setMode("job-details");
                this.setSelectedJobId(result.jobID);
            }
        }
    }
};
</script>

<template>
    <div class="job-execution">
        <SectionHeader title="Neues Szenario" icon="bi-box-fill" />
        <h3>Modell: {{ process?.title }}</h3>
        <form
            ref="form"
            class="execution-form"
        >
            <label for="name_input">Szenario Name:</label>
            <input
                id="name_input"
                class="form-control"
                type="text"
                v-model="executionValues.job_name"
                required
            />
            <div v-if="process" class="inputs">
                <h4>Eingabeparameter</h4>
                <template
                    v-for="(input, key) in process.inputs"
                    :key="`label_${key}`"
                >
                    <label
                        :title="input.description"
                        :for="`input_${key}`"
                    >
                        {{ input.title }}:
                    </label>
                    <SimulationJobExecutionInput
                        :input-key="key"
                        :data="input"
                        :value="executionValues[key]"
                        @change="updateExecutionValue(key, $event)"
                    />
                </template>
            </div>

            <button
                class="btn btn-primary btn-lg"
                type="submit"
                @click="execute"
            >
                <i class="bi bi-box-fill">&nbsp;</i>
                Szenario ausführen
            </button>
        </form>
    </div>
</template>

<style lang="scss" scoped>
    .job-execution {
        max-height: 100%;
        display: flex;
        flex-direction: column;
        padding: 1rem;

        .execution-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;

            .inputs {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            button {
                align-self: flex-end;
            }
        }
    }
</style>
