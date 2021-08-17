import React from 'react';
import './Column.scss';
import Task from 'Components/Task/Task';

function Column(){
    return (
        <div className="column">
            <header>Brain Storm</header>
            <Task/>
            <footer>Add another card</footer>
        </div>
    );
}

export default Column;
