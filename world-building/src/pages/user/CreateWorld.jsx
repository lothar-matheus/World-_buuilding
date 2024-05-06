import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, set } from 'firebase/database';
import './userCss/createWorld.css';
import firebaseConfigWorld from '../../firebaseWorld';

const CreateWorld = () => {
  const [worldName, setWorldName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [creatorName, setCreatorName] = useState('Matheus');
  const [systemName, setSystemName] = useState('D&D');
  const [notes, setNotes] = useState('');
  const [editingWorld, setEditingWorld] = useState(null); // Estado para armazenar o ID do mundo sendo editado
  const db = getDatabase();

  // Função para carregar os dados do mundo atualmente em edição, se houver
  useEffect(() => {
    if (editingWorld) {
      const worldRef = ref(db, `mundo/${editingWorld}`);
      // Obtém os dados do mundo atual e define os valores nos estados
      const fetchData = async () => {
        try {
          const snapshot = await worldRef.get();
          if (snapshot.exists()) {
            const worldData = snapshot.val();
            setWorldName(worldData.name);
            setCreatorName(worldData.criador);
            setSystemName(worldData.sistema);
            setNotes(worldData.notes);
          } else {
            console.log("No data available");
          }
        } catch (error) {
          console.error("Error getting document:", error);
        }
      };
      fetchData();
    }
  }, [editingWorld, db]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const worldsRef = ref(db, 'mundo');
    const newWorldRef = push(worldsRef); // Obtém uma referência de um novo nó com uma chave exclusiva gerada automaticamente
    const worldKey = newWorldRef.key; // Obtém a chave gerada automaticamente

    // Agora, você pode definir os dados usando a chave
    set(ref(db, `mundo/${worldKey}`), {
      name: worldName,
      notes: notes,
      criador: creatorName,
      sistema: systemName
    }).then(() => {
      // Se a criação do mundo for bem-sucedida, exibe os detalhes no console
      console.log('Mundo criado com sucesso!');
      console.log('Nome do Mundo:', worldName);
      console.log('Criador:', creatorName);
      console.log('Sistema:', systemName);
      // Define a mensagem de sucesso no estado
      setSuccessMessage('Mundo criado com sucesso!');
      // Limpa os campos do formulário após o envio
      setWorldName('');
      setCreatorName('');
      setSystemName('');
      setNotes('');
    }).catch((error) => {
      // Se ocorrer um erro durante a criação do mundo, exibe o erro no console
      console.error('Erro ao criar mundo:', error);
      // Define a mensagem de erro no estado
      setSuccessMessage('Erro ao criar mundo. Verifique o console para mais detalhes.');
    });
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
    </div>
  );
};

export default CreateWorld;
