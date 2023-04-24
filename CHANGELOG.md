# mauss changelog

## Unreleased

- ([#224](https://github.com/alchemauss/mauss/pull/224)) add string guards

## 0.4.11 - 2023/03/30

- ([#216](https://github.com/alchemauss/mauss/pull/216)) remove deprecated option for TS 5.0

## 0.4.10 - 2023/03/27

- ([#211](https://github.com/alchemauss/mauss/pull/211)) fix `ntv.keys` and `ntv.entries` always returns `string`
- ([#205](https://github.com/alchemauss/mauss/pull/205)) add `size` function to `ntv` namespace
- ([#204](https://github.com/alchemauss/mauss/pull/204)) add `scope` function
- ([#202](https://github.com/alchemauss/mauss/pull/202)) add `create` function to `ntv` namespace

## 0.4.9 - 2023/02/07

- ([#203](https://github.com/alchemauss/mauss/pull/203)) add `execute` function
- ([#203](https://github.com/alchemauss/mauss/pull/203)) export `identical` function
- ([#200](https://github.com/alchemauss/mauss/pull/200)) add `bulwark` to `/guards` module
- ([#197](https://github.com/alchemauss/mauss/pull/197)) add `zip` function to `ntv` namespace

## 0.4.8 - 2023/01/11

- ([#199](https://github.com/alchemauss/mauss/pull/199)) add `pick` function to `ntv` namespace
- ([#190](https://github.com/alchemauss/mauss/pull/190)) add better `ntv.iterate` return inference

## 0.4.7 - 2022/12/15

- ([#189](https://github.com/alchemauss/mauss/pull/189)) fix overly strict `unique` generic constraint

## 0.4.6 - 2022/12/07

- ([#187](https://github.com/alchemauss/mauss/pull/187)) add `clone` function for cloning variables
- ([#172](https://github.com/alchemauss/mauss/pull/172)) add second parameter to `unique` for object handling

## 0.4.5 - 2022/12/01

- ([#181](https://github.com/alchemauss/mauss/pull/181)) add `identical` function for values equality check
- ([#180](https://github.com/alchemauss/mauss/pull/180)) add default parameter to `iterate` callback for object deep copy

## 0.4.4 - 2022/11/29

- ([#182](https://github.com/alchemauss/mauss/pull/182)) add `Freeze` typings
- ([#179](https://github.com/alchemauss/mauss/pull/179)) fix `clipboard.copy` handler not allowing non-promise callbacks

## 0.4.3 - 2022/11/25

- ([#177](https://github.com/alchemauss/mauss/pull/177)) fix `Entries` possibly returning `undefined`
- ([#174](https://github.com/alchemauss/mauss/pull/174)) add `clipboard` object to `/web` module

## 0.4.2 - 2022/11/24

- ([#176](https://github.com/alchemauss/mauss/pull/176)) add empty/falsy filtering to `ntv.iterate`
- ([#175](https://github.com/alchemauss/mauss/pull/175)) fix function in `ntv.freeze` not callable

## 0.4.1 - 2022/11/16

- ([#170](https://github.com/alchemauss/mauss/pull/170)) fix infinite circularly referenced generated types

## 0.4.0 - 2022/11/14

- ([#160](https://github.com/alchemauss/mauss/pull/160)) add new `ntv` namespace to `/std` module
- ([#159](https://github.com/alchemauss/mauss/pull/159)) add `immediate` function
- ([#158](https://github.com/alchemauss/mauss/pull/158)) add convenience `set` cookie function
- ([#154](https://github.com/alchemauss/mauss/pull/154)) add `"plugins"` to prettier overrides
- ([#150](https://github.com/alchemauss/mauss/pull/150)) enable key drilling to `compare.key`
- ([#149](https://github.com/alchemauss/mauss/pull/149)) change url interpolation behaviour
- ([#147](https://github.com/alchemauss/mauss/pull/147)) add new CSV parser to `/std` module
- ([#147](https://github.com/alchemauss/mauss/pull/147)) new `"exports"` entry `'/std'`
- ([#140](https://github.com/alchemauss/mauss/pull/140)) overhaul `compare` to namespace

### Breaking Changes

- [#165](https://github.com/alchemauss/mauss/pull/165) | Removed `/bits/find` and `/math/set` exports
- [#165](https://github.com/alchemauss/mauss/pull/165) | Removed `find` namespace and export functions directly from `/bits`
- [#150](https://github.com/alchemauss/mauss/pull/150) | Make `.` a reserved character as delimiter for `compare.key`
- [#149](https://github.com/alchemauss/mauss/pull/149) | Removed implicit slash addition in `api` url interpolation
- [#140](https://github.com/alchemauss/mauss/pull/140) | Renamed and moved `comparator` to `compare.inspect`

## 0.3.3 - 2022/08/08

- ([#136](https://github.com/alchemauss/mauss/pull/136)) fix `random.uuid` implicitly calling crypto methods

## 0.3.2 - 2022/07/28

- ([#134](https://github.com/alchemauss/mauss/pull/134)) add `./typings` to `exports` field

## 0.3.1 - 2022/07/27

- ([#131](https://github.com/alchemauss/mauss/pull/131)) support native ESM resolution
- ([#116](https://github.com/alchemauss/mauss/pull/116)) add `compare.order` function in `/core` module
- ([#103](https://github.com/alchemauss/mauss/pull/103)) add `Definable`, `Difference`, and `IntersectUnion` typings

## 0.3.0 - 2022/07/11

- ([#122](https://github.com/alchemauss/mauss/pull/122)) fix `compare.wildcard` value comparison
- ([#110](https://github.com/alchemauss/mauss/pull/110)) add second parameter to `compare.key`
- ([#109](https://github.com/alchemauss/mauss/pull/109)) remove `esModuleInterop` and `allowSyntheticDefaultImports` option
- ([#104](https://github.com/alchemauss/mauss/pull/104)) overhaul `random` namespace in `/utils` module
- ([#102](https://github.com/alchemauss/mauss/pull/102)) overhaul `dt` namespace in `/utils` module
- ([#101](https://github.com/alchemauss/mauss/pull/101)) add nicer `qse` output handling
- ([#95](https://github.com/alchemauss/mauss/pull/95)) overhaul `cookies` namespace in `/web` module
- ([#91](https://github.com/alchemauss/mauss/pull/91)) initialize `comparators` typings
- ([#91](https://github.com/alchemauss/mauss/pull/91)) add `compare.key` method in `/core` module
- ([#90](https://github.com/alchemauss/mauss/pull/90)) add `curry` function in `/core` module
- ([#86](https://github.com/alchemauss/mauss/pull/86)) strongly type `debounce` and `throttle`
- ([#81](https://github.com/alchemauss/mauss/pull/81)) add fallback parameter to `tryNumber`
- ([#79](https://github.com/alchemauss/mauss/pull/79)) change `.y*ml` prettier formatting options
- ([#73](https://github.com/alchemauss/mauss/pull/73)) add `pipe` function in `/core` module
- ([#72](https://github.com/alchemauss/mauss/pull/72)) strongly infer `inverse` return type
- ([#72](https://github.com/alchemauss/mauss/pull/72)) add `UnaryFunction` typings
- ([#72](https://github.com/alchemauss/mauss/pull/72)) fix default generic value of `AnyFunction` typing
- ([#72](https://github.com/alchemauss/mauss/pull/72)) change generic order of `Tuple` and only require the size
- ([#65](https://github.com/alchemauss/mauss/pull/65)) change `qpm` to `qse` in `/web` module
- ([#65](https://github.com/alchemauss/mauss/pull/65)) add query string decoder in `/web` module

### Breaking Changes

- [#109](https://github.com/alchemauss/mauss/pull/109) | Removed `esModuleInterop` and `allowSyntheticDefaultImports` option
- [#104](https://github.com/alchemauss/mauss/pull/104) | Added generator parameter to `random.uuid`
- [#102](https://github.com/alchemauss/mauss/pull/102) | Overhauled `dt` namespace
  - `now` getter has been removed
  - `new` method has been renamed to `current`
  - `format` is now a [curried function (#115)](https://github.com/alchemauss/mauss/pull/115)
  - `build` is a [new function (#115)](https://github.com/alchemauss/mauss/pull/115) that builds a formatter
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
