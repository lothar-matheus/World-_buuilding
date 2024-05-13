// WorldList.jsx
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import firebaseConfigWorld from '../../../firebaseWorld';

const WorldList = () => {
  const [worlds, setWorlds] = useState([]);
  const db = getDatabase();

  useEffect(() => {
    const worldsRef = ref(db, 'mundo');
    const unsubscribe = onValue(worldsRef, (snapshot) => {
      const worldData = snapshot.val() || {};
      const worldList = Object.entries(worldData).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      setWorlds(worldList);
    });

    return () => unsubscribe();
  }, [db]);

  return (
    <div>
      <h1>Mundos Criados</h1>
      <ul>
        {worlds.map((world) => (
          <li key={world.id}>
            <h2>{world.name}</h2>
            <p>Criador: {world.criador}</p>
            <p>Sistema: {world.sistema}</p>
            <p>Notas: {world.notes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorldList;