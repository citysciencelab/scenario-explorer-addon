<script>
export default {
    name: "SimulationProcesses",
    props: {
        "processes": {
            type: Array,
            required: true
        }
    },
    emits: ["selected"],
    methods: {
        getProcessLink (process) {
            const link = process.links.find(({rel}) => rel === "about");

            return link ? link.href : "";
        }
    }
};
</script>

<template>
    <div>
        <h3>{{ $t("additional:modules.tools.simulationTool.models") }}</h3>

        <table class="table">
            <thead>
                <tr>
                    <th
                        scope="col"
                        class="col-4"
                    >
                        {{ $t("additional:modules.tools.simulationTool.name") }}
                    </th>
                    <th
                        scope="col"
                        class="col-6"
                    >
                        {{ $t("additional:modules.tools.simulationTool.description") }}
                    </th>
                    <th scope="col" />
                    <th scope="col" />
                </tr>
            </thead>
            <tbody>
                <template v-if="processes !== null">
                    <template v-if="processes.length === 0">
                        <tr>
                            <th scope="row">
                                {{ $t("additional:modules.tools.simulationTool.error") }}
                            </th>
                            <td class="error">
                                {{ $t("additional:modules.tools.simulationTool.noModelsError") }}
                            </td>
                            <td />
                        </tr>
                    </template>

                    <template v-if="processes !== null && processes.length">
                        <tr
                            v-for="process in processes"
                            :key="process.id"
                        >
                            <th scope="row">
                                {{ process.title }}
                            </th>
                            <td>{{ process.description }}</td>
                            <td>
                                <a
                                    target="_blank"
                                    class="process-link"
                                    :href="getProcessLink(process)"
                                >{{ $t("additional:modules.tools.simulationTool.info") }}</a>
                            </td>
                            <td>
                                <a
                                    href="#"
                                    @click="$emit('selected', process.id)"
                                >{{ $t("additional:modules.tools.simulationTool.model") }}</a>
                            </td>
                        </tr>
                    </template>
                </template>

                <tr
                    v-else
                    class="placeholder-glow"
                    aria-hidden
                >
                    <td><span class="placeholder d-block" /></td>
                    <td><span class="placeholder d-block" /></td>
                    <td><span class="placeholder d-block" /></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss" scoped>
h3 {
    position: sticky;
    top: -1.25rem;
    margin: -1.25rem -1.25rem 0;
    padding: 1.25rem 1.25rem 0.5rem;
    background: white;
}

.error {
    color: red;
}

.process-link[href=""] {
    pointer-events: none;
    color: red;
}
</style>
