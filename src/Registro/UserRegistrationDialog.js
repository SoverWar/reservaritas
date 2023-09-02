import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function UserRegistrationDialog({ open, onClose }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [privilegeLevel, setPrivilegeLevel] = useState("USER");

    const handleRegister = async () => {
        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    privilege_level: privilegeLevel
                })
            });

            if(response.ok) {
                alert("Usuario registrado con éxito.");
                onClose();
            } else {
                const data = await response.json();
                alert("Error al registrar usuario: " + data.message);
            }
        } catch (error) {
            alert("Hubo un error al intentar registrar el usuario.");
            console.error("Error:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Crear Usuario</DialogTitle>
            <DialogContent>
                <TextField fullWidth label="Nombre de usuario" value={username} onChange={e => setUsername(e.target.value)} />
                <TextField fullWidth label="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <FormControl fullWidth>
                    <InputLabel>Nivel de Privilegio</InputLabel>
                    <Select value={privilegeLevel} onChange={e => setPrivilegeLevel(e.target.value)}>
                        <MenuItem value="USER">Usuario</MenuItem>
                        <MenuItem value="ADMIN">Administrador</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button color="primary" onClick={handleRegister}>Crear</Button>
            </DialogActions>
        </Dialog>
    );
}

export default UserRegistrationDialog;
