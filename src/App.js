import React from 'react';
import './App.scss';

//custom components
import AppBar from 'Components/AppBar/AppBar';
import BoardBar from 'Components/BoardBar/BoardBar';
import BoardContents from 'Components/BoardContents/BoardContents';

function App() {
  return (
    <div className="App">
      <AppBar/>
      <BoardBar/>
      <BoardContents/>
    </div>
  );
}

export default App;
