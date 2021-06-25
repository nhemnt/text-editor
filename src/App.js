import React, { useState, useRef } from 'react';
import Editor from './components/Editor';

function App() {
  const [html] = useState(''); //<b><i>asdadsasdianmsdaisdjiasmd aid adsmia sdasda&nbsp;</i></b>
  const editorRef= useRef(null)
  const consoleHtml = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getHtml())
    }
   }
  return (
    <>
      <Editor ref={editorRef} html={html} />
      <button onClick={consoleHtml}>Console HTML</button>
    </>
  );
}

export default App;
