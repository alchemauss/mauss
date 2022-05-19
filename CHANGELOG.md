# mauss changelog

## Unreleased

- ([#104](https://github.com/alchemauss/mauss/pull/104)) overhaul `random` namespace in utils module
- ([#102](https://github.com/alchemauss/mauss/pull/102)) overhaul `dt` namespace in utils module
- ([#101](https://github.com/alchemauss/mauss/pull/101)) add nicer `qse` output handling
- ([#95](https://github.com/alchemauss/mauss/pull/95)) overhaul `cookies` namespace in web module
- ([#91](https://github.com/alchemauss/mauss/pull/91)) initialize `comparators` typings
- ([#91](https://github.com/alchemauss/mauss/pull/91)) add `compare.key` method in core module
- ([#90](https://github.com/alchemauss/mauss/pull/90)) add `curry` function in core module
- ([#86](https://github.com/alchemauss/mauss/pull/86)) strongly type `debounce` and `throttle`
- ([#81](https://github.com/alchemauss/mauss/pull/81)) add fallback parameter to `tryNumber`
- ([#79](https://github.com/alchemauss/mauss/pull/79)) change `.y*ml` prettier formatting options
- ([#73](https://github.com/alchemauss/mauss/pull/73)) add `pipe` function in core module
- ([#72](https://github.com/alchemauss/mauss/pull/72)) strongly infer `inverse` return type
- ([#72](https://github.com/alchemauss/mauss/pull/72)) add `UnaryFunction` typings
- ([#72](https://github.com/alchemauss/mauss/pull/72)) fix default generic value of `AnyFunction` typing
- ([#72](https://github.com/alchemauss/mauss/pull/72)) change generic order of `Tuple` and only require the size
- ([#65](https://github.com/alchemauss/mauss/pull/65)) change `qpm` to `qse` in `/web` module
- ([#65](https://github.com/alchemauss/mauss/pull/65)) add query string decoder in `/web` module

### Breaking Changes

- [#104](https://github.com/alchemauss/mauss/pull/104) | Added generator parameter to `random.uuid`
- [#102](https://github.com/alchemauss/mauss/pull/102) | Overhauled `dt` namespace
  - `now` getter has been removed
  - `new` has been renamed to `current`
  - `format` is now a curried function that needs to be called 3 times, from passing the options first, then the Date value, and finally the mask to be formatted
- [#95](https://github.com/alchemauss/mauss/pull/95) | Overhauled `cookies` namespace
  - `raw` method is now a standalone function outside of parsed object
  - `create` is now a curried function that takes in the options first
- [#79](https://github.com/alchemauss/mauss/pull/79) | Prettier for `.y*ml` files will now format with spaces and single quotes
- [#72](https://github.com/alchemauss/mauss/pull/72) | Generic order for `Tuple` is reversed and reduced to only require the final size
- [#65](https://github.com/alchemauss/mauss/pull/65) | Query string encoder (previously query string pathname maker) is now platform agnostic and does not rely on `window.location`, and returns the generated query string without the leading `?`

## 0.2.3 - 2022/02/17

- ([#64](https://github.com/alchemauss/mauss/pull/64)) remove `svelteBracketNewLine` option from prettier config
- ([#63](https://github.com/alchemauss/mauss/pull/63)) add `Flexible` typings
- ([#63](https://github.com/alchemauss/mauss/pull/63)) fix bool generator in `random`

## 0.2.2 - 2022/02/11

- ([#61](https://github.com/alchemauss/mauss/pull/61)) fix mismatched `unique` return type
- ([#60](https://github.com/alchemauss/mauss/pull/60)) fix `new` property getting mixed-up as constructor for `dt`

## 0.2.1 - 2022/02/09

- ([#59](https://github.com/alchemauss/mauss/pull/59)) add super compact tz offset, allowing from 1 up to 3 `Z`s
- ([#58](https://github.com/alchemauss/mauss/pull/58)) fix `TypeError` in `dt.format` not having reference to `this`

### Notes

- [#59](https://github.com/alchemauss/mauss/pull/59) | Allow `Z` to be defined from 1 up to 3 times in `dt.format` mask, with `Z` only showing the hour without padded zeros

## 0.2.0 - 2022/02/08

- ([#57](https://github.com/alchemauss/mauss/pull/57)) augmenting `guards` module
- ([#56](https://github.com/alchemauss/mauss/pull/56)) add `inverse` core function
- ([#56](https://github.com/alchemauss/mauss/pull/56)) add `AnyFunction` and `Reverse` typings
- ([#55](https://github.com/alchemauss/mauss/pull/55)) add `dt` object in `utils` module
- ([#54](https://github.com/alchemauss/mauss/pull/54)) rework `capitalize` options
- ([#52](https://github.com/alchemauss/mauss/pull/52)) add `Only`, `Either`, and `Tuple` typings
- ([#52](https://github.com/alchemauss/mauss/pull/52)) add `uuid` method to random
- ([#48](https://github.com/alchemauss/mauss/pull/48)) add `unique` utility function
- ([#47](https://github.com/alchemauss/mauss/pull/47)) remove default exports except `api` module
- ([#44](https://github.com/alchemauss/mauss/pull/44)) enable `checkJs` and `resolveJsonModule`

### Breaking Changes

- [#44](https://github.com/alchemauss/mauss/pull/44) | Projects that extends `mauss/tsconfig.json` will now have their JS files checked by TS
- [#47](https://github.com/alchemauss/mauss/pull/47) | All default exports (except `/api`) has been removed, do an import star instead (`import * as module from 'mauss/module'`)
- [#54](https://github.com/alchemauss/mauss/pull/54) | Second parameter of `capitalize` now receives an object, with all values being optional
- [#57](https://github.com/alchemauss/mauss/pull/57) | Guards module has been refactored
  - `isExists` has been renamed to `truthy`, behaviour stays exactly the same as before
  - `exists` will actually check if the value exists, everything except `''`, `null`, and `undefined` is `true`
  - `notNullish` has been reimplemented to `nullish`, to get the previous behaviour, use `not(nullish)` instead

## 0.1.6

- ([#40](https://github.com/alchemauss/mauss/pull/40)) add drop-in regexp replacement
- ([#39](https://github.com/alchemauss/mauss/pull/39)) add query string pathname maker

## 0.1.5

- ([#38](https://github.com/alchemauss/mauss/pull/38)) provide deep export mappings
- ([#32](https://github.com/alchemauss/mauss/pull/32)) add more utility typings

## 0.1.4

- ([#29](https://github.com/alchemauss/mauss/pull/29)) improve inspector module
- ([#24](https://github.com/alchemauss/mauss/pull/24)) update svelte prettier options

## 0.1.3

- ([#23](https://github.com/alchemauss/mauss/pull/23)) fix `TypeError` on cookies parse object

## 0.1.2

- ([#22](https://github.com/alchemauss/mauss/pull/22)) fix handling of empty and undefined cookies
- ([#22](https://github.com/alchemauss/mauss/pull/22)) add read-only methods for cookies parse

## 0.1.1

- ([#21](https://github.com/alchemauss/mauss/pull/21)) workaround vite bug for `cookies` and `find`
- ([#21](https://github.com/alchemauss/mauss/pull/21)) polyfill default exports as if importing with `* as`
- ([#21](https://github.com/alchemauss/mauss/pull/21)) remove additional semicolon in cookies creation

## 0.1.0

- Initial public alpha release
