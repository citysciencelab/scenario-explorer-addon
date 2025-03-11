const Config = {
    namedProjections: [
        [
            "EPSG:25832",
            "+title=ETRS89/UTM 32N +proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
        ],
    ],
    footer: {
        urls: [
            {
                bezeichnung: "common:modules.footer.designation",
                url: "https://geoinfo.hamburg.de/",
                alias: "Landesbetrieb Geoinformation und Vermessung",
                alias_mobil: "LGV",
            },
        ],
        showVersion: true,
    },
    quickHelp: {
        imgPath: "./resources/img/",
    },
    layerConf: "https://geodienste.hamburg.de/services-internet.json",
    restConf: "https://geodienste.hamburg.de/lgv-config/rest-services-internet.json",
    styleConf: "https://geodienste.hamburg.de/lgv-config/style_v3.json",
    wfsImgPath: "https://geodienste.hamburg.de/lgv-config/img/",
    cesiumLibrary: "https://geoportal-hamburg.de/mastercode/cesium/latest/Cesium.js",
    scaleLine: true,
    mouseHover: {
        numFeaturesToShow: 2,
        infoText: "(weitere Objekte. Bitte zoomen.)",
    },
    portalLanguage: {
        enabled: true,
        debug: false,
        languages: {
            de: "Deutsch",
            en: "English",
        },
        fallbackLanguage: "de",
        changeLanguageOnStartWhen: ["querystring", "localStorage", "htmlTag"]
    },
    vuetify: "addons/simulationTool/vuetify.js",
    addons: ["simulationTool"],
    simulationApiUrl: "https://modelplatform.comodeling.city/api",
    login: {
        oidcAuthorizationEndpoint: "https://auth.comodeling.city/realms/UrbanModelPlatform/protocol/openid-connect/auth",
        oidcTokenEndpoint: "https://auth.comodeling.city/realms/UrbanModelPlatform/protocol/openid-connect/token",
        oidcClientId: "ump-client",
        oidcRedirectUri: "http://localhost/portal/simulation/",
        oidcScope: "openid",
        interceptorUrlRegex: "https?://localhost.*" // add authorization to all URLs that match the given regex
    }
};

// conditional export to make config readable by e2e tests
if (typeof module !== "undefined") {
    module.exports = Config;
}