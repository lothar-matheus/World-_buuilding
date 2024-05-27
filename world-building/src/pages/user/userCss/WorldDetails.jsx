import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, set, push, get } from 'firebase/database';
import { storage, database } from '../../../firebaseDatabase';

const WorldDetails = () => {
  const location = useLocation();
  const selectedWorld = location.state?.selectedWorld || {};
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [mapName, setMapName] = useState('');
  const [mapDescription, setMapDescription] = useState('');

  useEffect(() => {
    // Fetch the background URL from Firebase when the component mounts
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

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setInputValue('');
    setCharacterName('');
    setCharacterDescription('');
    setMapName('');
    setMapDescription('');
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCharacterNameChange = (e) => {
    setCharacterName(e.target.value);
  };

  const handleCharacterDescriptionChange = (e) => {
    setCharacterDescription(e.target.value);
  };

  const handleMapNameChange = (e) => {
    setMapName(e.target.value);
  };

  const handleMapDescriptionChange = (e) => {
    setMapDescription(e.target.value);
  };

  const saveItem = () => {
    if (modalType === 'story' && inputValue.trim() !== '') {
      const itemsRef = dbRef(database, `worlds/${selectedWorld.id}/stories`);
      const newItemRef = push(itemsRef);
      set(newItemRef, { description: inputValue })
        .then(() => {
          console.log('Story added successfully');
          closeModal();
        })
        .catch((error) => {
          console.error('Error adding story:', error);
        });
    } else if (modalType === 'character' && characterName.trim() !== '' && characterDescription.trim() !== '') {
      const itemsRef = dbRef(database, `worlds/${selectedWorld.id}/characters`);
      const newItemRef = push(itemsRef);
      set(newItemRef, { name: characterName, description: characterDescription })
        .then(() => {
          console.log('Character added successfully');
          closeModal();
        })
        .catch((error) => {
          console.error('Error adding character:', error);
        });
    } else if (modalType === 'map' && mapName.trim() !== '' && mapDescription.trim() !== '') {
      const itemsRef = dbRef(database, `worlds/${selectedWorld.id}/maps`);
      const newItemRef = push(itemsRef);
      set(newItemRef, { name: mapName, description: mapDescription })
        .then(() => {
          console.log('Map added successfully');
          closeModal();
        })
        .catch((error) => {
          console.error('Error adding map:', error);
        });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageUpload(file);
  };

  const uploadImage = () => {
    if (imageUpload) {
      const imageRef = storageRef(storage, `worlds/${selectedWorld.id}/background`);
      uploadBytes(imageRef, imageUpload)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((downloadURL) => {
              console.log('Image uploaded successfully. URL:', downloadURL);
              // Save the URL to the database
              const imageUrlRef = dbRef(database, `worlds/${selectedWorld.id}/backgroundUrl`);
              set(imageUrlRef, downloadURL)
                .then(() => {
                  console.log('Image URL saved to database');
                  setBackgroundUrl(downloadURL); // Update the background URL state
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

      <div>
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
                <textarea value={characterDescription} onChange={handleCharacterDescriptionChange} placeholder="Character description" />
              </>
            )}
            {modalType === 'map' && (
              <>
                <input type="text" value={mapName} onChange={handleMapNameChange} placeholder="Map name" />
                <textarea value={mapDescription} onChange={handleMapDescriptionChange} placeholder="Map description" />
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
