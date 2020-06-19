# hdCRM

## Introduction

> hdCRM is an ERP software designed to streamline business operations

## Required Build Environment (Minimum)

Node.js latest-v12.x

npm v6.14.x

PostgreSQL v12.x

## Required Development Tools

[Visual Studio Code](<[https://code.visualstudio.com/](https://code.visualstudio.com/)>)

[Git](<[https://git-scm.com/](https://git-scm.com/)>)

[pgAdmin](<[https://www.pgadmin.org/](https://www.pgadmin.org/)>)

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

1. This app will install all the required dependencies automatically. Just start the commands below in the root folder where you stored the package and in the `./webApp` folder

```
npm install
```

2. Run the `pgAdmin` tool and create a new database

3. Create file `.env` in the root folder and configure it as an example of `.env.sample` providing database credentials and database name

> Note, that every change in `.env` file needs a server restart

<!-- 4. run command npm run prepare-db:dev script to prepare local db -->

## Running Development

Use the following command to run Server App and Web App in one command:

```
npm run dev
```

This will open browser automatically on localhost:4200

## Building Development Instance

For building dev environment run:

```
npm build:dev
```

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

### Merge Commit Messages

```
merged commit <commit id> into <branch>
```

## Pull Request Message Format

We must create pull request message according to the following rules.

Each pull request messages consists of a header and a body. The header has a special format that includes a type, a scope, and a subject:

```
<type>/<#scope>-<subject>
<BLANK LINE>

<body>
<BLANK LINE>
```

The header is mandatory and the scope should be GitHub task id or external. The body is not mandatory

Example:

```
fix/#1234-subject message

- resolves #1234
```
