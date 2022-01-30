import './App.css';

import { useState } from 'react'

import IconArrow from './images/icon-arrow.svg';
import IconPlus from './images/icon-plus.svg';
import IconTrash from './images/icon-trash.svg';
import IconHelp from './images/icon-help.svg';


function Suggestion(props) {
  const {
    suggestion, 
    sourceText, 
    sampleText, 
    setSampleText,
    suggestionHasModifiedSampleText,
    setSuggestionHasModifiedSampleText,
    removeSuggestion,
    dismissedSuggestions
  } = props

  const [ deleteIsHovered, setDeleteIsHovered ] = useState(false)
  const [ tooltipTimer, setTooltipTimer ] = useState()

  const suggestionHasExpected = !!suggestion?.expected
  
  const summaryType = () => {
    let summaryType = 'replacement';
    if (
      suggestion.source === 'retext-spell' ||
      suggestion.source === 'retext-contractions' ||
      suggestion.source === 'retext-use-contractions' ||
      suggestion.source === 'retext-repeated-words' ||
      (suggestion.source === 'retext-equality' && suggestionHasExpected)
      ) {
        return summaryType
    } else if (
      suggestion.source === 'retext-sentence-spacing' ||
      suggestion.source === 'retext-passive' ||
      suggestion.source === 'retext-readability'
    ) {
      return summaryType = 'basic'
    } else if (
      (suggestion.source === 'retext-equality' && !suggestionHasExpected) ||
      suggestion.source === 'retext-no-emojis'
    ) {
      summaryType = 'removal'
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
      suggestion.source === 'retext-use-contractions' ||
      suggestion.source === 'retext-no-emojis' ||
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
      case 'retext-use-contractions':
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
      case 'retext-no-emojis':
        ruleLabel = 'Consistent style';
        break;
      default:
        return ruleLabel
    }

    return ruleLabel
  }

  const renderSummary = () => {
    const renderSummaryCurrent = () => {
      const summaryCurrentOnClick = summaryType() === 'removal' ? (
        () => handleRemovalClick()
      ) : null

      return (
        <div 
          className="suggestion-summary-current"
          onClick={summaryCurrentOnClick}
        >
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
      const maxReplacementCount = 5
      const firstLetterOfOffender = suggestion.actual.substring(0,1)
      const offenderIsUpperCase = firstLetterOfOffender === firstLetterOfOffender.toUpperCase()
      
      return suggestion?.expected?.map((replacement, index) => {
        let caseSensitiveReplacement = replacement

        if (index < maxReplacementCount) {
            if (offenderIsUpperCase) {
              const firstLetterOfReplacement = replacement.substring(0,1);
              caseSensitiveReplacement = firstLetterOfReplacement.toUpperCase() + replacement.substring(1)
            }
            return (
              <span 
                className={`suggestion-summary-replacement`}
                onClick={() => handleReplacementClick(caseSensitiveReplacement)}
              >
                {caseSensitiveReplacement}
              </span>
            )
          }

          return ''
        }
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
        {summaryType() === 'replacement' && renderSummaryCurrent()}
        {summaryType() === 'removal' && renderSummaryCurrent()}
        {summaryType() === 'replacement' && renderSummaryArrow()}

        {
          (summaryType() === 'replacement') && (
            <div className={`suggestion-summary-replacements ${suggestion.expected.length === 0 ? 'no-replacement' : ''}`}>
              {renderSummaryReplacement()}
              {suggestion.expected.length === 0 && '?'}
            </div>
          )
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
              {highlightText(suggestion.actual)}. Consider changing it to a smart apostrophe like this: {highlightText(suggestion.expected)}.
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
        const secondSentence = suggestionHasExpected ? (
          <>Consider using {highlightText(suggestion.expected[0])} instead.</>
        ) : (
          `Try not to use it.`
        )
        

        return (
          <>
            {highlightText(suggestion.actual)} {` `} may be insensitive.
            {secondSentence}
          </>
        )
      case 'retext-readability':
        const readabilityCuplrit = () => {
          const start = suggestion.position.start.offset
          
          return sourceText.substring(start, start + 20)
        }

        return (
          <>
            We're {Math.round(suggestion.confidence * 100)}% sure the 
            sentence beginning with {highlightText(readabilityCuplrit())}... is 
            difficult to read. Consider rewriting it to make it easier to read.
          </>
        )
      case 'retext-use-contractions':
        return (
          <>
            Consider changing {highlightText(suggestion.actual)} to {` `}
            {highlightText(suggestion.expected[0])} to give your writing a more 
            conversational and personal feel.
          </>
        )
      case 'retext-no-emojis':
        return (
          <>
            Avoid using emojis in UI text. If you have the urge to use an emoji
            , consult {` `} 
            <a href="https://one-core.datanerd.us/foundation/design/writing/">
            our docs for voice and tone</a> to rewrite your message until it 
            achieves your goal.
          </>
        )
      default:
        return 'Uh oh'
    }
  }

  const renderSuggestionSecondaryActionCTA = () => {
    let learnMoreLink = ''

    switch (suggestion.source) {
      case 'retext-spell':
        learnMoreLink = 'https://en.wikipedia.org/wiki/American_English';
        break;
      case 'retext-contractions':
        learnMoreLink = 'https://github.com/retextjs/retext-contractions#use';
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
      case 'retext-use-contractions':
        learnMoreLink = 'https://one-core.datanerd.us/foundation/design/writing/contractions/';
        break;
      case 'retext-no-emojis':
        learnMoreLink = 'https://one-core.datanerd.us/foundation/design/writing/emojis/';
        break;
      default:
        learnMoreLink = 'https://one-core.datanerd.us/nr1-product/design/writing'
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

  const handleReplacementClick = (caseSensitiveReplacement) => {
    const suggestionStart = suggestion.position.start.offset
    const suggestionEnd = suggestion.position.end.offset
    const textBeforeOffender = sampleText.substring(0, suggestionStart)
    const textAfterOffender = sampleText.substring(suggestionEnd)
    let newSampleText = [textBeforeOffender, caseSensitiveReplacement, textAfterOffender]

    newSampleText = newSampleText.join('')

    setSampleText(newSampleText)
    setSuggestionHasModifiedSampleText(suggestionHasModifiedSampleText + 1)
  }

  const handleRemovalClick = () => {
    const suggestionStart = suggestion.position.start.offset
    const suggestionEnd = suggestion.position.end.offset
    let textBeforeOffender = sampleText.substring(0, suggestionStart)
    let textAfterOffender = sampleText.substring(suggestionEnd)
    const lastCharOfTextBeforeOffender = textBeforeOffender.substring(textBeforeOffender.length - 1, textBeforeOffender.length)
    const lastCharOfTextAfterOffender = textAfterOffender.substring(0,1)

    // does the emoji have any space around it? If so, strip it away.
    if (lastCharOfTextAfterOffender === ' ') {
      textAfterOffender = textAfterOffender.substring(1)
    } else if (lastCharOfTextBeforeOffender === ' ') {
      textBeforeOffender = textBeforeOffender.substring(0, textBeforeOffender.length -1)
    }
    

    let newSampleText = [textBeforeOffender, textAfterOffender]

    newSampleText = newSampleText.join('')

    setSampleText(newSampleText)
    setSuggestionHasModifiedSampleText(suggestionHasModifiedSampleText + 1)
  }
  
  const handleDeleteButtonMouseEnter = () => {
    setTooltipTimer(setTimeout(() => {
      setDeleteIsHovered(true)
    }, 500))
    // if (!tooltipTimer === undefined) {
    //   clearTimeout(tooltipTimer)
    // }
    // const tooltipTimer = setTimeout(() => {
    //   setDeleteIsHovered(true)
    // }, 500)

    return () => clearTimeout(tooltipTimer)
  }

  const handleDeleteMouseLeave = () => {
    clearTimeout(tooltipTimer)
    setDeleteIsHovered(false)
  }

  const handleDeleteButtonClick = () => {
    removeSuggestion(suggestion.name)
  }

  const isSuggestionDismissed = () => {
    return dismissedSuggestions.some(dismissedSuggestionId => {
      return dismissedSuggestionId === suggestion.name
    })
  }

  return (
    <div className={`suggestion-container ${isSuggestionDismissed() ? 'suggestion-dismissed': ''}`}>
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
        <button 
          className={`suggestion-cta-secondary suggestion-cta-icon-only ${deleteIsHovered ? 'delete-is-hovered' : ''}`}
          onMouseEnter={() => handleDeleteButtonMouseEnter()}
          onMouseLeave={() => handleDeleteMouseLeave()}
          onClick={() => handleDeleteButtonClick()}
        >
          <img 
            src={IconTrash} 
            alt="Delete icon" 
            className={`suggestion-summary-trash-icon`} 
          />
        </button>
      </div>
    </div>
  );
}

export default Suggestion;
