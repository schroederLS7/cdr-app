import { useState } from 'react'
import phoneIcon from './assets/phone.svg'
import { Upload } from './Upload'
import { View } from './View'
import { Query } from './Query'
import { Output } from './Output'
import './App.css'
import type { DisplayMessage } from '../../server/src/interfaces/interfaces'


const ViewState = {
  Upload: "Upload",
  View: "View",
  Query: "Query"
}

function App() {
  const [currentViewState, setCurrentViewState] = useState<string>("Upload")
  const [outputDisplay, setOutputDisplay] = useState<DisplayMessage[]>([]);

  const appendOutput = (input: DisplayMessage) => {
    input.timestamp = new Date().toLocaleTimeString();
    setOutputDisplay([...outputDisplay, input]);
  }

  return (
    <>
      <div className="mainContainer">
        <div className="title">
          <img src={phoneIcon} className="logo" />
          <h1>Call Detail Record Utility</h1>
        </div>
        <div className="navContainer">
          <button onClick={() => setCurrentViewState(ViewState.Upload)} className={currentViewState == ViewState.Upload ? "selectedNav" : ""}>
            Upload Data
          </button>
          <button onClick={() => setCurrentViewState(ViewState.View)} className={currentViewState == ViewState.View ? "selectedNav" : ""}>
            View Uploaded Data
          </button>
          <button onClick={() => setCurrentViewState(ViewState.Query)} className={currentViewState == ViewState.Query ? "selectedNav" : ""}>
            Query Data
          </button>
        </div>
        <div className='colContainer'>
          <div className="leftContainer">
            {currentViewState == 'Upload' ? <Upload sendOutput={appendOutput} /> : null}
            {currentViewState == 'View' ? <View sendOutput={appendOutput} /> : null}
            {currentViewState == 'Query' ? <Query sendOutput={appendOutput} /> : null}
          </div>
          <div className="rightContainer">
            <Output outputDisplay={outputDisplay} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
