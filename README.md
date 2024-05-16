# khenzii-dev

This README is not yet ready, however I'll write it eventually..

## Dev Env Setup

### Installation

You'll need to get those tools:

1. [docker](https://github.com/docker/cli), with [compose](https://github.com/docker/compose) plugin.
2. [node.js](https://github.com/nodejs/node), with [yarn](https://github.com/yarnpkg/yarn).

After installing them, fetch app's dependencies:

```shell
$ yarn install
```

And finish the setup with:
```shell
$ yarn prepare
```

### Usage

Start third party services:

```shell
$ docker compose up
```

*If you don't want to lose control over your terminal, you can use the --detach flag*

Start the app:

```shell
$ yarn dev
```

Start UI library:

```shell
$ yarn storybook
```

And the DB console: 

```shell
$ yarn db-studio
```

After running all those commands, you'll have access to these webpages:

1. Website - [localhost:3000](http://localhost:3000)
2. UI library ([storybook](https://github.com/storybookjs/storybook/)) - [localhost:3001](http://localhost:3001)
3. DB console ([prisma studio](https://github.com/prisma/studio)) - [localhost:3002](http://localhost:3002)
4. DB ([mongo](https://github.com/mongodb/mongo)) - *localhost:27017*
5. Object storage console - [localhost:3003](http://localhost:3003)
6. Object storage ([minio](https://github.com/minio/minio)) - *localhost:9000*
