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

To finish the setup, run:
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

After running all those commands, you'll have access to these webpages:

1. Website - [localhost:3000](http://localhost:3000)
2. UI library ([storybook](https://github.com/storybookjs/storybook/)) - [localhost:3001](http://localhost:3001)
3. DB console ([pgweb](https://github.com/sosedoff/pgweb)) - [localhost:3002](http://localhost:3002)
4. DB ([postgres](https://github.com/postgres/postgres)) - *localhost:5432*
5. Object storage console - [localhost:3003](http://localhost:3003)
6. Object storage ([minio](https://github.com/minio/minio)) - *localhost:9000*
