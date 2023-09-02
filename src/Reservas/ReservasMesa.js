import React, { useState, useEffect } from 'react';
import Item from '../Plano/Item';
import ReservarMesaModal from './ReservarMesaModal';  // un componente que todavía necesitas crear

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

function ReservasMesas() {
    const [items, setItems] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        getMesas()
            .then(mesas => {
                setItems(mesas);
            })
            .catch(error => console.error('Error obteniendo las mesas:', error));
    }, []);

    const handleMesaClick = (mesa_id) => {
        // Abre el modal de reservación
        setModalOpen(true);
    
        // Guarda la reservación en la base de datos
        fetch('http://localhost:3001/reservaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                MesaId: mesa_id,
                Nombre: userData.nombre,
                Telefono: userData.telefono,
                NumeroPersonas: userData.numeroPersonas,
                FechaReservacion: userData.fecha,
                HoraReservacion: userData.hora,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Reservación guardada:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleUserDataSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const date = formData.get('date');
        const time = formData.get('time');
    
        // Guarda la fecha y la hora en el estado
        setUserData({ date, time });
    
        // Realiza una petición POST a la API
        fetch('http://localhost:3001/reservas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date, time }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Reserva guardada:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {userData ? (
                <>
                    <div id="plano" style={{ position: 'relative', width: 500, height: 500, border: '1px solid black' }}>
                        {items.map(item => (
                            <Item 
                                key={item.id} 
                                id={item.id} 
                                type={item.type} 
                                top={item.top} 
                                left={item.left} 
                                numero={item.numero} 
                                comensales={item.comensales}
                                onClick={() => handleMesaClick(item.id)}
                            />
                        ))}
                    </div>
                    <ReservarMesaModal open={modalOpen} handleClose={handleModalClose} />
                </>
            ) : (
                <form onSubmit={handleUserDataSubmit} style={{ textAlign: 'center' }}>
                    <label>
                        Fecha:
                        <input type="date" name="date" required />
                    </label>
                    <br />
                    <label>
                        Hora:
                        <input type="time" name="time" required />
                    </label>
                    <br />
                    <button type="submit">Enviar</button>
                </form>
            )}
        </div>
    );
}

export default ReservasMesas;
