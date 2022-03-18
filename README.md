<img src="https://user-images.githubusercontent.com/11739105/152803355-69bfce13-e6ee-4f7b-a53e-6cee391e0273.svg" alt="Relisio Product"  width="128" />

This Github action is an official [Relisio](https://www.relisio.com/) deploy utility.<br />
Use it to create new deployment projects and release your products within your workspace.

### Prerequisites
 1. an active workspace at [www.relisio.com](https://www.relisio.com) or a self-hosted copy of Relisio;
 2. an `api-key` authorized to **Create Projects** (in Relisio, go to workspace settings, Api Keys to generate one);
 3. a GitHub repository configured to run Actions;

### Before you start

 1. consider that Relisio is currently in Beta, and breaking changes may occur at any time,
 2. the `api-key` can be generated (and destroyed) from your workspace settings,
 3. if you intend to update a product (instead of creating a new one), you must specify the `product-template-id` input,
 4. optionally you may use this action together with 
    - `Studio-41/relisio-artefact-action@v1`
    - `Studio-41/relisio-product-action@v1`

### Available inputs

|id|description|required|default|
|---|---|:---:|:---:|
|relisio-url| Relisio base url (only for self-hosted or enterprise installations)|false|https://relisio.com|
|api-key| API key to authorize the deployment|true|
|workspace-path| Path of the Workspace where to publish the Product|true|
|product-id| ID of an existing product withing the workspace to include into the project and publish as part of the release|true|
|environment-name|The name of the environment to be included in the project. Relisio combines the product with the environment to present a unified release note considering both characteristics. If you want to deploy a matrix of releases for the same product, you can use a regex to match the name of all the environments for which to create a new release.|false|
|environment-type|The type of environment to be included in the project. This value can be used without or without the environment-name to better filter the list of environments to include in the release. (`Development`, `Testing`, `QA`, `Training`, `Pre`, `Production`, `Unspecified`, `*`)|false|Unspecified|
|version| Visibility of the product withing the workspace (private, internal or public)|true|internal|
|trigger-notifications| Trigger Notification tells Relisio to notify all the interested actors of the new release. Trigger Notification tells Relisio to notify all the interested actors of the new release. The notification includes all the authors, associated licensees and eventual internal contacts having email associated|false|false
|project-scope| Visibility of the release(s) created by this action (private, internal or public)|true|internal|
### Available outputs

|id|description|
|---|:---|
|project-ids|A string representing the ids of the created projects (`id1, id2, ..., idN`).
|public-urls|A string representing the public URLs of the created projects (`url1, url2, ..., urlN`) (visible depending on the selected `scope`)|
|created-projects|The number of created projects within this action|

## Deploy a new project

By creating a new Git Tag (having `v` prefix), this example combines a product having ID `123456` with an `production` environment named `MacOs` and publishes as `public` (accessible from the team workspace).

```yaml
on:
  push:
    tags:
      - "v*"

jobs:
  deloy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy As Relisio Product 
      uses: Studio-41/relisio-project-action@v1
      with:
        api-key: ${{ secrets.RELISIO_API_KEY }}
        workspace-path: ${{ secrets.RELISIO_WORKSPACE }}
        product-id: 123456
        project-scope: public
        version: Pre-Release
        environment-name: MacOs
        environment-type: production
```

## Create multiple releases of the same product
The following example assumes multiple environments are configured within the name **Dental clinic**. The type selector specifies the "**`*`**" value, telling Relisio to create a project for all the available **Dental clinic' environments**. <br/><br/>Separate communication will be created for each project, generating contextual emails.

```yaml
on:
  release:
    types: [published]

jobs:
  deloy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy As Relisio Product 
      uses: Studio-41/relisio-project-action@v1
      with:
        api-key: ${{ secrets.RELISIO_API_KEY }}
        workspace-path: ${{ secrets.RELISIO_WORKSPACE }}
        product-id: 123456
        version: ${{ github.event.release.name }}
        project-scope: public
        environment-name: Dental clinic
        environment-type: *
        trigger-notifications: true
```

## Create releases for the "training" environments
The following example creates a release for the product **123456** for each **`Training`** environment present in the workspace.

```yaml
on:
  release:
    types: [published]

jobs:
  deloy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy As Relisio Product 
      uses: Studio-41/relisio-project-action@v1
      with:
        api-key: ${{ secrets.RELISIO_API_KEY }}
        workspace-path: ${{ secrets.RELISIO_WORKSPACE }}
        product-id: 123456
        version: ${{ github.event.release.name }}
        project-scope: public
        environment-type: training
        trigger-notifications: true
```
<hr/>

### <img src="https://user-images.githubusercontent.com/11739105/156749223-0a34348c-2155-4599-8b51-778cb9c91d50.svg" alt="Artifact" width="32"> Work with Relisio Artefacts

You can optionally configure your GitHub Workflow to upload **any artefact** as part of the new release (or product) using `Studio-41/relisio-artefact-action@v1` ([more details](https://github.com/marketplace/actions/upload-an-artefact-to-relisio)).


### <img src="https://user-images.githubusercontent.com/11739105/152799348-e70d55f4-3914-43cd-866f-f2b979071be2.svg" alt="Product" width="32"> Work with Relisio Products

If you want to publish a new product as part of the release, use the Product action `Studio-41/relisio-product-action@v1` ([more details](https://github.com/marketplace/actions/update-relisio-product-portfolio)).

<hr/>

### <img src="https://user-images.githubusercontent.com/11739105/152805812-261613f7-1357-4f01-b3e8-ed6d613c3577.svg" alt="Project" width="32"> Professional support is available
 Relisio is a Studio 41 Software Design S.L. product.<br/><br/>
Enterprise service is available for organizations wanting to implement Relisio into their current CI pipeline.<br/><br/>
Contact us at <a href="mailto:info@41.studio">info@41.studio</a>. We will do our best to assist you with Relisio related automation or queries.
