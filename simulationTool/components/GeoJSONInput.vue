<script>
/**
 * Based on the graphicalSelect/components/GraphicalSelect.vue
 * component of the masterportal
 */
import {mapGetters, mapActions, mapMutations} from "vuex";
import Draw, {createBox} from "ol/interaction/Draw.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import {Circle} from "ol/geom.js";
import GeoJSON from "ol/format/GeoJSON.js";
import Overlay from "ol/Overlay.js";

export default {
    name: "GeoJSONInput",
    props: {
        // The used template element for graphical selection
        selectElement: {
            type: String,
            required: false,
            default: "Dropdown"
        },
        // preselected draw modus
        drawType: {
            type: String,
            required: false
        },
        // The description over the select
        description: {
            type: String,
            default: "",
            required: false
        }
    },
    data () {
        return {
            selectedDrawType: this.defaultDrawType,
            geojson: null,
            circleOverlay: new Overlay({
                id: "circle-overlay",
                element: document.createElement("div"),
                offset: [15, 0],
                positioning: "center-left"
            }),
            tooltipOverlay: new Overlay({
                id: "tooltip-overlay",
                element: document.createElement("div"),
                offset: [15, 20],
                positioning: "top-left"
            })
        };
    },
    computed: {
    },
    watch: {
        selectedDrawType: function () {
            this.resetView();
            this.createDrawInteraction();
        }
    },
    mounted () {
        this.createDomOverlay({id: "sdp-circle-overlay", overlay: this.circleOverlay});
        this.createDomOverlay({id: "sdp-tooltip-overlay", overlay: this.tooltipOverlay});
    },
    unmounted () {
        this.resetView();
    },
    methods: {
        ...mapActions("Modules/GraphicalSelect", [
            "createDomOverlay",
            "showTooltipOverlay",
        ]),
        ...mapActions("Maps", [
            "addLayer",
            "addInteraction",
            "removeInteraction",
            "registerListener"
        ]),
        ...mapActions("Alerting", ["addSingleAlert"]),
        findLayer: function() {
          return mapCollection.getMap("2D").getLayers().getArray().find(l => l.get("id") === "geometry_selection_layer")
        },
        /**
         * Sets the selection of the dropdown to the default value
         * @returns {void}
         */
        resetGeographicSelection: function () {
            this.selectedOptionData = Object.keys(this.optionsValue)[0];
        },
        /**
         * Reset the map view by clearing geometries and removing overlays and interactions.
         * This method clears the vector source, removes the layer from the map,
         * removes the draw interaction, and clears the content of the overlays.
         * @returns {void}
         */
        async resetView () {
            const map = mapCollection.getMap("2D");

            if (this.layer) {
                this.layer.getSource().clear();
                map.removeLayer(this.layer);
            }

            if (this.drawInteraction) {
                this.removeInteraction(this.drawInteraction);
            }

            if (this.circleOverlay && this.circleOverlay.element) {
                this.circleOverlay.element.innerHTML = "";
            }

            map.removeOverlay(this.circleOverlay);
            map.removeOverlay(this.tooltipOverlay);
        },

        /**
         * Rounds the circle radius.
         * @param {Number} radius circle radius
         * @return {String} the rounded radius
         */
        roundRadius: function (radius) {
            if (radius > 500) {
                return (Math.round(radius / 1000 * 100) / 100) + " km";
            }
            return (Math.round(radius * 10) / 10) + " m";
        },

        /**
         * Calculates the circle radius and places the circle overlay on geometry change.
         * @param {Number} radius - circle radius
         * @param {Number[]} coords - point coordinate
         * @returns {void}
         */
        showOverlayOnSketch: function (radius, coords) {
            const circleOverlay = this.circleOverlay;

            circleOverlay.element.innerHTML = this.roundRadius(radius);
            circleOverlay.setPosition(coords);
        },

        /**
         * Rounds the given number with the given precision.
         * @param {Number} number to round
         * @param {Number} precision exponent
         * @returns {Number} the rounded number
         */
        precisionRound: function (number, precision) {
            const factor = Math.pow(10, precision);

            return Math.round(number * factor) / factor;
        },

        /**
         * If drawtype == "Circle" set the radius to the circle-geometry
         * @param {*} coordinates array of coordinates to get the radius from
         * @param {*} opt_geom optional existing geometry
         * @returns {*} the optional existing geometry or a circle geometry
         */
        snapRadiusToInterval: function (coordinates, opt_geom) {
            let radius = Math.sqrt(Math.pow(coordinates[1][0] - coordinates[0][0], 2) + Math.pow(coordinates[1][1] - coordinates[0][1], 2));

            radius = this.precisionRound(radius, -1);
            const geometry = opt_geom || new Circle(coordinates[0]);

            geometry.setRadius(radius);

            this.showOverlayOnSketch(radius, coordinates[1]);
            return geometry;
        },

        /**
         * Create the draw interaction Box |Circle |Polygon
         * @returns {void}
         */
        createDrawInteraction: function () {
            const existingLayer = this.findLayer();
            if (!this.layer) {
              this.layer = existingLayer || new VectorLayer({
                  id: "geometry_selection_layer",
                  name: "Geometry-Selection",
                  source: new VectorSource(),
                  alwaysOnTop: true
              });
            }

            let geometryFunction;
            let type;
            switch (this.selectedDrawType) {
              case 'box':
                type = 'Circle';
                geometryFunction = createBox();
                break;
              case 'circle':
                type = 'Circle'
                geometryFunction = this.snapRadiusToInterval;
                break;
              default:
                type = 'Polygon';
                break;
            }

            this.drawInteraction = new Draw({
                source: this.layer.getSource(),
                type,
                geometryFunction
            });

            this.drawInteraction.on("drawstart", (event) => {
              this.layer.getSource().clear();
            });

            this.drawInteraction.on("drawend", (event) => {
              const GeoJSONFormat = new GeoJSON();
              const geometry = event.feature.getGeometry();
              this.geojson = GeoJSONFormat.writeGeometry(geometry);
              this.$emit('change', this.geojson);
            });

            this.addInteraction(this.drawInteraction);
            this.registerListener({type: "pointermove", listener: this.showTooltipOverlay});
            if (!existingLayer) {
                this.addLayer(this.layer);
            }
        }
    }
};
</script>

<template>
    <div class="geojson-input">
        <select
            id="graphicalSelect"
            class="form-select"
            v-model="selectedDrawType"
        >
            <option value="box">Box</option>
            <option value="circle">Circle</option>
            <option value="polygon">Polygon</option>
        </select>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
