import './App.css';

import { useState } from "react";

import IconArrow from './images/icon-arrow.svg';
import IconPlus from './images/icon-plus.svg';
import IconTrash from './images/icon-trash.svg';
import IconHelp from './images/icon-help.svg';


function Suggestion(props) {
  const {suggestion, sourceText} = props
  
  const summaryType = () => {
    let summaryType = 'replacement';
    if (
      suggestion.source === 'retext-spell' ||
      suggestion.source === 'retext-contractions' ||
      suggestion.source === 'retext-repeated-words' ||
      suggestion.source === 'retext-equality'
      ) {
        return summaryType
    } else if (
      suggestion.source === 'retext-sentence-spacing' ||
      suggestion.source === 'retext-passive' ||
      suggestion.source === 'retext-readability'
    ) {
      summaryType = 'basic'
    }

    return summaryType
  }

  const ruleSeverity = () => {
    let ruleSeverity = 'severe';

    if (
      suggestion.source === 'retext-spell' ||
      suggestion.source === 'retext-repeated-words' ||
      suggestion.source === 'retext-contractions' ||
      suggestion.source === 'retext-indefinite-article'
      ) {
        return ruleSeverity
      } else if (
      suggestion.source === 'retext-sentence-spacing' ||
      suggestion.source === 'retext-equality' ||
      suggestion.source === 'retext-readability' ||
      suggestion.source === 'retext-passive' 
    ) {
      ruleSeverity = 'moderate'
    }

    return ruleSeverity
  }

  const ruleLabel = () => {
    let ruleLabel = 'Suggestion'

    switch (suggestion.source) {
      case 'retext-spell':
        ruleLabel = 'Spelling';
        break;
      case 'retext-contractions':
        ruleLabel = 'Contractions';
        break;
      case 'retext-repeated-words':
        ruleLabel = 'Repeated words';
        break;
      case 'retext-sentence-spacing':
        ruleLabel = 'Consistent style';
        break;
      case 'retext-indefinite-article':
        ruleLabel = 'Grammar';
        break;
      case 'retext-equality':
        ruleLabel = 'Insensitive language';
        break;
      case 'retext-readability':
        ruleLabel = 'Clarity';
        break;
      case 'retext-passive':
        ruleLabel = 'Clarity';
        break;
      default:
        return ruleLabel
    }

    return ruleLabel
  }

  const renderSummary = () => {
    const renderSummaryCurrent = () => {
      return (
        <div className="suggestion-summary-current">
          <span className="suggestion-summary-current-text">{suggestion.actual}</span>
        </div>
      )
    }
    
    const renderSummaryArrow = () => {
      return (
        <img src={IconArrow} alt="arrow icon" className="suggestion-summary-arrow" />
      )
    }
    
    const renderSummaryReplacement = () => {
      return (
        <span className="suggestion-summary-replacement">{suggestion.expected[0]}</span>
      )
    }

    const renderSummaryBasic = () => {
      switch (suggestion.source) {
        case 'retext-passive':
          const passiveVoiceInstance = () => {
            const start = suggestion.position.start.offset
            const end = suggestion.position.end.offset
            
            return sourceText.substring(start -10, end)
          }

          return (
            <>
              The passive voice: {` `}
              <span className="basic-summary-example">"...{passiveVoiceInstance()}"</span>
            </>
          )
        case 'retext-sentence-spacing':
          return 'Sentence spacing'
        case 'retext-readability':
          return (`Difficult sentence to read`)
        default:
          return 'Suggestion'
      }
    }
  
    return(
      <div className={`suggestion-summary-container summary-${summaryType()}`}>
        {
          summaryType() === 'replacement' && renderSummaryCurrent()
        }

        {
          summaryType() === 'replacement' && renderSummaryArrow()
        }

        {
          (
            summaryType() === 'replacement' || 
            summaryType() === 'removal'
          ) && renderSummaryReplacement()
        }
        
        {
          summaryType() === 'basic' && renderSummaryBasic()
        }
      </div>
    )
  }

  const renderSuggestionDescriptionText = () => {
    const highlightText = (string) => {
      return (<strong><em>{string}</em></strong>)
    }
    switch (suggestion.source) {
      case 'retext-spell':
        return (
          <>
            The word {highlightText(suggestion.actual)} is not in our dictionary. 
            If you’re sure this spelling is correct, you can suggest we add it to 
            the dicitonary to prevent future alerts.
          </>
        )
      case 'retext-contractions':
        if (suggestion.ruleId === 'missing-smart-apostrophe') {
          return (
            <>
              It appears your missing an apostrophe in {highlightText(suggestion.actual)}.
            </>
          )
        } else if (suggestion.ruleId === 'smart-apostrophe') {
          return (
            <>
              It appears your using the wrong kind of apostrophe in {` `}
              {highlightText(suggestion.actual)}. Consider changing it to {` `}
              {highlightText(suggestion.expected)}.
            </>
          )
        } else {
          return (suggestion.reason)
        }
      case 'retext-repeated-words':
        return (
          <>
            Oops! It appears that you typed {` `}
            {highlightText(suggestion.expected[0])} twice in a row. Consider 
            deleteing one of them.
          </>
        )
      case 'retext-sentence-spacing':
        return (
          <>
            It appears that you used {highlightText(suggestion.actual.length)} 
            {` `} spaces before your sentence. At New Relic, we use 1 space.
          </>
        )
      case 'retext-passive':
        return (
          <>
            This sentence appears to be written in the passive voice. Consider
            rewriting this in the active voice.
          </>
        )
      case 'retext-indefinite-article':
        return (
          <>
            The article {highlightText(suggestion.actual)} {` `} may be 
            incorrect. Consider changing it to {` `}
            {highlightText(suggestion.expected)} so that it agrees with the 
            beginning sound of the following word.
          </>
        )
      case 'retext-equality':
        return (
          <>
            {highlightText(suggestion.actual)} {` `} may be insensitive.
            Consider using {highlightText(suggestion.expected)} instead.
          </>
        )
      case 'retext-readability':
        return (
          <>
            We're {Math.round(suggestion.confidence * 100)}% confident the 
            sentence beginning with {highlightText(sourceText.substring(0, 15))}... is 
            difficult to read. Consider rewriting it to make it easier to read.
          </>
        )
      default:
        return 'Uh oh'
    }
  }

  const renderSuggestionSecondaryActionCTA = () => {
    let learnMoreLink = 'https://one-core.datanerd.us/nr1-product/design/writing'
    switch (suggestion.source) {
      case 'retext-spell':
        learnMoreLink = 'https://en.wikipedia.org/wiki/American_English';
        break;
      case 'retext-contractions':
        learnMoreLink = 'Contractions';
        if (suggestion.ruleID === 'missing-smart-apostrophe') {
          learnMoreLink = 'https://www.grammarbook.com/punctuation/apostro.asp';
        } else if (suggestion.ruleID === 'smart-apostrophe')  {
          learnMoreLink = 'https://practicaltypography.com/straight-and-curly-quotes.html';
        }
        break;
      case 'retext-repeated-words':
        learnMoreLink = 'https://github.com/retextjs/retext-repeated-words#readme';
        break;
      case 'retext-sentence-spacing':
        learnMoreLink = 'https://practicaltypography.com/one-space-between-sentences.html';
        break;
      case 'retext-indefinite-article':
        learnMoreLink = 'https://www.ef.edu/english-resources/english-grammar/indefinite-articles/';
        break;
      case 'retext-equality':
        learnMoreLink = 'https://github.com/retextjs/retext-equality/blob/main/rules.md';
        break;
      case 'retext-readability':
        learnMoreLink = 'https://www.dorisandbertie.com/goodcopybadcopy/2017/02/14/sentence-structure-how-to-make-your-sentences-much-easier-to-read';
        break;
      case 'retext-passive':
        learnMoreLink = 'https://www.grammarly.com/blog/active-vs-passive-voice/';
        break;
      default:
        return learnMoreLink
    }


    if (suggestion.source === 'retext-spell') {
      return (
        <button className="suggestion-cta-secondary">
          <img src={IconPlus} alt="plus icon" className="suggestion-summary-plus-icon" />
          <span className="suggestion-cta-label">Add to dictionary</span>
        </button>
      )
    } else {
      return (
        <a className="suggestion-cta-secondary" href={learnMoreLink}>
          <img src={IconHelp} alt="Help icon" className="suggestion-summary-help-icon" />
          <span className="suggestion-cta-label">Learn more</span>
        </a>
      )
    }
  }

  return (
    <div className="suggestion-container">
      <div className="suggestion-rule-container">
        <span className={`suggestion-rule-severity ${ruleSeverity()}`}></span>
        <h6 className="suggestion-rule-label">{ruleLabel()}</h6>
      </div>

      {renderSummary()}

      <div className="suggestion-description">
        <p className="suggestion-description-text">
          {renderSuggestionDescriptionText()}
        </p>
      </div>

      <div className="suggestions-ctas">
        {renderSuggestionSecondaryActionCTA()}
        <button className="suggestion-cta-secondary suggestion-cta-icon-only">
          <img src={IconTrash} alt="Delete icon" className="suggestion-summary-trash-icon" />
        </button>
      </div>
    </div>
  );
}

export default Suggestion;
