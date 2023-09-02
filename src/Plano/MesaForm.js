// MesaForm.js
import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function MesaForm({ open, handleClose, onSubmit }) {
    const [numero, setNumero] = useState('');
    const [comensales, setComensales] = useState('');

    const handleNumeroChange = (event) => {
        setNumero(event.target.value);
    };

    const handleComensalesChange = (event) => {
        setComensales(event.target.value);
    };

    const handleSubmit = () => {
        onSubmit(numero, comensales);
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <div style={{ backgroundColor: 'black', padding: '20px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <h2>Añadir Mesa</h2>
                <TextField label="Número de Mesa" value={numero} onChange={handleNumeroChange} />
                <TextField label="Número de Comensales" value={comensales} onChange={handleComensalesChange} />
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Añadir
                </Button>
            </div>
        </Modal>
    );
}


export default MesaForm;
