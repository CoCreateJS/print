# CoCreate-print

Highlights syntax within a textarea. Easily configured using HTML5 attributes and/or JavaScript API. Take it for a spin in our [playground!](https://cocreate.app/docs/print)

![min file size in bytes](https://img.badgesize.io/https://cdn.cocreate.app/print/latest/CoCreate-print.min.js?style=flat-square&label=minified&color=orange)
![gzip file size in bytes](https://img.badgesize.io/https://cdn.cocreate.app/print/latest/CoCreate-print.min.js?compression=gzip&style=flat-square&label=gzip&color=yellow)
![brotlifile size in bytes](https://img.badgesize.io/https://cdn.cocreate.app/print/latest/CoCreate-print.min.js?compression=brotli&style=flat-square&label=brotli)
![GitHub latest release](https://img.shields.io/github/v/release/CoCreate-app/CoCreate-print?style=flat-square)
![GitHub](https://img.shields.io/github/license/CoCreate-app/CoCreate-print?style=flat-square)
![GitHub](https://img.shields.io/static/v1?style=flat-square&label=&message=Hiring&color=blueviolet)

![CoCreate-print](https://cdn.cocreate.app/docs/CoCreate-print.gif)

## [Docs & Demo](https://cocreate.app/docs/print)

For a complete guide and working demo refer to the [doumentation](https://cocreate.app/docs/print)

## CDN

```html
<script src="https://cdn.cocreate.app/print/latest/CoCreate-print.min.js"></script>
```

```html
<script src="https://cdn.cocreate.app/print/latest/CoCreate-print.min.css"></script>
```

## NPM

```shell
$ npm i @cocreate/print
```

## yarn

```shell
$ yarn install @cocreate/print
```

# Table of Contents

-   [Table of Contents](#table-of-contents)
-   [Announcements](#announcements)
-   [Roadmap](#roadmap)
-   [How to Contribute](#how-to-contribute)
-   [About](#about)
-   [License](#license)

<a name="announcements"></a>

# Announcements

All updates to this library are documented in our [CHANGELOG](https://github.com/CoCreate-app/CoCreate-print/blob/master/CHANGELOG.md) and [releases](https://github.com/CoCreate-app/CoCreate-print/releases). You may also subscribe to email for releases and breaking changes.

<a name="roadmap"></a>

# Roadmap

If you are interested in the future direction of this project, please take a look at our open [issues](https://github.com/CoCreate-app/CoCreate-print/issues) and [pull requests](https://github.com/CoCreate-app/CoCreate-print/pulls). We would love to hear your feedback.

<a name="about"></a>

# About

CoCreate-print is guided and supported by the CoCreate Developer Experience Team.

Please Email the Developer Experience Team [here](mailto:develop@cocreate.app) in case of any queries.

CoCreate-print is maintained and funded by CoCreate. The names and logos for CoCreate are trademarks of CoCreate, LLC.

<a name="contribute"></a>

# How to Contribute

We encourage contribution to our libraries (you might even score some nifty swag), please see our [CONTRIBUTING](https://github.com/CoCreate-app/CoCreate-print/blob/master/CONTRIBUTING.md) guide for details.

We want this library to be community-driven, and CoCreate led. We need your help to realize this goal. To help make sure we are building the right things in the right order, we ask that you create [issues](https://github.com/CoCreate-app/CoCreate-print/issues) and [pull requests](https://github.com/CoCreate-app/CoCreate-print/pulls) or merely upvote or comment on existing issues or pull requests.

We appreciate your continued support, thank you!

## Print actions

Use `actions="print"` with `print-query` to print selected elements. Without an
`actions` attribute, `print-query` also works as a standalone click control.
Repeated initialization does not attach duplicate click handlers.

Printing copies current input, checkbox, textarea, and select values into an
isolated iframe, loads the page styles and images, and expands scroll containers
without changing the live view. The `printed` event is emitted from the trigger
and bubbles after the browser's print dialog closes (`afterprint`); it does not
indicate that the user actually printed rather than cancelled. Action chains
continue at that point. Failures emit `printError` and abort the chain. The print
iframe is removed on completion or failure.

# License

[The MIT License (MIT)](https://github.com/CoCreate-app/CoCreate-print/blob/master/LICENSE)
