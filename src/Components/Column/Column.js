import React from 'react';
import './Column.scss';
import Card from 'Components/Card/Card';
import { mapOrder } from 'Utilities/sorts';

function Column(props) {
    const { column } = props;
    const cards = mapOrder(column.cards, column.cardOrder, 'id');
    return (
        <div className="column">
            <header>{column.title}</header>
            <div className="card-list">
                { cards.map( (card, index) => <Card key={index} card={card}/>) }
            </div>
            <footer>Add another card</footer>
        </div>
    );
}

export default Column;
