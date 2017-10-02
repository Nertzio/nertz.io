import React from 'react';
import { CardFront, CardBack } from '../Stack';
import { DragSource } from 'react-dnd'

const cardSource = {
  beginDrag(props) {
    return {}
  }
}

const ItemTypes = {
    CARD: 'card'
}


function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}


const Card = (props) => {
  const {
    suit,
    name,
    number,
    isFaceUp,
    belongsTo,
    stackPosition
   } = props;

   const { connectDragSource, isDragging } = props

  return connectDragSource(
    <div style={{
      opacity: isDragging ? 0.5 : 1,
      border: '1px gray solid',
      position: 'absolute',
      height: '100%',
      margin: '0 auto',
      transform: `translate(0px, ${stackPosition * 1}px)`,
      width: '80%',
      zIndex: stackPosition,
    }}>
      {isFaceUp
        ? <CardFront {...props} />
        : <CardBack {...props} />
      }
    </div>
  )
}


export default DragSource(ItemTypes.CARD, cardSource, collect)(Card)

