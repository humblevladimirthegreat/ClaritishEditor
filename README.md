# Claritish Editor

A browser-based plain text editor that checks your writing against [Claritish](https://www.reddit.com/r/ClarityLanguage/comments/14zzywg/introducing_claritish_modified_english_for/) — a modified form of English for journaling meant to foster clearer thought, compassion, and critical thinking.

Type in the text area, then click **Analyze** to see suggestions for places where Claritish conventions could be applied. Matches are underlined in the editor; hover for a quick tip or click for the full explanation. Your text is auto-saved in the browser; use **open** / **download** (or `Ctrl+O` / `Ctrl+S`) to work with files on disk.

## Criterion for Features

The goal of r/claritylanguage is to help foster compassion, rationality, and empowerment in its speakers, using language design techniques described in Language as a Cognitive Framework. I’ve decided to formalize requirements for adding new features to the language.

* Helps with Language Goals. The feature should help the speaker be more compassionate, rational, and/or empowered. Ideally there should be research to support that framing the language in this way helps, However, given the innovative nature of this language, research can be scarce, so user testing can be used instead. 

* Addresses a Common Problem. The feature should address cognitive bias(es) that happen in the majority of people. Implementing features for rarely-occurring problems makes the language more cumbersome for relatively little benefit.

* Easy to use. The feature should be explainable with a single paragraph and a couple of examples. The feature should be usable in sentences with at most one extra second of thought (after you’ve practiced it).

* Avoids shame. Features should avoid giving the impression that one option for the feature is generally more socially acceptable than another. Each feature option has cases where they should be used. Otherwise, a part of the feature might be avoided entirely, which would defeat the purpose.

* Reminders where they are needed. Ideally, the feature should encourage compassion, rationality, and/or empowerment only in cases where that is relevant - i.e. when we are likely to act uncompassionately, irrationally, and/or disempowered. There will be many false positives, but the feature should strive to minimize pointless applications.

## Running locally

Open `index.xhtml` in a browser. No build step required for normal use.

The editor bundles [CodeMirror 6](https://codemirror.net/) into `editor.bundle.js`. After changing `script.js`, rebuild with `npm install && npm run build`.

To lint the HTML: `npm install && npm run lint`

## Credits

Based on [Browserpad](https://github.com/browserpad/browserpad), an open-source browser notepad.

## License

Released under the [ISC License](LICENSE.md).
