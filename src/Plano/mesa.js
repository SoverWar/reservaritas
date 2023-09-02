import React from 'react';
import { useDrag } from 'react-dnd'

function Mesa({ id, top, left, moveMesa }) {
  const [, ref] = useDrag({
    type: 'MESA',
    item: { id },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const top = Math.round(item.top + delta.y);
      const left = Math.round(item.left + delta.x);
      moveMesa(item.id, top, left);
    },
  });

  return (
    <div ref={ref} style={{ position: 'absolute', top, left, width: 50, height: 50, backgroundColor: 'blue' }}>
      {id}
    </div>
  );
}

export default Mesa;