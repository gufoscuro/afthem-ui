import React, { useState, useCallback, useRef } from 'react'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
// import Card from './Card'
import update from 'immutability-helper'
import FadeinFX from './hoc/FadeinFX';
// import ItemTypes from './ItemTypes'

const ItemTypes = {
    CARD: 'card',
}
const c_style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
}
const Card = ({ id, text, index, moveCard, editText }) => {
    const ref = useRef(null)
    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        hover(item, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current.getBoundingClientRect()
            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            // Determine mouse position
            const clientOffset = monitor.getClientOffset()
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }
            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex)
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })
    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.CARD, id, index },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    })
    const opacity = isDragging ? 0 : 1
    drag(drop(ref))

    return (
        <div ref={ref} style={{ ...c_style, opacity }}>
            <div>{text}</div>
            <input type="text" name="text" value={text} onChange={(e) => { editText (index, e.target.value) }}/>
        </div>
    )
}



const style = {
    width: 400,
}

const ta_style = {
    width: 500,
    height: 400,
    fontFamily: 'Monaco, monospace',
    border: '1px solid #ccc',
    backgroundColor: '#fff'
}
const Container = () => {
    {
        const [idcount, setIdcount] = useState (8);
        const [cards, setCards] = useState([
            {
                id: 1,
                text: 'Write a cool JS library',
            },
            {
                id: 2,
                text: 'Make it generic enough',
            },
            {
                id: 3,
                text: 'Write README',
            },
            {
                id: 4,
                text: 'Create some examples',
            },
            {
                id: 5,
                text:
                    'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
            },
            {
                id: 6,
                text: '???',
            },
            {
                id: 7,
                text: 'PROFIT',
            },
        ])
        const moveCard = useCallback ((dragIndex, hoverIndex) => {
                const dragCard = cards[dragIndex]
                setCards(
                    update(cards, {
                        $splice: [
                            [dragIndex, 1],
                            [hoverIndex, 0, dragCard],
                        ],
                    }),
                )
            },
            [cards],
        )
        const editText = (index, text) => {
            const cardsss = [...cards]
            cardsss[index].text = text;

            setCards (cardsss)
        }
        const renderCard = (card, index) => {
            return (
                <Card
                    key={card.id}
                    index={index}
                    id={card.id}
                    text={card.text}
                    moveCard={moveCard} 
                    editText={editText}
                />
            )
        }

        const appendCard = () => {
            let next_id = idcount;
            setIdcount (next_id + 1);
            setCards (
                update (cards, {
                    $push: [
                        {
                            id: next_id,
                            text: 'toagne' + next_id
                        }
                    ],
                }),
            )
        }

        return (
            <>  
                <FadeinFX>
                    <DndProvider backend={Backend}>
                        <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
                        <div>
                            <button onClick={appendCard}>Append Card</button>
                        </div>
                    </DndProvider>
                    <textarea style={ta_style} value={JSON.stringify (cards, null, '  ')} />
                </FadeinFX>
            </>
        )
    }
}



export default Container
