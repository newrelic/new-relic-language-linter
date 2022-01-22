# NR Language linter demo
Like Grammarly for people who write New Relic UI copy, but focused on writing-style more than grammar. This is project is a WIP.

### 🧐 What is this?
It's a tool built for designers, engineers and anyone else who writes NR1 copy. Why? So that they can vet their copy for basic issues like passive voice, deprecated terms, insensitive language, and more. This way we can reserve the time of our friends in [#ui-writing](https://newrelic.slack.com/archives/CE7FX92TF) for more in-depth language issues.

### 🖋️ What rules does this demo use?
I picked some of the [out of the box rules](https://unifiedjs.com/explore/keyword/retext-plugin/) for this demo, but in addition to being able to [create our own rules](https://unifiedjs.com/learn/guide/create-a-plugin/), we can customize the existing ones. Here are the rules used in this demo:

- [Contractions](https://unifiedjs.com/explore/package/retext-contractions/)
- [Repeated words](https://unifiedjs.com/explore/package/retext-repeated-words/)
- [Equality](https://unifiedjs.com/explore/package/retext-equality/)
- [Indifinite article](https://unifiedjs.com/explore/package/retext-indefinite-article/)
- [Readability](https://unifiedjs.com/explore/package/retext-readability/)
- [Sentence spacing](https://unifiedjs.com/explore/package/retext-sentence-spacing/)
- [Passive voice](https://unifiedjs.com/explore/package/retext-passive/)

### 💬 I have questions or ideas
Reach out to me on slack [@dgolden](https://newrelic.slack.com/archives/DJZP8JQ8M) 👋🏽 or email me (danielgolden90[at]gmail.com). I'd love to hear/talk about them.
