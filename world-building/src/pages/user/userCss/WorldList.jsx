import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import firebaseConfigWorld from '../../../firebaseWorld';
import WorldDetails from './WorldDetails';
import { Link } from 'react-router-dom';
import Welcome from '../Welcome';

const WorldList = () => {
  const [worlds, setWorlds] = useState([]);
  const db = getDatabase();
  const navigate = useNavigate();

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

  const handleDeleteWorld = (worldId) => {
    const worldRef = ref(db, `mundo/${worldId}`);
    remove(worldRef)
      .then(() => {
        console.log('World deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting world:', error);
      });
  };

  const handleEditWorld = (world) => {
    navigate('/create-world', { state: { editingWorld: world } });
  };
  const handleExploreWorld = (world) => {
    navigate('/world-details', { state: { selectedWorld: world } });
  };

  return (
    <div>
      <h1>Mundos Criados</h1>
      
      <button onClick={()=> navigate('../welcome')}>Voltar ao início</button>
      
      <ul className='worldul'>
        {worlds.map((world) => (
          <li key={world.id}>
            <div className='divLogin'>
            <h2 className='worldName'>{world.name}</h2>
            <p>Criador: {world.criador}</p>
            <p>Sistema: {world.sistema}</p>
            <p>Notas: {world.notes}</p>
            <button onClick={() => handleExploreWorld(world)}>Explorar</button>
            <button onClick={() => handleEditWorld(world)}>Editar</button>
            <button onClick={() => handleDeleteWorld(world.id)}>Excluir</button>
            </div>
            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorldList;