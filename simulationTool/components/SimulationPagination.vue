<script>
export default {
    name: "SimulationPagination",
    props: {
        itemsPerPage: {
            type: Number,
            required: true
        },
        currentPageIndex: {
            type: Number,
            required: true
        },
        numberOfPages: {
            type: Number,
            required: true
        }
    },
    emits: ["pageChange"],
    computed: {
        maxPageIndex () {
            return this.numberOfPages - 1;
        }
    }
};
</script>

<template>
    <nav>
        <ul class="pagination pagination-sm">
            <li
                :class="{
                    'page-item': true,
                    disabled: currentPageIndex <= 0,
                }"
            >
                <a
                    class="page-link"
                    :tabindex="currentPageIndex <= 0 ? -1 : 0"
                    :aria-disabled="currentPageIndex <= 0"
                    aria-label="Previous"
                    @click.prevent="
                        $emit('pageChange', Math.max(currentPageIndex - 1, 0))
                    "
                >
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>

            <li
                v-for="(pageNumber, index) in numberOfPages"
                :key="pageNumber"
                :class="{
                    'page-item': true,
                    active: index === currentPageIndex,
                }"
            >
                <a
                    class="page-link"
                    @click.prevent="$emit('pageChange', index)"
                >
                    {{ pageNumber }}
                </a>
            </li>

            <li
                :class="{
                    'page-item': true,
                    disabled: currentPageIndex >= numberOfPages,
                }"
            >
                <a
                    class="page-link"
                    :tabindex="currentPageIndex >= numberOfPages ? -1 : 0"
                    :aria-disabled="currentPageIndex >= numberOfPages"
                    aria-label="Next"
                    @click.prevent="
                        $emit('pageChange', Math.min(currentPageIndex + 1, maxPageIndex))
                    "
                >
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" scoped>
.pagination {
    margin: 0;
}
</style>
