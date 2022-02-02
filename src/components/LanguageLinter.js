import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Suggestion from "./Suggestion";

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
import en_us_aff from "../en_aff.js";
import en_us_dic from "../en_dic.js";
import { dictionaryContents as personalDictionary } from "./personalDictionary";

import "./Components.css";

function LanguageLinter(props) {
  const [report, setReport] = useState({});
  const [dismissedSuggestions, setDismissedSuggestions] = useState([]);
  const [textareaChangeTimer, setTextareaChangeTimer] = useState();

  const { sampleText, setSampleText, updateTimer = 300 } = props;

  useEffect(() => {
    setTextareaChangeTimer(
      setTimeout(() => {
        lintMyText();
      }, updateTimer)
    );

    return () => clearTimeout(textareaChangeTimer);
  }, [sampleText]);

  const lintMyText = () => {
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

  const renderReport = () => {
    if (report?.messages?.length > 0) {
      return report.messages.map((suggestion, index) => {
        return (
          <Suggestion
            suggestion={suggestion}
            sourceText={report.value}
            sampleText={sampleText}
            setSampleText={setSampleText}
            removeSuggestion={removeSuggestion}
            dismissedSuggestions={dismissedSuggestions}
          />
        );
      });
    } else {
      return <h4>No suggestions to show...</h4>;
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
    <>
      {report?.messages?.length > 0 ? (
        <li className="suggestion-list">{renderReport()}</li>
      ) : (
        <h3 variant="body1" className="suggestions-empty-state">
          Click "lint text" to get started
        </h3>
      )}
    </>
  );
}

LanguageLinter.propTypes = {
  sampleText: PropTypes.string,
  setSampleText: PropTypes.func,
  updateTimer: PropTypes.number,
};

export default LanguageLinter;
