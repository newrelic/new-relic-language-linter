import './App.css';

import { useState } from "react";

import IconArrow from './images/icon-arrow.svg';
import IconPlus from './images/icon-plus.svg';
import IconTrash from './images/icon-trash.svg';
import IconHelp from './images/icon-help.svg';


function Suggestion(props) {
  const {suggestion, sourceText} = props
  const ruleLabel = suggestion.source === 'retext-spell' ? 'Spelling' : suggestion.source
  
  const summaryType = () => {
    let summaryType = 'replacement';
    if (
      suggestion.source === 'retext-spell' ||
      suggestion.source === 'retext-contractions' ||
      suggestion.source === 'retext-repeated-words' ||
      suggestion.source === 'retext-equality'
      ) {
        return
    } else if (
      suggestion.source === 'retext-sentence-spacing' ||
      suggestion.source === 'retext-passive'
    ) {
      summaryType = 'basic'
    }

    return summaryType
  }

  return (
    <div className="suggestion-container">
      <div className="suggestion-rule-container">
        <span className="suggestion-rule-severity severe"></span>
        <h6 className="suggestion-rule-label">{ruleLabel}</h6>
      </div>

      <div className="suggestion-summary-container summary-replacement">
        <div className="suggestion-summary-current">
          <span className="suggestion-summary-current-text">{suggestion.actual}</span>
        </div>
        <img src={IconArrow} alt="arrow icon" className="suggestion-summary-arrow" />
        <span className="suggestion-summary-replacement">{suggestion.expected[0]}</span>
      </div>
      {/* <div className="suggestion-summary-container summary-remove">
        <span className="suggestion-summary-replacement">of</span>
      </div>
      <div className="suggestion-summary-container summary-basic">
        The passive voice
      </div> */}

      <div className="suggestion-description">
        <p className="suggestion-description-text">
          The word <strong><em>{suggestion.actual}</em></strong> is not in our dictionary. 
          If you’re sure this spelling is correct, you can suggest we add it to 
          the dicitonary to prevent future alerts.
        </p>
      </div>

      <div className="suggestions-ctas">
        <button className="suggestion-cta-secondary">
          <img src={IconPlus} alt="plus icon" className="suggestion-summary-plus-icon" />
          <span className="suggestion-cta-label">Add to dictionary</span>
        </button>
        {/* <button className="suggestion-cta-secondary">
          <img src={IconHelp} alt="Help icon" className="suggestion-summary-help-icon" />
          <span className="suggestion-cta-label">Learn more</span>
        </button> */}
        <button className="suggestion-cta-secondary suggestion-cta-icon-only">
          <img src={IconTrash} alt="Delete icon" className="suggestion-summary-trash-icon" />
        </button>
      </div>
    </div>
  );
}

export default Suggestion;
