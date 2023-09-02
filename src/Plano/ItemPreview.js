import React from 'react';
import { useDragLayer } from 'react-dnd';

function ItemPreview() {
    const {itemType, item, currentOffset } = useDragLayer(monitor => ({
        itemType: monitor.getItemType(),
        item: monitor.getItem(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    }));
    
    function renderItem() {
        switch (itemType) {
            case 'ITEM':
                const style = {
                    transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
                    position: 'absolute',
                    width: 50,
                    height: 50,
                    borderRadius: item.type === 'circulo' ? '50%' : '0%',
                    backgroundColor: item.type === 'cuadrado' ? 'blue' : item.type === 'circulo' ? 'red' : 'green',
                };
    
                if (item.type === 'rectangulo') {
                    style.height = 100;
                }
    
                return <div style={style}>{item.numero} - {item.comensales}</div>;
            default:
                return null;
        }
    }
    
    if (!currentOffset) {
        return null;
    }

    return (
        <div style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}>
            {renderItem()}
        </div>
    );
}

export default ItemPreview;
