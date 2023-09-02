import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function ReservarMesaModal({ open, handleClose, mesaId }) {
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [numeroPersonas, setNumeroPersonas] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');

    const handleReservaSubmit = async () => {
        const response = await fetch('http://localhost:3001/reservaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ MesaId: mesaId, Nombre: nombre, Telefono: telefono, NumeroPersonas: numeroPersonas, FechaReservacion: fecha, HoraReservacion: hora }),
        });

        if (!response.ok) {
            console.error('Error reservando la mesa');
            return;
        }

        setNombre('');
        setTelefono('');
        setNumeroPersonas('');
        setFecha('');
        setHora('');
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <div style={{ padding: '20px', backgroundColor: 'black', margin: '50px auto', maxWidth: '400px', borderRadius: '10px' }}>
                <h2>Reservar Mesa</h2>
                <TextField label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} fullWidth style={{ marginBottom: '10px' }} />
                <TextField label="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} fullWidth style={{ marginBottom: '10px' }} />
                <TextField label="Número de Personas" value={numeroPersonas} onChange={(e) => setNumeroPersonas(e.target.value)} fullWidth style={{ marginBottom: '10px' }} />
                <TextField label="Fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} fullWidth style={{ marginBottom: '10px' }} />
                <TextField label="Hora" type="time" value={hora} onChange={(e) => setHora(e.target.value)} fullWidth style={{ marginBottom: '10px' }} />
                <Button variant="contained" color="primary" onClick={handleReservaSubmit} fullWidth>Reservar</Button>
            </div>
        </Modal>
    );
}

export default ReservarMesaModal;
