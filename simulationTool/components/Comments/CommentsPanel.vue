<script>
import { mapGetters } from "vuex";
import AsyncWrapper from '../AsyncWrapper.vue';
import UserDisplay from "../UserDisplay.vue";

export default {
    name: "CommentsPanel",
    components: {
        AsyncWrapper,
        UserDisplay
    },
    props: {
        endPoint: {
            type: String,
            required: true
        },
        entityId: {
            type: String,
            required: true
        }
    },
    data: () => ({
        comments: [],
        comment: '',
        requestState: {
            loading: false,
            error: null
        }
    }),
    computed: {
        ...mapGetters("Modules/Login", ["accessToken", "loggedIn"]),
        ownUserId() {
            const decodedToken = JSON.parse(atob(this.accessToken.split('.')[1]));
            return decodedToken.sub;
        }
    },
    mounted() {
        this.fetchComments();
        this.startPolling();
    },
    beforeDestroy() {
        this.stopPolling();
    },
    methods: {
        async fetchComments() {
            let additionalHeaders = {};
            if (this.loggedIn) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.accessToken}`
                };
            }
            try {
                this.requestState.loading = true;
                const response = await fetch(`/api/${this.endPoint}/${this.entityId}/comments`,{
                    headers: {
                        "Content-Type": "application/json",
                        ...additionalHeaders
                    }
                });
                const result = await response.json();
                if (!response.ok) {
                    this.requestState.error = result.error_message || response.status + ': unknown errror';
                } else {
                    this.comments = result;
                }
            } catch (error) {
                this.requestState.error = error;
            } finally {
                this.requestState.loading = false;
            }
        },
        async sendComment() {
            if (!this.loggedIn) {
                return;
            }
            try {
                this.requestState.loading = true;
                const response = await fetch(`/api/${this.endPoint}/${this.entityId}/comments`,{
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.accessToken}`
                    },
                    body: JSON.stringify({
                        comment: this.comment
                    })
                });
                const result = await response.json();
                if (!response.ok) {
                    this.requestState.error = result.error_message || response.status + ': unknown errror';
                } else {
                    this.comment = '';
                    this.fetchComments();
                }
            } catch (error) {
                this.requestState.error = error;
            } finally {
                this.requestState.loading = false;
            }
        },
        startPolling() {
            this.pollingInterval = setInterval(() => {
                this.fetchComments();
            }, 10000);
          },
        stopPolling() {
            clearInterval(this.pollingInterval);
        }
    }
}
</script>

<template>
    <div class="comments-panel">
        <AsyncWrapper :asyncState="requestState">
            <ul class="comments">
                <li
                    v-for="comment in comments"
                    :key="comment.id"
                    class="comment"
                    :class="{'my-comment': comment.user_id === ownUserId }"
                >
                    <span class="user-name">
                        <UserDisplay :user_id="comment.user_id" />
                    </span>
                    <span class="comment-text">
                        {{comment.comment}}
                    </span>
                </li>
            </ul>
        </AsyncWrapper>
        <form
            v-if="loggedIn"
            @submit.prevent="sendComment"
        >
            <div class="input-group">
                <input
                    class="form-control form-control-sm"
                    v-model="comment"
                    type="text"
                    :placeholder="$t('additional:modules.tools.simulationTool.enterComment')"
                >
                <button
                    type="submit"
                    class="btn btn-primary btn-sm"
                    :disabled="requestState.loading"
                >
                    {{ $t("additional:modules.tools.simulationTool.send")}}
                </button>
            </div>
        </form>
    </div>
</template>

<style lang="scss" scoped>
    .comments-panel {
        overflow: hidden;
        min-height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1rem;

        ul.comments {
            list-style-type: none;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            overflow: auto;

            li.comment {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                padding: 0.5rem;
                border-radius: 5px;
                margin-bottom: 0.5rem;
                background-color: var(--bs-primary-bg-subtle);
                max-width: 80%;

                &.my-comment {
                    background-color: var(--bs-primary);
                    align-self: flex-end;
                    align-items: flex-end;
                }

                .user-name {
                    font-weight: bold;
                    margin-bottom: 0.25rem;
                    font-size: 0.875rem;
                }

            }
        }

        form {
            input {
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
            }
            button {
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
            }
        }
    }
</style>
