//import lib
import React, { useState, useEffect, useRef } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { Dropdown, Form, Button } from 'react-bootstrap';
import { cloneDeep } from 'lodash';

//import components
import './Column.scss';
import Card from 'Components/Card/Card';
import { mapOrder } from 'Utilities/sorts';
import ConfirmModal from 'Components/Common/ConfirmModal';
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from 'Utilities/constants';
import { saveContentAfterPressEnter, selectAllInlineText } from 'Utilities/contentEditable';
import { createNewCard, updateColumn } from 'Actions/ApiCall';

function Column(props) {
    const { column, onCardDrop, onUpdateColumnState } = props;
    const cards = mapOrder(column.cards, column.cardOrder, '_id');

    //Modal
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);

    //remove column
    const onConfirmModalAction = ( actionType ) => {
        if (actionType === MODAL_ACTION_CONFIRM) {
            const newColumn = {
                ...column,
                _destroy: true
            };
            //call API update column _destroy
            updateColumn(newColumn._id, newColumn).then( updatedColumn => {
                onUpdateColumnState(updatedColumn);
            });
        }
        toggleShowConfirmModal();
    };

    //Column title
    const [columnTitle, setColumnTitle] = useState('');
    const handleColumnTitleChange = (e) => {
        setColumnTitle(e.target.value);
    };
    useEffect( () => {
        setColumnTitle(column.title);
    }, [column.title]);

    //update column title
    const handleColumnTitleBlur = () => {

        if ( columnTitle !== column.title) {
            const newColumn = {
                ...column,
                title: columnTitle
            };
            //call API update column title if column title state has some change
            updateColumn(newColumn._id, newColumn).then( updatedColumn => {
                updatedColumn.cards = newColumn.cards;
                onUpdateColumnState(updatedColumn);
            });
        }
    };

    //Card form
    const [openNewCardForm, setOpenNewCardForm] = useState(false);
    const toggleOpenNewCardForm = () => {
        setOpenNewCardForm(!openNewCardForm);
    };

    const newCardTextareaRef = useRef(null);
    useEffect( () => {
        if (newCardTextareaRef && newCardTextareaRef.current) {
            newCardTextareaRef.current.focus();
            newCardTextareaRef.current.select();
        }
    }, [openNewCardForm]);

    const [newCardTitle, setNewCardTitle] = useState('');
    const handleCardTitleChange = (e) => setNewCardTitle(e.target.value);

    const addNewCard = () => {
        if (!newCardTitle) {
            newCardTextareaRef.current.focus();
            return;
        }

        const newCardToAdd = {
            title: newCardTitle.trim(),
            boardId: column.boardId,
            columnId: column._id
        };

        //call API createNewCard
        createNewCard(newCardToAdd).then( card => {
            let newColumn = cloneDeep(column);
            newColumn.cards.push(card);
            newColumn.cardOrder.push(card._id);

            onUpdateColumnState(newColumn);
            setNewCardTitle('');
            toggleOpenNewCardForm();
        });
    };

    return (
        <div className="column">
            {/* Header */}
            <header className="column-drag-handle">
                <div className="column-title">
                    <Form.Control
                        size="sm"
                        type="text"
                        className="trello-clone-contenteditable"
                        value={ columnTitle }
                        onClick={ selectAllInlineText }
                        onChange={ handleColumnTitleChange }
                        onBlur={ handleColumnTitleBlur }
                        onKeyDown={ saveContentAfterPressEnter }
                        onMouseDown={e => e.preventDefault()}
                        spellCheck="false"
                    />
                    {/* { column.title} */}
                </div>
                <div className="column-dropdown-actions">
                    <Dropdown>
                        <Dropdown.Toggle size="sm" id="dropdown-basic" className="dropdown-btn"/>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={ toggleOpenNewCardForm }>Add card...</Dropdown.Item>
                            <Dropdown.Item onClick={ toggleShowConfirmModal }>Remove column...</Dropdown.Item>
                            <Dropdown.Item>Modify...</Dropdown.Item>
                            <Dropdown.Item>Archive all cards in this column...</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </header>
            {/* Card list */}
            <div className="card-list">
                <Container
                    orientation="vertical" //default
                    groupName="m-col"
                    onDrop={ dropResult => onCardDrop(column._id, dropResult) }
                    getChildPayload={ index => cards[ index ]}
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"
                    dropPlaceholder={{
                        animationDuration: 150,
                        showOnTop: true,
                        className: 'card-drop-preview'
                    }}
                    dropPlaceholderAnimationDuration={ 200 }
                >
                    { cards.map( (card, index) => (
                        <Draggable key={index}>
                            <Card card={card}/>
                        </Draggable>
                    )) }

                </Container>

                {/* Add new card area */}
                {openNewCardForm &&
                    <div className="add-new-card-area">
                        <Form.Control
                            size="sm"
                            as="textarea"
                            rows="3"
                            placeholder="Enter a title for this card..."
                            className="textarea-enter-new-card"
                            ref={ newCardTextareaRef }
                            value={ newCardTitle }
                            onChange={ handleCardTitleChange }
                            onKeyDown={ e => (e.key === 'Enter') && addNewCard() }
                            // onBlur={ toggleOpenNewCardForm }
                            spellCheck={false}
                        />
                    </div>
                }
            </div>

            {/* Footer */}
            <footer>
                {openNewCardForm &&
                    <div className="add-new-card-actions">
                        <Button
                            variant="success"
                            size="sm"
                            onClick={ addNewCard }
                        >
                            Add new card
                        </Button>
                        <span
                            className="cancel-icon"
                            onClick={ toggleOpenNewCardForm }
                        >
                            <i className="fa fa-trash icon"/>
                        </span>
                    </div>
                }
                {!openNewCardForm &&
                    <div className="footer-actions" onClick={ toggleOpenNewCardForm }>
                        <i className="fa fa-plus icon"/>  Add another card
                    </div>
                }
            </footer>

            {/* Confirm modal */}
            <ConfirmModal
                title="Remove column"
                content={`Are you sure you want to remove <strong>${column.title}</strong>? <br />All related cards will also be removed!`}
                show={ showConfirmModal }
                onAction={ onConfirmModalAction }
            />
        </div>
    );
}

export default Column;
