<script>
import multiselect from "vue-multiselect";
import RangeSlider from "../../RangeSlider.vue";
import isEqual from "lodash/isEqual";

const DEFAULT_VALUE_MAP = {
    number: [0, 100],
    boolean: [],
    string: []
};

export default {
    name: "EnsembleInput",
    components: {
        multiselect,
        RangeSlider
    },
    props: {
        "modelValue": {
            type: [Array, Boolean],
            default: (props) => {
                const defaultValue = DEFAULT_VALUE_MAP[props.data?.schema?.type] || []
                if (props.data.schema.minimum !== undefined) {
                    defaultValue[0] = props.data.schema.minimum;
                }
                if (props.data.schema.maximum !== undefined) {
                    defaultValue[1] = props.data.schema.maximum;
                }
                return defaultValue;
            }
        },
        "data": {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            internalValue: Array.isArray(this.modelValue) ? [...this.modelValue] : [],
        }
    },
    watch: {
        modelValue(newValue) {
            if (isEqual(newValue, this.internalValue)) return;
            this.internalValue = [...newValue];
        },
        internalValue(newValue) {
            if (isEqual(newValue, this.modelValue)) return;
            this.$emit('update:modelValue', newValue);
        }
    },
    methods: {
        addTag (newTag) {
            this.internalValue.push(newTag)
            this.$emit('update:modelValue', this.internalValue);
        },
        onCheckBooleanChange (bol, evt) {
            const shouldBeIncluded = evt.target.checked;
            if (shouldBeIncluded) {
                this.internalValue.push(bol);
            } else {
                this.internalValue = this.internalValue.filter((val) => val !== bol);
            }
            this.$emit('update:modelValue', this.internalValue);
        }
    },
    computed: {
        options() {
            return this.data.schema.enum || [];
        }
    },
    emits: ['update:modelValue'],
};
</script>

<template>
    <div>
        <multiselect
            v-if="data.schema.type === 'string'"
            v-model="internalValue"
            tag-placeholder="Diesen Wert hinzufügen"
            placeholder="Wert auswählen oder hinzufügen ..."
            :options="options"
            :multiple="true"
            :taggable="this.data.schema.enum === undefined"
            :showNoOptions="false"
            @tag="addTag"
        />
        <RangeSlider
            v-if="['number', 'integer'].includes(data.schema.type)"
            v-model="internalValue"
            :min="data.schema.minimum"
            :max="data.schema.maximum"
        />
        <div v-if="data.schema.type === 'boolean'" class="boolean-input">
            <span>
                <input
                    type="checkbox"
                    id="false-checkbox"
                    label="true"
                    :checked="internalValue.includes(true)"
                    @change="(event) => onCheckBooleanChange(true, event)"
                />
                <label for="false-checkbox">true</label>
            </span>
            <span>
                <input
                    type="checkbox"
                    label="false"
                    id="true-checkbox"
                    :checked="internalValue.includes(false)"
                    @change="(event) => onCheckBooleanChange(false, event)"
                />
                <label for="true-checkbox">false</label>
            </span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .boolean-input {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;

        label {
            margin-left: 0.5rem;
        }
    }
</style>
