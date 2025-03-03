import {generateSimpleGetters} from "../../../src/shared/js/utils/generators.js";
import state from "./state";

const getters = {
    ...generateSimpleGetters(state)
};

export default getters;
