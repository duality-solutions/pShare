import installExtension, { ExtensionReference } from 'electron-devtools-installer'

export const installExtensionsAsync = (extensions: Iterable<ExtensionReference>) =>
    Promise.all([...extensions].map(x => installExtension(x)))
        .catch(err => console.log('An error occurred: ', err))
        .then(results => results && results.forEach(extensionName => console.log(`Successfully installed devtool [${extensionName}]`)))