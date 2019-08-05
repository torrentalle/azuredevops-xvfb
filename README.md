# Xvfb extension for Azure DevOps

This Azure DevOps extension adds new build tasks to manage and run Xvfm inside Build Agents.

This fature makes easies UI testing in Linux environments


## Building

You need node 10.x or grather to build this extension

```bash
npm install
npm run build
```

## Create extension

Be sure to manually increment the version number befor executing the create step in the files:

* [vss-extension.json](vss-extension.json)
* [tasks/StartXvfb/task.json](tasks/StartXvfb/task.json)

After installing dependencies and build the packagem you can create `vsix` package.

```bash
npm run create
```

## Testing

To run tests

```bash
rpm run test
```
