# hdCRM

## Table of contents

  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Required Build Environment (Minimum)](#required-build-environment-minimum)
  - [Required Development Tools](#required-development-tools)
  - [Cloning The hdCRM Project](#cloning-the-hdcrm-project)
  - [Local Installation](#local-installation)
  - [Running Development](#running-development)
  - [Gulp Tasks](#gulp-tasks)
  - [Building Development Instance](#building-development-instance)
  - [Commit Message Guidelines](#commit-message-guidelines)
  - [Commit Message Format](#commit-message-format)
  - [Pushing to the repository](#pushing-to-the-repository)
  - [Pull Request Message Format](#pull-request-message-format)
  - [Contribution Guidelines](#contribution-guidelines)
  - [Authors](#authors)

## Introduction

> hdCRM is an ERP software designed to streamline business operations

## Required Build Environment (Minimum)

[Node.js v12.x](https://nodejs.org/en/)

[npm v6.14.x](https://www.npmjs.com/)

[Gulp](https://gulpjs.com/)

[PostgreSQL v12.x](https://www.postgresql.org/)

## Required Development Tools

[Visual Studio Code](https://code.visualstudio.com)

[Git](https://git-scm.com)

[pgAdmin](https://www.pgadmin.org) (will be installed with PostgreSQL)

Visual Studio Code Extensions:

- Angular 8 Snippets - TypeScript, Html, SCSS, Angular Material, ngRx, RxJS & Flex Layout
- Prettier - code formatter
- Debugger for Chrome
- GitLens — Git supercharged
- TSLint
- ESLint
- EditorConfig for VS Code

## Cloning The hdCRM Project

Use git clone in terminal:

```
git clone https://github.com/IMalaniak/hdCRM.git
```

or use the following link:

> [https://github.com/IMalaniak/hdCRM.git](https://github.com/IMalaniak/hdCRM.git)

## Local Installation

1. Navigate to the root folder of the repository and run the following command:

```
npx gulp installAll
```
or with alias
```
npx gulp ia
```
> This will install all of the dependencies of server and web applications.

2. Run the `pgAdmin` tool and create a new database

3. Create file `.env` in the server folder and configure it as an example of `.env.sample` providing database credentials and database name

> Note, that every change in `.env` file needs a server restart

<!-- 4. Run command npm run prepare-db:dev script to prepare local db -->

## Running Development

1) Use the following command to run Server locally

```
npx gulp server:dev
```

> This will run server locally on http://localhost:3000

2) Use the following command to run Web Client locally

```
npx gulp client:dev
```

> This will open browser automatically on http://localhost:4200

## Gulp Tasks

Use the following command to get all available gulp tasks:

```
npx gulp --tasks
```

### The most common used tasks to remember

```
npx gulp lintAll              // Lints all project
npx gulp formatAll            // Formats all project
npx gulp installAll           // Runs npm install on all project

npx gulp server:lint          // Lints server
npx gulp server:format        // Formats server
npx gulp server:install       // Runs npm install on server

npx gulp web:lint             // Lints web client
npx gulp web:format           // Formats web client
npx gulp web:install          // Runs npm install on web client
```

## Building Development Instance

To build server and client applications you can run the following command:

```
npx gulp buildAll
```

> This will create bundles in the `dist` folders accordingly in server and web folders.

## Commit Message Guidelines

We must create commit messages according to the following rules

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **perf**: A code change that improves performance
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **memo**: A doc writing

## Commit Message Format

Each commit message consists of a header and a body. The header has a special format that includes a type, a scope, and a subject:

```
<type>(<scope>): <subject>
<BLANK LINE>

<body>
<BLANK LINE>
```

The header is mandatory and the scope should be GitHub task id or external. The body is not mandatory

Example:

```
fix(#1234): subject message

- Fixed component etc.
```

### Scope

The scope should be the id of the GitHub tasks. If we have no task, we can use `external`

- **GitHub task id**
- **external**
- **build**

```
feat(#1234): add new feature
```

- **external**

```
feat(external): change something externally
```

### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body, it should say: `These reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

```
revert: "fix(#1234): subject message"

These reverts commit <hash>.
```

### Cherry Pick

```
cherry-pick: "fix(#1234): subject message"
```

## Pushing to the repository

When pushing to the repo there is a Husky tool configured to check prettier style and tslint rules are passed, whenever some exceptions it will be not possible to push the branch.

There are only two possible issues:
- code is not formatted or does not meet the tslint requirements
- somewhere you have `dist` folder and you have to delete it, we will add the ignore rule for the dist folders for prettier in the future

Sometimes you may want to push changes to the repo and skip Husky verifying process that is HIGHLY NOT RECOMENDED, but anyway, if there is a situation, you can use the following command:

```
git push --no-verify
```

## Pull Request Message Format

We must create pull request message according to the following rules.

Each pull request messages consists of a header and a body. The header has a special format that includes a type, a scope, and a subject:

```
<type>(<scope>): <subject>
<BLANK LINE>

<body>
<BLANK LINE>
```

The header is mandatory and the scope should be GitHub task id or external. The body has to contain fixing keyword: **`resolves #taskId`**

Example:

```
fix(#1234): subject message

resolves #1234
```

## Contribution Guidelines

> Every contribution to project requires pull request to be created

### Branch Creating Process

We must create new branch according to the following rules

Each new branch must be created from **`dev`** branch and need to have a special format that includes a type and a scope:

```
<type>/<scope>
```

Example:

```
feat/#1234
```

Use [type](#type) examples for the **`type`**

### Scope

The scope should be the id of the GitHub tasks

- **GitHub task id**

### Pull Request Process
   
1. Once you published your branch to the repo, the **`Compare & pull request`** button will appear in [GitHub](https://github.com/)
   
2. Follow the [pull request message format](#pull-request-message-format)

3. Follow next steps:

   - Request responsible reviewers
   - Assign related developers
   - Add labels
   - Add related project

## Authors



| ![Ivan Malaniak](https://github.com/IMalaniak.png?size=200) | ![Arsenii Irod](https://github.com/ArseniiIrod.png?size=200) |
| ----------------------------------------------------------- | ------------------------------------------------------------ |
| **Ivan Malaniak**                                           | **Arsenii Irod**                                             |
| [github/IMalaniak](https://github.com/IMalaniak)            | [github/ArseniiIrod](https://github.com/ArseniiIrod)         |
| [ivanmalaniak.pp.ua](https://ivanmalaniak.pp.ua)            |                                                              |
