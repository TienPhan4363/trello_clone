//import lib
import React, { useState, useEffect } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { Dropdown, Form } from 'react-bootstrap';

//import components
import './Column.scss';
import Card from 'Components/Card/Card';
import { mapOrder } from 'Utilities/sorts';
import ConfirmModal from 'Components/Common/ConfirmModal';
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from 'Utilities/constants';
import { saveContentAfterPressEnter, selectAllInlineText } from 'Utilities/contentEditable';

function Column(props) {
    const { column, onCardDrop, onUpdateColumn } = props;
    const cards = mapOrder(column.cards, column.cardOrder, 'id');

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);

    const [columnTitle, setColumnTitle] = useState('');
    const handleColumnTitleChange = (e) => {
        setColumnTitle(e.target.value);
    };
    useEffect( () => {
        setColumnTitle(column.title);
    }, [column.title]);

    const onConfirmModalAction = ( actionType ) => {
        if (actionType === MODAL_ACTION_CONFIRM) {
            const newColumn = {
                ...column,
                _destroy: true
            };
            onUpdateColumn(newColumn);
        }
        toggleShowConfirmModal();
    };

    const handleColumnTitleBlur = () => {
        const newColumn = {
            ...column,
            title: columnTitle
        };
        onUpdateColumn(newColumn);
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
                            <Dropdown.Item>Add card...</Dropdown.Item>
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
                    onDrop={ dropResult => onCardDrop(column.id, dropResult) }
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
            </div>
            {/* Footer */}
            <footer>
                <div className="footer-actions">
                    <i className="fa fa-plus icon"/>  Add another card
                </div>
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
