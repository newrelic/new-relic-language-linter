import './App.css';

import Suggestion from './Suggestion'

import { useState } from "react";
import { reporterJson } from "vfile-reporter-json";
import { retext } from "retext";
import retextIndefiniteArticle from "retext-indefinite-article";
import retextRepeatedWords from "retext-repeated-words";
import retextStringify from "retext-stringify";
import retextReadability from "retext-readability";
import retextSentenceSpacing from "retext-sentence-spacing";
import retextPassive from "retext-passive";
import retextContractions from "retext-contractions";
import retextEquality from 'retext-equality'
import retextSpell from "retext-spell";
import en_us_aff from './en_aff.js'
import en_us_dic from './en_dic.js'

import IconArrow from './images/icon-arrow.svg';
import IconPlus from './images/icon-plus.svg';
import IconTrash from './images/icon-trash.svg';
import IconHelp from './images/icon-help.svg';

import { 
  Button, 
  TextField, 
  Stack, 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon
} from '@mui/material';

import { Warning } from '@mui/icons-material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// import { reporter } from "vfile-reporter";

function App() {
  const [report, setReport] = useState([]);
  const [sampleText, setSampleText] = useState(
    `There were some issues iwth other projects not being meant for use in the browser so I decided to try this one out. It's called "Retext" and it comes with a really nice set of of plugins.  I think it offers lots of customization which Im really excited about. Firemen are cool.

The constellation also contains an isolated neutron
star—Calvera—and Orion, the hottest star yet
discovered, with a surface temperature of 200,000 kelvin`
  );

  const retextSpellOptions = {
    dictionary: callback => {
      callback(null, {
        aff: en_us_aff,
        dic: en_us_dic,
      })
    },
    max: 5,
  }

  const lintMyText = () => {
    retext()
      .use(retextContractions)
      .use(retextSpell, retextSpellOptions)
      .use(retextRepeatedWords)
      .use(retextEquality)
      .use(retextIndefiniteArticle)
      .use(retextReadability)
      .use(retextSentenceSpacing)
      .use(retextPassive)
      .use(retextStringify)
      .process(sampleText)
      .then((report) => {
        setReport(report);
        console.log(report);
      });
  }

  const handleTextAreaOnChange = (event) => {
    setSampleText(event.target.value);
  };

  const handleButtonTrigger = () => {
    lintMyText();
  }

  const renderReport = () => {
    if (report?.messages?.length > 0) {
      return report.messages.map((suggestion, index) => {
        return(
        <Suggestion 
          suggestion={suggestion}
          sourceText={report.value}
        />
        )
      });
    } else {
      return (
      <Typography variant="body1">No suggestions to show...</Typography>
      )
    }
  };

  return (
    <div className="App">
      <Typography variant="h3" component="div" gutterBottom>
      Figma language linter demo
      </Typography>
      <Typography variant="body1">Use this form to lint whatever text you want. This demo uses <a href="https://github.com/retextjs/retext">Retext</a> and <a href="https://unifiedjs.com/explore/?q=retext"> it's suite of plugins</a>.</Typography>
      <Stack alignItems="flex-start" spacing={2} className="form">
        <TextField
          className="textfield"
          value={sampleText}
          multiline
          sx={{
            width: `100%`,
            maxWidth: '1000px',
          }}
          maxRows={14}
          label="Sample copy"
          onChange={(e) => handleTextAreaOnChange(e)}
          variant='filled'
        />
        <Button variant='contained' onClick={() => handleButtonTrigger()}>Lint text</Button>
      </Stack>
      {report?.messages?.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h5">Suggestions</Typography>
            <List className="sugestion-list">
              {renderReport()}
            </List>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default App;
