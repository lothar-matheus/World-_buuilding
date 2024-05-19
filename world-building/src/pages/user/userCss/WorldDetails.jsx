import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, set, push } from 'firebase/database';
import { storage, database } from '../../../firebaseDatabase'

const WorldDetails = () => {
  const location = useLocation();
  const selectedWorld = location.state?.selectedWorld || {};
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [imageUpload, setImageUpload] = useState(null);

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setInputValue('');
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const saveItem = () => {
    if (inputValue.trim() !== '') {
      const itemsRef = dbRef(database, `worlds/${selectedWorld.id}/${modalType}`);
      const newItemRef = push(itemsRef);
      set(newItemRef, inputValue)
        .then(() => {
          console.log(`${modalType} added successfully`);
          closeModal();
        })
        .catch((error) => {
          console.error(`Error adding ${modalType}:`, error);
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
              // Salvar a URL no banco de dados
              const imageRef = dbRef(database, `worlds/${selectedWorld.id}/backgroundUrl`);
              set(imageRef, downloadURL)
                .then(() => {
                  console.log('Image URL saved to database');
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
    <div>
      <h1>{selectedWorld.name}</h1>
      <p>{selectedWorld.notes}</p>
      <input type="file" onChange={handleImageUpload} />
      <button onClick={uploadImage}>Add Background</button>

      <div>
        <h2>Sections</h2>
        <button onClick={() => openModal('story')}>Add Story</button>
        <button onClick={() => openModal('character')}>Add Character</button>
        <button onClick={() => openModal('location')}>Add Location</button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add {modalType}</h3>
            <input type="text" value={inputValue} onChange={handleInputChange} />
            <button onClick={saveItem}>Save</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldDetails;