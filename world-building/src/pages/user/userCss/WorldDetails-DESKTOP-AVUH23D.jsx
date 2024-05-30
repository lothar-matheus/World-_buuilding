import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, set, push, get } from 'firebase/database';
import { storage, database } from '../../../firebaseDatabase';

const WorldDetails = () => {
  const location = useLocation();
  const selectedWorld = location.state?.selectedWorld || {}; // Obtém o mundo selecionado a partir do estado da localização
  const [showModal, setShowModal] = useState(false); // Estado para controlar a visibilidade do modal
  const [modalType, setModalType] = useState(''); // Tipo de modal a ser exibido (história, personagem, mapa)
  const [inputValue, setInputValue] = useState(''); // Valor do input para a história
  const [imageUpload, setImageUpload] = useState(null); // Estado para armazenar a imagem a ser carregada
  const [backgroundUrl, setBackgroundUrl] = useState(''); // URL da imagem de fundo
  const [characterName, setCharacterName] = useState(''); // Nome do personagem
  const [characterAge, setCharacterAge] = useState(''); // Idade do personagem
  const [characterSex, setCharacterSex] = useState(''); // Sexo do personagem
  const [characterLocation, setCharacterLocation] = useState(''); // Localização do personagem
  const [characterIntroduction, setCharacterIntroduction] = useState(''); // Introdução do personagem
  const [mapName, setMapName] = useState(''); // Nome do mapa
  const [mapLocation, setMapLocation] = useState(''); // Localização do mapa
  const [mapEvents, setMapEvents] = useState(''); // Eventos no mapa

  // Efeito para buscar a URL da imagem de fundo do Firebase ao montar o componente
  useEffect(() => {
    const fetchBackgroundUrl = async () => {
      const backgroundUrlRef = dbRef(database, `worlds/${selectedWorld.id}/backgroundUrl`);
      const snapshot = await get(backgroundUrlRef);
      if (snapshot.exists()) {
        setBackgroundUrl(snapshot.val());
      }
    };

    if (selectedWorld.id) {
      fetchBackgroundUrl();
    }
  }, [selectedWorld.id]);

  // Função para abrir o modal e definir seu tipo
  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  // Função para fechar o modal e resetar os campos de entrada
  const closeModal = () => {
    setShowModal(false);
    setInputValue('');
    setCharacterName('');
    setCharacterAge('');
    setCharacterSex('');
    setCharacterLocation('');
    setCharacterIntroduction('');
    setMapName('');
    setMapLocation('');
    setMapEvents('');
  };

  // Handlers para mudanças nos inputs
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCharacterNameChange = (e) => {
    setCharacterName(e.target.value);
  };

  const handleCharacterAgeChange = (e) => {
    setCharacterAge(e.target.value);
  };

  const handleCharacterSexChange = (e) => {
    setCharacterSex(e.target.value);
  };

  const handleCharacterLocationChange = (e) => {
    setCharacterLocation(e.target.value);
  };

  const handleCharacterIntroductionChange = (e) => {
    setCharacterIntroduction(e.target.value);
  };

  const handleMapNameChange = (e) => {
    setMapName(e.target.value);
  };

  const handleMapLocationChange = (e) => {
    setMapLocation(e.target.value);
  };

  const handleMapEventsChange = (e) => {
    setMapEvents(e.target.value);
  };

  // Função para salvar o item no Firebase
  const saveItem = () => {
    const worldId = selectedWorld.id;

    if (modalType === 'story' && inputValue.trim() !== '') {
      const itemsRef = dbRef(database, `worlds/${worldId}/stories`);
      const newItemRef = push(itemsRef);
      set(newItemRef, { description: inputValue })
        .then(() => {
          console.log('Story added successfully');
          closeModal();
        })
        .catch((error) => {
          console.error('Error adding story:', error);
        });
    } else if (modalType === 'character' && characterName.trim() !== '' && characterAge.trim() !== '' && characterSex.trim() !== '' && characterLocation.trim() !== '' && characterIntroduction.trim() !== '') {
      const itemsRef = dbRef(database, `worlds/${worldId}/characters`);
      const newItemRef = push(itemsRef);
      set(newItemRef, {
        name: characterName,
        age: characterAge,
        sex: characterSex,
        location: characterLocation,
        introduction: characterIntroduction
      })
        .then(() => {
          console.log('Character added successfully');
          closeModal();
        })
        .catch((error) => {
          console.error('Error adding character:', error);
        });
    } else if (modalType === 'map' && mapName.trim() !== '' && mapLocation.trim() !== '' && mapEvents.trim() !== '') {
      const itemsRef = dbRef(database, `worlds/${worldId}/maps`);
      const newItemRef = push(itemsRef);
      set(newItemRef, {
        name: mapName,
        location: mapLocation,
        events: mapEvents
      })
        .then(() => {
          console.log('Map added successfully');
          closeModal();
        })
        .catch((error) => {
          console.error('Error adding map:', error);
        });
    }
  };

  // Função para lidar com upload de imagem
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageUpload(file);
  };

  // Função para fazer o upload da imagem para o Firebase Storage e salvar a URL no Database
  const uploadImage = () => {
    if (imageUpload) {
      const imageRef = storageRef(storage, `worlds/${selectedWorld.id}/background`);
      uploadBytes(imageRef, imageUpload)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((downloadURL) => {
              console.log('Image uploaded successfully. URL:', downloadURL);
              const imageUrlRef = dbRef(database, `worlds/${selectedWorld.id}/backgroundUrl`);
              set(imageUrlRef, downloadURL)
                .then(() => {
                  console.log('Image URL saved to database');
                  setBackgroundUrl(downloadURL); // Atualiza o estado da URL da imagem de fundo
                })
                .catch((error) => {
                  console.error('Error saving image URL:', error);
                });
            })
            .catch((error) => {
              console.error('Error getting download URL:', error);
            });
        })
        .catch((error) => {
          console.error('Error uploading image:', error);
        });
    }
  };

  return (
    <div className="world-background" style={{ backgroundImage: `url(${backgroundUrl})` }}>
      <h1>{selectedWorld.name}</h1>
      <p>{selectedWorld.notes}</p>
      <input type="file" onChange={handleImageUpload} />
      <button onClick={uploadImage}>Add Background</button>

      <div className='secLore'>
        <h2>Sections</h2>
        <button onClick={() => openModal('story')}>Add Story</button>
        <button onClick={() => openModal('character')}>Add Character</button>
        <button onClick={() => openModal('map')}>Add Map</button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}</h3>
            {modalType === 'story' && (
              <>
                <textarea value={inputValue} onChange={handleInputChange} placeholder="Story description" />
              </>
            )}
            {modalType === 'character' && (
              <>
                <input type="text" value={characterName} onChange={handleCharacterNameChange} placeholder="Character name" />
                <input type="number" value={characterAge} onChange={handleCharacterAgeChange} placeholder="Character age" />
                <input type="text" value={characterSex} onChange={handleCharacterSexChange} placeholder="Character sex" />
                <input type="text" value={characterLocation} onChange={handleCharacterLocationChange} placeholder="Character location" />
                <textarea value={characterIntroduction} onChange={handleCharacterIntroductionChange} placeholder="Character introduction" />
              </>
            )}
            {modalType === 'map' && (
              <>
                <input type="text" value={mapName} onChange={handleMapNameChange} placeholder="Map name" />
                <input type="text" value={mapLocation} onChange={handleMapLocationChange} placeholder="Map location" />
                <textarea value={mapEvents} onChange={handleMapEventsChange} placeholder="Map events" />
              </>
            )}
            <button onClick={saveItem}>Save</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldDetails;
