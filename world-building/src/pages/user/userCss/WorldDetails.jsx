import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, set, push, get, child } from 'firebase/database';
import { storage, database } from '../../../firebaseDatabase';

const WorldDetails = () => {
  const location = useLocation();
  const selectedWorld = location.state?.selectedWorld || {};
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [items, setItems] = useState([]);

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
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const saveItem = () => {
    if (inputValue.trim() !== '') {
      const itemsRef = dbRef(database, `worlds/${selectedWorld.id}/${modalType}`);
      const newItemRef = push(itemsRef);
      const itemData = {
        content: inputValue,
        timestamp: Date.now()
      };
      set(newItemRef, itemData)
        .then(() => {
          console.log(`${modalType} added successfully`);
          closeModal();
          setInputValue('');
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

  const fetchItems = async (type) => {
    if (selectedWorld.id) {
      const itemsRef = dbRef(database, `worlds/${selectedWorld.id}/${type}`);
      const snapshot = await get(itemsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const itemList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setItems(itemList);
      } else {
        setItems([]); // No items found
      }
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
        <div>
          <button onClick={() => openModal('story')}>Add Story</button>
          <button onClick={() => fetchItems('story')}>Show Stories</button>
        </div>
        <div>
          <button onClick={() => openModal('character')}>Add Character</button>
          <button onClick={() => fetchItems('character')}>Show Characters</button>
        </div>
        <div>
          <button onClick={() => openModal('location')}>Add Location</button>
          <button onClick={() => fetchItems('location')}>Show Locations</button>
        </div>
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

      {items.length > 0 && (
        <div className="items-list">
          <h3>{modalType.charAt(0).toUpperCase() + modalType.slice(1)} List</h3>
          <ul>
            {items.map(item => (
              <li key={item.id}>{item.content}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WorldDetails;
