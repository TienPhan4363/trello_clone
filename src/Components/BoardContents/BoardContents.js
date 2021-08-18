//import lib
import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { Container, Draggable } from 'react-smooth-dnd';

//import components
import './BoardContents.scss';
import Column from 'Components/Column/Column';
import { mapOrder } from 'Utilities/sorts';
import { applyDrag } from 'Utilities/dragDrop';
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

    const onColumnDrop = (dropResult) => {
        let newColumns = [...columns];
        newColumns = applyDrag(newColumns, dropResult);

        let newBoard = { ...board };
        newBoard.columnOrder = newColumns.map( col => col.id);
        newBoard.columns = newColumns;
        // console.log(newBoard);

        setColumns(newColumns);
        setBoard(newBoard);
    };

    const onCardDrop = (columnId, dropResult) => {
        if ( dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
            let newColumns = [...columns];

            let currentColumn = newColumns.find( col => col.id === columnId);
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
            currentColumn.cardOrder = currentColumn.cards.map(item => item.id);

            setColumns(newColumns);
            // console.log(currentColumn);
        }
    };

    return (
        <div className="board-contents">
            <Container
                orientation="horizontal"
                onDrop={ onColumnDrop }
                getChildPayload={ index => columns[index] }
                dragHandleSelector=".column-drag-handle"
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'column-drop-preview'
                }}
            >
                {columns.map( (column, index) => (
                    <Draggable key={index}>
                        <Column column={column} onCardDrop={onCardDrop} />
                    </Draggable>
                ))}
            </Container>
            <div className="add-new-column">
                <i className="fa fa-plus icon"> Add another list</i>
            </div>
        </div>
    );
}

export default BoardContents;