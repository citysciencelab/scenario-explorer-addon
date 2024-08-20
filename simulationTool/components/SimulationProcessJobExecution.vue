<script>
import SimulationJobExecutionInput from "./SimulationJobExecutionInput.vue";

export default {
    name: "SimulationProcessJobExecution",
    components: {SimulationJobExecutionInput},
    props: {
        "processId": {
            type: String,
            required: true
        },
        "inputsConfig": {
            type: Object,
            required: true
        }
    },
    emits: ["executed"],
    data () {
        return {
            executionValues: {},
            apiUrl: Config.simulationApiUrl
        };
    },
    watch: {
        /**
         * Listens to inputs config changes.
         * @returns {void}
         */
        inputsConfig (newInputsConfig) {
            this.resetExecutionValues(newInputsConfig);
        }
    },
    mounted () {
        this.resetExecutionValues(this.inputsConfig);
    },
    methods: {
        updateExecutionValue (key, value) {
            this.executionValues[key] = value;
        },
        resetExecutionValues (newInputsConfig = this.inputsConfig) {
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
                const processId = this.processId,
                    body = {inputs: this.executionValues};

                await fetch(`${this.apiUrl}/processes/${processId}/execution`, {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {"Content-Type": "application/json"}
                }).then((res) => res.json());

                this.resetExecutionValues();
                this.$emit("executed");
            }
        }
    }
};
</script>

<template v-if="Object.values(inputsConfig).length">
    <section>
        <h4>{{ $t("additional:modules.tools.simulationTool.executeJob") }}</h4>

        <form
            ref="form"
            class="execution-form"
        >
            <template
                v-for="(input, key) in inputsConfig"
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

            <button
                class="btn btn-primary btn-sm"
                type="submit"
                :disabled="
                    !Object.entries(executionValues).filter(
                        ([, value]) => value != null
                    ).length
                "
                @click="execute"
            >
                {{ $t("additional:modules.tools.simulationTool.runJob") }}
            </button>
        </form>
    </section>
</template>

<style lang="scss" scoped>
.execution-form {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
    padding-right: 2rem;
}

.execution-form label {
    margin-top: 0.375rem;
    text-align: right;
}

.execution-form input[type="checkbox"] {
    margin: 0.5625rem 0 0.5rem;
}

.execution-form button {
    grid-column: 2;
}
</style>
