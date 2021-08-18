//import lib
import React, { useState, useEffect, useRef } from 'react';
import { isEmpty } from 'lodash';
import { Container, Draggable } from 'react-smooth-dnd';
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap';

//import components
import './BoardContents.scss';
import Column from 'Components/Column/Column';
import { mapOrder } from 'Utilities/sorts';
import { applyDrag } from 'Utilities/dragDrop';
import { initData } from 'Actions/initData';

function BoardContents() {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState({});
    const [openNewColumnForm, setOpenNewColumnForm] = useState(false);

    const newColumnInputRef = useRef(null);

    const [newColumnTitle, setNewColumnTitle] = useState('');

    useEffect( () => {
        const boardFromDB = initData.boards.find( board => board.id === 'board-1');
        if (boardFromDB) {
            setBoard(boardFromDB);

            setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'));
        }
    }, []);

    useEffect( () => {
        if (newColumnInputRef && newColumnInputRef.current) {
            newColumnInputRef.current.focus();
            newColumnInputRef.current.select();
        }
    }, [openNewColumnForm]);

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

    const toggleOpenNewColumnForm = () => {
        setOpenNewColumnForm(!openNewColumnForm);
    };

    const addNewColumn = () => {
        if (!newColumnTitle) {
            newColumnInputRef.current.focus();
            return;
        }

        const newColumnToAdd = {
            id: Math.random().toString(36).substr(2, 5), //set id by 5 random characters, will replace later with API
            boardID: board.id,
            title: newColumnTitle.trim(),
            cardOrder: [],
            cards: []
        };

        let newColumn = [...columns];
        newColumn.push( newColumnToAdd );

        let newBoard = { ...board };
        newBoard.columnOrder = newColumn.map( col => col.id);
        newBoard.columns = newColumn;

        setColumns(newColumn);
        setBoard(newBoard);

        toggleOpenNewColumnForm();
    };

    const handleColumnTitleChange = (e) => setNewColumnTitle(e.target.value);

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
            <BootstrapContainer className="trello-clone-container">
                {!openNewColumnForm &&
                    <Row>
                        <Col className="add-new-column" onClick={ toggleOpenNewColumnForm }>
                            <i className="fa fa-plus icon"> Add another list</i>
                        </Col>
                    </Row>
                }

                {openNewColumnForm &&
                    <Row>
                        <Col className="enter-new-column">
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Enter new title..."
                                className="input-enter-new-column"
                                ref={ newColumnInputRef }
                                value={ newColumnTitle }
                                onChange={ handleColumnTitleChange }
                                onKeyDown={ e => (e.key === 'Enter') && addNewColumn() }
                            />
                            <Button
                                variant="success"
                                size="sm"
                                onClick={ addNewColumn }
                            >
                                Add new list
                            </Button>
                            <span
                                className="cancel-new-column"
                                onClick={ toggleOpenNewColumnForm }
                            >
                                <i className="fa fa-trash icon"/>
                            </span>
                        </Col>
                    </Row>
                }
            </BootstrapContainer>
        </div>
    );
}

export default BoardContents;