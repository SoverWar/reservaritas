import React, { useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';

function Item({ id, type, top, left, numero, comensales, moveItem, new: isNew,  draggingItem, setSelectedItemId, isDraggable }) {
    const ref = useRef(null);
    const [, drag] = useDrag({
        type: 'ITEM',
        item: { id, type, new: isNew },
        canDrag: isDraggable,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            if (!monitor.didDrop() && !item.new) {
                const offset = monitor.getSourceClientOffset();
                const newTop = offset.y - 20 - 1;
                const newLeft = offset.x - 20 - 1;
                moveItem(item.id, newTop, newLeft);
            }
        },
    });

    useEffect(() => {
        if (ref.current) {
            const topPos = draggingItem && draggingItem.id === id ? draggingItem.top : top;
            const leftPos = draggingItem && draggingItem.id === id ? draggingItem.left : left;
            ref.current.style.top = `${topPos}px`;
            ref.current.style.left = `${leftPos}px`;
        }
    }, [top, left, draggingItem, id]);

    const style = {
        position: isNew ? 'relative' : 'absolute',
        top,
        left,
        width: 50,
        height: 50,
        borderRadius: type === 'circulo' ? '50%' : '0%',
        backgroundColor: type === 'cuadrado' ? 'blue' : type === 'circulo' ? 'red' : 'green',
        marginBottom: isNew ? 10 : 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
    };

    if (type === 'rectangulo') {
        style.height = 100;
    }

    return (
        <div ref={drag} style={style} onClick={!isDraggable ? () => setSelectedItemId(id) : undefined}>
            N: {numero} 
            C: {comensales}
        </div>
    );
}

export default Item;
