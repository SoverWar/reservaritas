import React, { useState, useEffect, useCallback } from 'react';

import { useDrop } from 'react-dnd';

import MesaForm from './MesaForm';
import Item from './Item';



async function createMesa(mesa) {
    const response = await fetch('http://localhost:3001/mesas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mesa),
    });

    if (!response.ok) {
        throw new Error('Error creando la mesa');
    }

    const createdMesa = await response.json();
    
    return createdMesa;
}

async function getMesas() {
    const response = await fetch('http://localhost:3001/mesas');

    if (!response.ok) {
        throw new Error('Error obteniendo las mesas');
    }

    const mesas = await response.json();
    return mesas.map((mesa) => ({
        id: mesa.id,
        type: mesa.forma,
        top: mesa.top,
        left: mesa.left,
        numero: mesa.numero,  // incluir numero
        comensales: mesa.comensales,  // incluir comensales
    }));
}


async function updateMesa(mesa) {
    const response = await fetch(`http://localhost:3001/mesas/${mesa.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({top: mesa.top, left: mesa.left}),
    });

    if (!response.ok) {
        throw new Error('Error actualizando la mesa');
    }

    return response.json();
}

function Reservations() {
    const [items, setItems] = useState([]);
    const [counter, setCounter] = useState(4);
    const [modalOpen, setModalOpen] = useState(false);
    const [mesa, setMesa] = useState({top: 0, left: 0, forma: ''});  // Nuevo estado para 'mesa'
    const [draggingItem, setDraggingItem] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null); // mover con flechas



    const handleKeyDown = useCallback(async (event) => {
        if (!selectedItemId) return;
        const arrowKeys = [37, 38, 39, 40];
        if (!arrowKeys.includes(event.keyCode)) return;
    
        const selectedItem = items.find(item => item.id === selectedItemId);
        if (!selectedItem) return;
    
        let newTop = selectedItem.top;
        let newLeft = selectedItem.left;
    
        switch (event.keyCode) {
            case 37: // Left arrow
                newLeft -= 1;
                break;
            case 38: // Up arrow
                newTop -= 1;
                break;
            case 39: // Right arrow
                newLeft += 1;
                break;
            case 40: // Down arrow
                newTop += 1;
                break;
            default:
                return;
        }
    
        // Validar que las nuevas coordenadas están dentro del plano
        if (newTop < 0 || newTop > 500 || newLeft < 0 || newLeft > 500) return;
    
        const updatedMesa = { ...selectedItem, top: newTop, left: newLeft };
        try {
            await updateMesa(updatedMesa);
            setItems(items.map(item => item.id === selectedItemId ? updatedMesa : item));
        } catch (error) {
            console.error('Error actualizando la mesa:', error);
        }
    }, [items, selectedItemId]);
    
    
    
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    
    
    
    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleMesaSubmit = async (numero, comensales) => {
        const { top, left, forma } = mesa;  // asumiendo que tienes un estado `mesa`
        const newMesa = { numero, comensales, top, left, forma };
        try {
            const createdMesa = await createMesa(newMesa);
            addItem(forma, top, left, createdMesa.id);
        } catch (error) {
            console.error('Error creando la mesa:', error);
        }
        // Cierra el formulario modal
        handleModalClose();
    };
    
    useEffect(() => {
        getMesas()
            .then(mesas => {
                setItems(mesas);
            })
            .catch(error => console.error('Error obteniendo las mesas:', error));
    }, []);

    const addItem = (forma, top, left, id) => {
        setItems([...items, { id, type: forma, top, left }]);
        setCounter(counter + 1);
    };
    
    const moveItem = async (id, newTop, newLeft) => {
        setDraggingItem({ id, top: newTop, left: newLeft })
        const mesa = items.find(item => item.id === id);
        if (!mesa) {
            console.error(`No se encontró mesa con id ${id}`);
            return;
        }
    const updatedMesa = { ...mesa, top: newTop, left: newLeft };
    try {
        await updateMesa(updatedMesa);
        setItems(items.map(item => item.id === id ? updatedMesa : item));
    } catch (error) {
        console.error('Error actualizando la mesa:', error);
    }
};


const [, drop] = useDrop({
    accept: 'ITEM',
    drop: async (item, monitor) => {
      const offset = monitor.getClientOffset();
      const plano = document.getElementById('plano');
      const rect = plano.getBoundingClientRect();
      const newTop = offset.y - rect.top - 1;
      const newLeft = offset.x - rect.left - 1;

      if (item.new) {
           
        const newMesa = {top: newTop, left: newLeft, forma: item.type}; 
        setMesa(newMesa);  // Actualizar el estado de 'mesa'
        handleModalOpen();
       
      } else {
        moveItem(item.id, newTop, newLeft);
      }
      setDraggingItem(null);
    }
  });

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'row' }}>
      <div id="plano" ref={drop} style={{ position: 'relative', width: 500, height: 500, border: '1px solid black' }}>
      {items.map(item => (
          <Item 
            key={item.id} 
            id={item.id} 
            type={item.type} 
            top={item.top} 
            left={item.left} 
            numero={item.numero} 
            comensales={item.comensales}
            moveItem={moveItem} 
            draggingItem={draggingItem}
            setSelectedItemId={setSelectedItemId}
          />
        ))}
      </div>
      <div id="fuera" style={{ marginLeft: 50 }}>
        <div>Fuera del plano:</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Item type="cuadrado" top={20} left={20} new setSelectedItemId={setSelectedItemId} />
          <Item type="circulo" top={90} left={20} new setSelectedItemId={setSelectedItemId}/>
          <Item type="rectangulo" top={160} left={20} new setSelectedItemId={setSelectedItemId}/>
        </div>
      </div>
      <MesaForm open={modalOpen} handleClose={handleModalClose} onSubmit={handleMesaSubmit} />
    </div>
  );
}



export default Reservations;
