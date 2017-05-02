# vile-brakeman [![Circle CI](https://circleci.com/gh/forthright/vile-brakeman.svg?style=shield&circle-token=5680dde9902c1f68684173ee1e9ead2fd4b43df2)](https://circleci.com/gh/forthright/vile-brakeman) [![Build status](https://ci.appveyor.com/api/projects/status/8ts46knfcv1iod3k/branch/master?svg=true)](https://ci.appveyor.com/project/brentlintner/vile-brakeman/branch/master) [![score-badge](https://vile.io/api/v0/projects/vile-brakeman/badges/score?token=USryyHar5xQs7cBjNUdZ)](https://vile.io/~brentlintner/vile-brakeman) [![security-badge](https://vile.io/api/v0/projects/vile-brakeman/badges/security?token=USryyHar5xQs7cBjNUdZ)](https://vile.io/~brentlintner/vile-brakeman) [![coverage-badge](https://vile.io/api/v0/projects/vile-brakeman/badges/coverage?token=USryyHar5xQs7cBjNUdZ)](https://vile.io/~brentlintner/vile-brakeman) [![dependency-badge](https://vile.io/api/v0/projects/vile-brakeman/badges/dependency?token=USryyHar5xQs7cBjNUdZ)](https://vile.io/~brentlintner/vile-brakeman)

A [vile](http://vile.io) plugin for [brakeman](http://github.com/presidentbeef/brakeman).

## Requirements

- [nodejs](http://nodejs.org)
- [npm](http://npmjs.org)
- [ruby](http://nodejs.org)
- [rubygems](http://rubygems.org)

## Installation

Currently, you need to have brakeman installed manually.

Example:

    npm i -D vile vile-brakeman
    gem install brakeman

Note: A good strategy is to use [bundler](http://bundler.io).

## Configuration

Currently, you have to do all your config via a `.brakeman.yml` config file.

You can specify the config file path like this:

```yaml
brakeman:
  config: .brakeman.yml
```

## Versioning

This project ascribes to [semantic versioning](http://semver.org).

## Licensing

This project is licensed under the [MPL-2.0](LICENSE) license.

Any contributions made to this project are made under the current license.

## Contributions

Current list of [Contributors](https://github.com/forthright/vile-brakeman/graphs/contributors).

Any contributions are welcome and appreciated!

All you need to do is submit a [Pull Request](https://github.com/forthright/vile-brakeman/pulls).

1. Please consider tests and code quality before submitting.
2. Please try to keep commits clean, atomic and well explained (for others).

### Issues

Current issue tracker is on [GitHub](https://github.com/forthright/vile-brakeman/issues).

Even if you are uncomfortable with code, an issue or question is welcome.

### Code Of Conduct

This project ascribes to [contributor-covenant.org](http://contributor-covenant.org).

By participating in this project you agree to our [Code of Conduct](CODE_OF_CONDUCT.md).

### Maintainers

- Brent Lintner - [@brentlintner](http://github.com/brentlintner)

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
