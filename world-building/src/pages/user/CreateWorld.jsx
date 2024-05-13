import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';
import { useLocation } from 'react-router-dom';
import firebaseConfigWorld from '../../firebaseWorld';
import { Link } from 'react-router-dom';

const CreateWorld = () => {
  const [worldName, setWorldName] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [systemName, setSystemName] = useState('');
  const [notes, setNotes] = useState('');
  const [editingWorld, setEditingWorld] = useState(null);
  const [showRedirectButton, setShowRedirectButton] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const db = getDatabase();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.editingWorld) {
      const { id, name, criador, sistema, notes } = location.state.editingWorld;
      setWorldName(name);
      setCreatorName(criador);
      setSystemName(sistema);
      setNotes(notes);
      setEditingWorld({ id, name, criador, sistema, notes });
    }
  }, [location.state]);

  useEffect(() => {
    if (editingWorld) {
      const worldRef = ref(db, `mundo/${editingWorld.id}`);
      const unsubscribe = onValue(worldRef, (snapshot) => {
        const worldData = snapshot.val();
        if (worldData) {
          setWorldName(worldData.name);
          setCreatorName(worldData.criador);
          setSystemName(worldData.sistema);
          setNotes(worldData.notes);
        }
      });
      return () => unsubscribe();
    }
  }, [editingWorld, db]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const worldsRef = ref(db, 'mundo');

    if (editingWorld) {
      const worldRef = ref(db, `mundo/${editingWorld.id}`);
      set(worldRef, {
        name: worldName,
        notes: notes,
        criador: creatorName,
        sistema: systemName,
      })
        .then(() => {
          console.log('World updated successfully');
          setSuccessMessage('World updated successfully');
          setWorldName('');
          setCreatorName('');
          setSystemName('');
          setNotes('');
          setEditingWorld(null);
          setShowRedirectButton(true);
        })
        .catch((error) => {
          console.error('Error updating world:', error);
          setSuccessMessage('Error updating world. Check the console for details.');
        });
    } else {
      const newWorldRef = push(worldsRef);
      const worldKey = newWorldRef.key;

      set(ref(db, `mundo/${worldKey}`), {
        name: worldName,
        notes: notes,
        criador: creatorName,
        sistema: systemName,
      })
        .then(() => {
          console.log('World created successfully');
          setSuccessMessage('World created successfully');
          setWorldName('');
          setCreatorName('');
          setSystemName('');
          setNotes('');
          setShowRedirectButton(true);
        })
        .catch((error) => {
          console.error('Error creating world:', error);
          setSuccessMessage('Error creating world. Check the console for details.');
        });
    }
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
        <label>
          Nome do Criador:
          <input
            type="text"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
          />
        </label>
        <label>
          Sistema:
          <input
            type="text"
            value={systemName}
            onChange={(e) => setSystemName(e.target.value)}
          />
        </label>
        <label>
          Notas:
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        <button type="submit">Criar Mundo</button>
      </form>
      {showRedirectButton && (
        <Link to="/world-list">
          <button>Ver Mundos Criados</button>
        </Link>
      )}
    </div>
  );
};

export default CreateWorld;