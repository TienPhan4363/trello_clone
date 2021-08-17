import React from 'react';
import './BoardContents.scss';
import Column from 'Components/Column/Column'

function BoardContents(){
    return (
        <div className="board-contents">
          <Column />
          <Column />
          <Column />
          <Column />
          <Column />
          <Column />
          <Column />
          <Column />
      </div>
    );
}

export default BoardContents;
