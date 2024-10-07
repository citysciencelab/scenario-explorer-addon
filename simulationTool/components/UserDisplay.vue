<script>
import { mapActions, mapGetters } from "vuex";
import LoadingMask from "./LoadingMask.vue";

export default {
    name: "UserDisplay",
    components: {
        LoadingMask
    },
    props: {
        user_id: {
            type: String,
            default: null
        }
    },
    data: () => ({
        user: null,
        requestState: {
            loading: false,
            error: null
        }
    }),
    computed: {
        ...mapGetters("Modules/Login", ["accessToken", "loggedIn"]),
    },
    mounted() {
        this.getUserName();
    },
    methods: {
        ...mapActions("Modules/SimulationTool", ["fetchUserName"]),
        async getUserName() {
            if (!this.loggedIn || !this.user_id) {
                return 'Anonymous*';
            }

            try {
                this.requestState.loading = true;
                this.user = await this.fetchUserName(this.user_id);
            } catch (error) {
                this.requestState.error = error;
            } finally {
                this.requestState.loading = false;
            }
        }
    },
    components: {
        LoadingMask
    }
}
</script>

<template>
    <div v-if="requestState.loading">
        Loading ...
    </div>
    <div
        v-else-if="user"
        class="user-display"
    >
        {{ user.username }}
    </div>
    <div v-else>
        User not found
    </div>
</template>
