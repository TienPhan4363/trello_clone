//import lib
import React, { useState, useEffect, useRef } from 'react';
import { isEmpty, cloneDeep } from 'lodash';
import { Container, Draggable } from 'react-smooth-dnd';
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap';

//import components
import './BoardContents.scss';
import Column from 'Components/Column/Column';
import { mapOrder } from 'Utilities/sorts';
import { applyDrag } from 'Utilities/dragDrop';
import { fetchBoardDetails, createNewColumn, updateBoard, updateColumn, updateCard } from 'Actions/ApiCall';

function BoardContents() {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);
    const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
    const toggleOpenNewColumnForm = () => {
        setOpenNewColumnForm(!openNewColumnForm);
    };

    const newColumnInputRef = useRef(null);

    const [newColumnTitle, setNewColumnTitle] = useState('');
    const handleColumnTitleToAdd = (e) => setNewColumnTitle(e.target.value);

    useEffect( () => {
        const boardId = '61236bce9937527c34c119f2';
        fetchBoardDetails(boardId).then( board => {
            setBoard(board);
            setColumns(mapOrder(board.columns, board.columnOrder, '_id'));
        });
    }, []);

    useEffect( () => {
        if (newColumnInputRef && newColumnInputRef.current) {
            newColumnInputRef.current.focus();
            newColumnInputRef.current.select();
        }
    }, [openNewColumnForm]);

    //replace by loading
    if (isEmpty(board)) {
        return (
            <div className="not-found"
                style={{ 'padding': '10px', 'color': 'white' }}>
                Board not found
            </div>
        );
    }

    const onColumnDrop = (dropResult) => {
        let newColumns = cloneDeep(columns); // let newColumns = [...columns]; but more effective
        newColumns = applyDrag(newColumns, dropResult);

        let newBoard = cloneDeep(board);
        newBoard.columnOrder = newColumns.map( col => col._id);
        newBoard.columns = newColumns;

        setColumns(newColumns);
        setBoard(newBoard);
        //call API update columnOrder in board detail
        updateBoard(newBoard._id, newBoard).catch( () => {
            //set column and board = old state before error
            setColumns(columns);
            setBoard(board);
        });
    };

    const onCardDrop = (columnId, dropResult) => {
        if ( dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
            let newColumns = cloneDeep(columns);

            let currentColumn = newColumns.find( col => col._id === columnId);
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
            currentColumn.cardOrder = currentColumn.cards.map(item => item._id);

            setColumns(newColumns);
            if (dropResult.removedIndex !== null && dropResult.addedIndex !== null) {
                /**
                 * move card inside its column: update columnOrder
                 * 1. call API update cardOrder in current column
                 */
                updateColumn(currentColumn._id, currentColumn).catch( () => setColumns(columns));
            } else {
                /**
                 * move card between 2 columns
                 */
                //1. call API update cardOrder in current column
                updateColumn(currentColumn._id, currentColumn).catch( () => setColumns(columns));

                if (dropResult.addedIndex !== null) {
                    let currentCard = cloneDeep(dropResult.payload);
                    currentCard.columnId = currentColumn._id;

                    // 2. call API update columnId in current card
                    updateCard(currentCard._id, currentCard).catch( (error) => {
                        console.log(error);
                    });
                }
            }
        }
    };

    const addNewColumn = () => {
        if (!newColumnTitle) {
            newColumnInputRef.current.focus();
            return;
        }

        const newColumnToAdd = {
            boardId: board._id,
            title: newColumnTitle.trim()
        };

        //call API createNewColumn
        createNewColumn(newColumnToAdd).then( column => {
            let newColumn = cloneDeep(columns);
            newColumn.push( column );

            let newBoard = cloneDeep(board);
            newBoard.columnOrder = newColumn.map( col => col._id);
            newBoard.columns = newColumn;

            setColumns(newColumn);
            setBoard(newBoard);

            toggleOpenNewColumnForm();
        });
    };

    const onUpdateColumnState = (newColumnToUpdate) => {
        const columnIdToUpdate = newColumnToUpdate._id;

        let newColumn = cloneDeep(columns);
        const columnIndexToUpdate = newColumn.findIndex(i => i._id === columnIdToUpdate);

        if (newColumnToUpdate._destroy === true) {
            //remove column
            newColumn.splice(columnIndexToUpdate, 1);
        }
        else {
            //update column infor
            newColumn.splice(columnIndexToUpdate, 1, newColumnToUpdate);
        }

        //another  remove column
        // newColumn = newColumn.filter((cl) => {
        //     if (cl._id === newColumnToUpdate._id) {
        //         cl = newColumnToUpdate;
        //         if (newColumnToUpdate._destroy === true) {
        //             return false;
        //         } else {
        //             return true;
        //         }
        //     }
        //     return true;
        // });

        // newColumn.push(newColumnToUpdate);

        let newBoard = cloneDeep(board);
        newBoard.columnOrder = newColumn.map( col => col._id);
        newBoard.columns = newColumn;

        setColumns(newColumn);
        setBoard(newBoard);
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
                        <Column
                            column={column}
                            onCardDrop={onCardDrop}
                            onUpdateColumnState={ onUpdateColumnState }
                        />
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
                                placeholder="Enter new column title..."
                                className="input-enter-new-column"
                                ref={ newColumnInputRef }
                                value={ newColumnTitle }
                                onChange={ handleColumnTitleToAdd }
                                onKeyDown={ e => (e.key === 'Enter') && addNewColumn() }
                                // onBlur={ toggleOpenNewColumnForm }
                            />
                            <Button
                                variant="success"
                                size="sm"
                                onClick={ addNewColumn }
                            >
                                Add new list
                            </Button>
                            <span
                                className="cancel-icon"
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
