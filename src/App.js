import "./App.css";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";

import LanguageLinter from "new-relic-language-linter";

// import { reporter } from "vfile-reporter";

function App() {
  const [sampleText, setSampleText] = useState(
    `On the Entity Overview screen you can sort the entities that you are analysing by colour.  Looking for an an dashboard idea that other customers have found helpful? We've got you, guys. 3000 templates are made available every month.`
  );

  const handleTextAreaOnChange = (value) => {
    setSampleText(value);
  };

  return (
    <div className="app-container">
      <div className="primary-section">
        <header>
          <h1 className="page-title">New Relic Language linter</h1>
          <p>
            Like Grammarly for New Relic UI copy, but focused on writing-style
            rather than grammar.
          </p>
        </header>
        <div className="primary-section-body">
          <form className="form-container">
            <CodeMirror
              value={sampleText}
              onChange={(value) => handleTextAreaOnChange(value)}
              height="300px"
              width="100%"
              extensions={[EditorView.lineWrapping]}
              basicSetup={false}
              autoFocus={true}
              placeholder="Write or paste your text here..."
            />
          </form>
          <hr className="standard-hr" />
          <div className="about">
            <h3>🧐 What's this for?</h3>
            <p>
              It's a tool built for designers, engineers and anyone else who
              writes NR1 copy. Why? So that they can vet their copy for basic
              issues like passive voice, deprecated terms, insensitive language,
              and more. This way we can reserve the time of our awesome {` `}
              <a href="https://newrelic.slack.com/archives/CE7FX92TF">
                #ui-writing
              </a>{" "}
              {` `}
              team for more in-depth (and dare I say important) language issues.
            </p>

            <h3>🖋️ What rules does this demo use?</h3>
            <p>
              I picked some of the {` `}
              <a href="https://unifiedjs.com/explore/keyword/retext-plugin/">
                out of the box rules
              </a>
              {` `} for this demo, but in addition to being able to {` `}
              <a href="https://unifiedjs.com/learn/guide/create-a-plugin/">
                create our own rules
              </a>
              , we can customize the existing ones. Here are the rules used in
              this demo:
            </p>
            <ul>
              <li>
                <a href="https://unifiedjs.com/explore/package/retext-repeated-words/">
                  Repeated words
                </a>
              </li>
              <li>
                <a href="https://unifiedjs.com/explore/package/retext-equality/">
                  Equality
                </a>
              </li>
              <li>
                <a href="https://unifiedjs.com/explore/package/retext-spell/">
                  Spelling
                </a>
              </li>
              <li>
                <a href="https://unifiedjs.com/explore/package/retext-indefinite-article/">
                  Indefinite article
                </a>
              </li>
              <li>
                <a href="https://unifiedjs.com/explore/package/retext-readability/">
                  Readability
                </a>
              </li>
              <li>
                <a href="https://unifiedjs.com/explore/package/retext-sentence-spacing/">
                  Sentence spacing
                </a>
              </li>
              <li>
                <a href="https://unifiedjs.com/explore/package/retext-passive/">
                  Passive voice
                </a>
              </li>
              <li>
                <a href="https://unifiedjs.com/explore/package/retext-contractions/">
                  Check for apostrophes
                </a>
              </li>
              <li>
                <a href="https://github.com/danielgolden/retext-use-contractions">
                  Use contractions
                </a>{" "}
                (a custom rule)
              </li>
              <li>
                <a href="https://github.com/danielgolden/retext-no-emojis">
                  No emoji
                </a>{" "}
                (a custom rule)
              </li>
              <li>
                <a href="https://github.com/danielgolden/retext-capitalization">
                  Capitalization
                </a>{" "}
                (a custom rule)
              </li>
            </ul>

            <h3>💬 I have questions or ideas</h3>
            <p>
              Reach out to the designs systems team on slack {` `} (
              <a href="https://newrelic.slack.com/archives/C01A76P3DPU">
                #help-one-core
              </a>{" "}
              👋🏽)
              {` `} or reach out to me on twitter{" "}
              <a href="https://twitter.com/dangolden1">@dangolden1</a>.
              Interested in contributing? Check out {` `}
              <a href="https://github.com/danielgolden/figma-language-linter-demo/">
                the repo
              </a>{" "}
              {` `}
              on GitHub.
            </p>
          </div>
        </div>
      </div>
      <div className="suggestions-container">
        <h2>Suggestions</h2>
        <LanguageLinter sampleText={sampleText} setSampleText={setSampleText} />
      </div>
    </div>
  );
}

export default App;
