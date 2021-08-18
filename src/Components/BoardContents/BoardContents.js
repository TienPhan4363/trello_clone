import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import './BoardContents.scss';
import Column from 'Components/Column/Column';
import { mapOrder } from 'Utilities/sorts';
import { initData } from 'Actions/initData';

function BoardContents() {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState({});

    useEffect( () => {
        const boardFromDB = initData.boards.find( board => board.id === 'board-1');
        if (boardFromDB) {
            setBoard(boardFromDB);

            setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'));
        }
    }, []);

    if (isEmpty(board)) {
        return (
            <div className="not-found"
                style={{ 'padding': '10px', 'color': 'white' }}>
                Board not found
            </div>
        );
    }

    return (
        <div className="board-contents">
            {columns.map( (column, index) => <Column key={index} column={column}/>)}
        </div>
    );
}

export default BoardContents;