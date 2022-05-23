
### Theme
The theme can be extended   
```const theme = extendTheme({ colors })```

Quote:
If custom styling is not a major concern for your project,
Material UI is beneficial as you can avoid the creation of custom components
that the library provides.
If scalable, custom designs are important for your project (which oftentimes they are),
Chakra's developer convenience shines brighter than Material UI's
especially as a project scales over time.

Quote:
Chakra UI uses CSS-in-JS under the hood (emotion + styled-system)   
This flexibility comes with a small price to pay when it comes to runtime.

Styling supports pseudo elements (ex: _hover)
https://chakra-ui.com/docs/styled-system/features/style-props?scroll=true#pseudo

The theme is converted to CSS variables (ex: --chakra-fontSizes-lg: '18px';)   
https://chakra-ui.com/docs/styled-system/features/css-variables#converting-theme-tokens-to-css-variables
which means they can be re-used outside chakra-ui


**Text & Layer Styles** allows reusing groups of props (for DRY)  
https://chakra-ui.com/docs/styled-system/features/text-and-layer-styles#layer-style


# ZOD Requirements
```
TypeScript 4.1+!  
You must enable strict mode in your tsconfig.json.
This is a best practice for all TypeScript projects.
```
