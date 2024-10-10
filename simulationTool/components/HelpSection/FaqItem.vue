<script>
export default {
    data() {
        return {
            isOpen: false,
        };
    },
    props: {
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        }
    },
    methods: {
        toggleAnswer() {
            this.isOpen = !this.isOpen;
        }
    }
};
</script>

<template>
    <div class="faq-item">
        <button @click="toggleAnswer" :class="['faq-question', 'btn-light', isOpen ? 'faq-question open' : 'faq-question']">
            {{ question }}
            <i :class="['bi', isOpen ? 'bi-chevron-down' : 'bi-chevron-right']"></i>
        </button>
        <div v-show="isOpen" class="answer">
            {{ answer }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.faq-item {
    margin-bottom: 10px;
}

.faq-question {
    color: var(--bs-gray-700);
    border: 0px;
    border-radius: 8px;
    box-shadow: var(--bs-box-shadow);
    padding: 10px;
    cursor: pointer;
    width: 100%;
    text-align: left;
    position: relative;
    background-color: transparent;

    &.open {
        background-color: var(--bs-light);
    }
}

.faq-question i {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 0.3s ease;
}

.faq-question:hover {
    background-color: var(--bs-btn-hover-bg);
}

.answer {
    color: var(--bs-dark);
    padding: 10px;
    border: 0px;
    border-radius: 0px 0px 8px 8px;
    box-shadow: var(--bs-box-shadow);
}

</style>