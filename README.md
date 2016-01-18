# vile-brakeman

A [vile](http://vile.io) plugin for [brakeman](http://github.com/presidentbeef/brakeman).

## Requirements

- [nodejs](http://nodejs.org)
- [npm](http://npmjs.org)
- [ruby](http://nodejs.org)
- [rubygems](http://rubygems.org)

## Installation

Currently, you need to have brakeman installed manually.

Example:

    npm i vile-brakeman
    gem install brakeman

Note: A good strategy is to use [bundler](http://bundler.io).

## Configuration

Currently, you have to do all your config via a `.brakeman.yml` config file.

You can specify the config file path like this:

```yml
brakeman:
  config: .brakeman.yml
```

## Architecture

This project is currently written in JavaScript. Brakeman provides
a JSON CLI output that is currently used until a more ideal
IPC option is implemented.

- `bin` houses any shell based scripts
- `src` is es6+ syntax compiled with [babel](https://babeljs.io)
- `lib` generated js library
- `test` any test related code written in coffeescript
- `.test` generated js test code

## Hacking

    cd vile-brakeman
    npm install
    gem install brakeman
    npm run dev
    npm test
