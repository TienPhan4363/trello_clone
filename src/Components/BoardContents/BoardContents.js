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
import { fetchBoardDetails, createNewColumn } from 'Actions/ApiCall';

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
        newBoard.columnOrder = newColumns.map( col => col._id);
        newBoard.columns = newColumns;

        setColumns(newColumns);
        setBoard(newBoard);
    };

    const onCardDrop = (columnId, dropResult) => {
        if ( dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
            let newColumns = [...columns];

            let currentColumn = newColumns.find( col => col._id === columnId);
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
            currentColumn.cardOrder = currentColumn.cards.map(item => item._id);

            setColumns(newColumns);
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
            let newColumn = [...columns];
            newColumn.push( column );

            let newBoard = { ...board };
            newBoard.columnOrder = newColumn.map( col => col._id);
            newBoard.columns = newColumn;

            setColumns(newColumn);
            setBoard(newBoard);

            toggleOpenNewColumnForm();
        });
    };

    const onUpdateColumnState = (newColumnToUpdate) => {
        const columnIdToUpdate = newColumnToUpdate._id;

        let newColumn = [...columns];
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

        let newBoard = { ...board };
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
