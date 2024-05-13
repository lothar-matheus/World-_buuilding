// WorldList.jsx
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue,remove } from 'firebase/database';
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

  //usando remove
  const handleDeleteWorld = (worldId) => {
    const worldRef = ref(db, `mundo/${worldId}`);
    remove(worldRef)
      .then(() => {
        console.log('Mundo deletado com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao deletar o mundo', error);
      });
  };

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
            <button>Explore!</button>
            <button>Editar</button>
            <button onClick={() => handleDeleteWorld(world.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorldList;