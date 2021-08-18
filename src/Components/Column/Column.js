//import lib
import React from 'react';
import { Container, Draggable } from 'react-smooth-dnd';

//import components
import './Column.scss';
import Card from 'Components/Card/Card';
import { mapOrder } from 'Utilities/sorts';

function Column(props) {
    const { column, onCardDrop } = props;
    const cards = mapOrder(column.cards, column.cardOrder, 'id');

    return (
        <div className="column">
            <header className="column-drag-handle">{column.title}</header>
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
            <footer>
                <div className="footer-actions">
                    <i className="fa fa-plus icon"/>  Add another card
                </div>
            </footer>
        </div>
    );
}

export default Column;
