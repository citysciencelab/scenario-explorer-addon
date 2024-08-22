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
    <nav class="pagination-wrapper">
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
                    disabled: currentPageIndex >= (numberOfPages - 1),
                }"
            >
                <a
                    class="page-link"
                    :tabindex="currentPageIndex >= (numberOfPages - 1) ? -1 : 0"
                    :aria-disabled="currentPageIndex >= (numberOfPages - 1)"
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
nav.pagination-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
}
ul.pagination {
    display: flex;
    list-style: none;
    margin: 0;
    gap: 1em;
    padding-left: 0;

    li.page-item {
        min-width: 2em;
        text-align: center;
        cursor: pointer;

        &.disabled {
            pointer-events: none;
            opacity: 0.3;
        }

        &.active {
            font-weight: bold;
        }
    }
}
</style>
