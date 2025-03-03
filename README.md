
![Scenario Explorer Kopie](https://github.com/user-attachments/assets/2a8dd17b-1cbd-40be-a067-9e5c901566fc)

# Scenario Explorer
This repository contains the code for the [Masterportal](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/v3.6.0/) Scenario Explorer AddOn. The AddOn is a dynamic interface to the [Urban Model Platform](https://github.com/citysciencelab/urban-model-platform) and enables users to run simulations and ensembles of various models, retrieve and share results, and visualize them as geo layers and charts. 

## Development Setup

### Requirements
- A running instance of the [Urban Model Platform](https://github.com/citysciencelab/urban-model-platform)
- Docker

### Configuration
Most configuration of the AddOn and takes place in the [portalconfig](./portalconfig) folder. In the [config.js](./portalconfig/config.js) file, the following elements need to be specified:

| Configuration Variable       | Description                                                                                     | Example                                      |
|------------------------------|-------------------------------------------------------------------------------------------------|----------------------------------------------|
| `addons`                     | A list of addons to be used in the scenario explorer.                                           | `["simulationTool"]`                       |
| `simulationApiUrl`           | The URL of the Urban Model Platform API used for simulation.                                    | `https://api.simulation.com`                 |
| `login`                      | Configuration parameters for login, including sub-variables:                                    |                                              |
| - `oidcAuthorizationEndpoint`| The URL for the OIDC authorization endpoint.                                                    | `https://auth.example.com/authorize`         |
| - `oidcTokenEndpoint`        | The URL for the OIDC token endpoint.                                                            | `https://auth.example.com/token`             |
| - `oidcClientId`             | The client ID for OIDC authentication (typically set up in the Keycloak instance)               | `scenario-explorer`                           |
| - `oidcRedirectUri`          | The redirect URI for OIDC authentication (localhost when in development)                        | `http://localhost/portal/simulation/`           |
| - `oidcScope`                | The scope for OIDC authentication.                                                              | `"openid"`                       |
| - `interceptorUrlRegex`      | A regex pattern to match URLs that should be intercepted.                                       | `^https://api\.example\.com/.*$`             |



### Starting Development with Docker Compose

To start the development environment using Docker Compose, follow these steps:

1. Ensure Docker and Docker Compose are installed on your machine.
2. Navigate to the root directory of the `scenario-explorer-addon` repository.
3. Run the following command to start the services defined in the `docker-compose.yml` file:

```sh
docker-compose up
```

This command will build and start the necessary containers for the Scenario Explorer AddOn. Once the process is complete, the application should be accessible at `http://localhost/portal/simulation`.

To stop the running containers, use the following command:

```sh
docker-compose down
```

This will stop and remove the containers, networks, and volumes created by `docker-compose up`.


### Modifying Existing Phrasing

If existing text content from any component in the addon needs to be modified, this must be done in the JSON files from the `locales` folder under `scenario-explorer-addon/simulationTool/locales`. Here you can find a json document for each supported language. The `keys` of the `simulationTool` object are referenced in the application. These must remain unchanged. However, the `values` can be adjusted to change the existing texts.

## Help-Section

### Adding more items

To add more items, the component HelpPanel.vue needs to be modified under `scenario-explorer-addon/simulationTool/components/HelpSection/HelpPanel.vue`. The data() section within the `<script>` block returns an object with three keys: `definitions`, `faqsApplication`, and `faqsPrivacy`. These contain the questions and answers from the glossary and the FAQ (both for application-related and privacy-related topics). To add new questions and answers, simply add a new object 
```
{
    question: 'This is my question', 
    answer: 'This is my answer'
}
``` 
to the respective array.

Both the master portal and the addon currently support German and English languages. If this is to remain the case for help content and accordingly for questions and answers, the i18n library must still be used. In this case, the object would look as follows instead of what was previously described: 
```
{
    question: this.$t('additional:modules.tools.simulationTool.MyNewQuestion'), 
    answer: this.$t('additional:modules.tools.simulationTool.MyNewAnswer')
}
```

This way, the translation files under `scenario-explorer-addon/simulationTool/locales` are referenced. There is a separate JSON file for each language. The parameters `MyNewQuestion` and `MyNewAnswer` must appear as keys in the translation files. The value will then be the respective text:

```
"MyNewQuestion": "This is my question",
"MyNewAnswer": "This is my answer"
```

## Tutorial-Section

The images from the tutorial section still originate from the mockups. If these are to be updated, the respective image must be replaced under `scenario-explorer-addon/simulationTool/resources/img`. The images have the same names as the corresponding Vue components to make the association easier. If the name of an image is changed, the name must also be adjusted in the corresponding Vue component.
