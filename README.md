# scenario-explorer-addon
The Scenario Explorer Masterportal AddOn Code Repository

# Modifying Existing Phrasing

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
