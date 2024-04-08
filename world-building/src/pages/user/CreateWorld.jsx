import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import './userCss/createWorld.css'

const CreateWorld = () => {
  const [worldName, setWorldName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const db = getDatabase();

  const handleSubmit = (e) => {
    e.preventDefault();
    const worldsRef = ref(db, 'worlds');
    const newWorldRef = push(worldsRef);
    newWorldRef.set({
      name: worldName,
      notes: '',
    });
    setWorldName('');
    setSuccessMessage('Mundo criado com sucesso!');
  };

  return (
    <div>
      <h1>Criar Mundo</h1>
      {successMessage && <p>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Nome do Mundo:
          <input
            type="text"
            value={worldName}
            onChange={(e) => setWorldName(e.target.value)}
          />
        </label>
        <button type="submit">Criar Mundo</button>
      </form>
    </div>
  );
};

export default CreateWorld;