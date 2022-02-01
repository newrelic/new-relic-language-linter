import "./App.css";

import Suggestion from "./Suggestion";

import { useEffect, useState } from "react";
import { retext } from "retext";
import retextIndefiniteArticle from "retext-indefinite-article";
import retextRepeatedWords from "retext-repeated-words";
import retextStringify from "retext-stringify";
import retextReadability from "retext-readability";
import retextSentenceSpacing from "retext-sentence-spacing";
import retextPassive from "retext-passive";
import retextContractions from "retext-contractions";
import retextEquality from "retext-equality";
import retextSpell from "retext-spell";
import retextUseContractions from "retext-use-contractions";
import retextNoEmojis from "retext-no-emojis";
import en_us_aff from "./en_aff.js";
import en_us_dic from "./en_dic.js";
import { dictionaryContents as personalDictionary } from "./personalDictionary";

import { Button, TextField, Stack, Typography, List } from "@mui/material";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// import { reporter } from "vfile-reporter";

function App() {
  const [report, setReport] = useState({});
  const [dismissedSuggestions, setDismissedSuggestions] = useState([]);
  const [suggestionHasModifiedSampleText, setSuggestionHasModifiedSampleText] =
    useState(0);
  const [sampleText, setSampleText] = useState(
    `There was a issue iwth other projects not being meant for use in the browser so I decided to try this one out. It is called "Retext" and it comes with a really nice set of of plugins.  It offers lots of customization. Firemen, feel free edit the master document.

The constellation also contains an isolated neutron star—Calvera—and Orion, the hottest star yet discovered ✨, with a surface temperature of 200,000 kelvin`
  );

  useEffect(() => {
    lintMyText();
  }, [suggestionHasModifiedSampleText]);

  const retextSpellOptions = {
    dictionary: (callback) => {
      callback(null, {
        aff: en_us_aff,
        dic: en_us_dic,
      });
    },
    personal: personalDictionary.join("\n"),
    max: 5,
  };

  const lintMyText = () => {
    retext()
      .use(retextContractions)
      .use(retextSpell, retextSpellOptions)
      // It's important to use retextRepeatedWords _before_
      // retextIndefiniteArticle. See why:
      // https://github.com/newrelic/new-relic-language-linter/issues/2
      .use(retextRepeatedWords)
      .use(retextIndefiniteArticle)
      .use(retextEquality)
      .use(retextUseContractions)
      .use(retextNoEmojis)
      .use(retextReadability, { age: 19 })
      .use(retextSentenceSpacing)
      .use(retextPassive)
      .use(retextStringify)
      .process(sampleText)
      .then((report) => {
        setReport(report);
        console.log(report);
      });
  };

  const handleTextAreaOnChange = (event) => {
    setSampleText(event.target.value);
  };

  const handleButtonTrigger = () => {
    lintMyText();
  };

  const renderReport = () => {
    if (report?.messages?.length > 0) {
      return report.messages.map((suggestion, index) => {
        return (
          <Suggestion
            suggestion={suggestion}
            sourceText={report.value}
            sampleText={sampleText}
            setSampleText={setSampleText}
            suggestionHasModifiedSampleText={suggestionHasModifiedSampleText}
            setSuggestionHasModifiedSampleText={
              setSuggestionHasModifiedSampleText
            }
            removeSuggestion={removeSuggestion}
            dismissedSuggestions={dismissedSuggestions}
          />
        );
      });
    } else {
      return <Typography variant="body1">No suggestions to show...</Typography>;
    }
  };

  const removeSuggestion = (suggestionId) => {
    let newReport = { ...report };
    // remove it from the report
    newReport.messages = report.messages.filter(
      (suggestion) => suggestion.name !== suggestionId
    );

    setReport(newReport);
    let newDismissedSuggestions = [...dismissedSuggestions];
    newDismissedSuggestions.push(suggestionId);

    // This way it stays hidden even after relint
    setDismissedSuggestions(newDismissedSuggestions);
  };

  return (
    <Stack alignItems="flex-start" spacing={0} direction="row" className="App">
      <div className="primary-section">
        <header>
          <Typography
            variant="h3"
            component="div"
            gutterBottom
            className="page-title"
          >
            NR Language linter demo
          </Typography>
          <Typography variant="body1">
            Like Grammarly for people who write New Relic UI copy, but focused
            on writing-style more than grammar. This project is a{" "}
            <strong>WIP</strong>: {` `}
            <a href="https://github.com/danielgolden/figma-language-linter-demo/">
              View on GitHub
            </a>
          </Typography>
        </header>
        <Stack
          alignItems="flex-end"
          spacing={2}
          className="primary-section-body"
        >
          <form className="form-container">
            <TextField
              className="textfield"
              value={sampleText}
              multiline
              sx={{
                width: `100%`,
                maxWidth: "1000px",
              }}
              maxRows={14}
              label="Sample copy"
              onChange={(e) => handleTextAreaOnChange(e)}
              variant="filled"
            />
            <Button
              size="large"
              variant="contained"
              onClick={() => handleButtonTrigger()}
            >
              Lint text
            </Button>
          </form>
          <hr className="standard-hr" />
          <div className="about">
            <Typography variant="h5" component="div" gutterBottom>
              🧐 What's this for?
            </Typography>
            <p>
              It's a tool built for designers, engineers and anyone else who
              writes NR1 copy. Why? So that they can vet their copy for basic
              issues like passive voice, deprecated terms, insensitive language,
              and more. This way we can reserve the time of our friends in {` `}
              <a href="https://newrelic.slack.com/archives/CE7FX92TF">
                #ui-writing
              </a>{" "}
              {` `}
              for more in-depth language issues.
            </p>

            <Typography variant="h5" component="div" gutterBottom>
              🖋️ What rules does this demo use?
            </Typography>
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
            </ul>

            <Typography variant="h5" component="div" gutterBottom>
              💬 I have questions or ideas
            </Typography>
            <p>
              Reach out to me on slack {` `}
              <a href="https://newrelic.slack.com/archives/DJZP8JQ8M">
                @dgolden
              </a>
              {` `}👋🏽. I'd love to hear/talk about them.
            </p>
          </div>
        </Stack>
      </div>
      <Stack className="suggestions-container">
        <Typography variant="h4">Suggestions</Typography>
        {report?.messages?.length > 0 ? (
          <List className="suggestion-list">{renderReport()}</List>
        ) : (
          <Typography variant="body1" className="suggestions-empty-state">
            Click "lint text" to get started
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

export default App;
