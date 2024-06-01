import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, set, push, get, remove } from 'firebase/database';
import { storage, database } from '../../../firebaseDatabase';

const WorldDetails = () => {
  const location = useLocation();
  const selectedWorld = location.state?.selectedWorld || {};
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [locationImageUpload, setLocationImageUpload] = useState(null);
  const [characterImageUpload, setCharacterImageUpload] = useState(null);
  const [characterPdfUpload, setCharacterPdfUpload] = useState(null);
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [items, setItems] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);

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
    setDescriptionValue('');
    setLocationImageUpload(null);
    setCharacterImageUpload(null);
    setCharacterPdfUpload(null);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescriptionValue(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageUpload(file);
  };

  const handleLocationImageUpload = (e) => {
    const file = e.target.files[0];
    setLocationImageUpload(file);
  };

  const handleCharacterImageUpload = (e) => {
    const file = e.target.files[0];
    setCharacterImageUpload(file);
  };

  const handleCharacterPdfUpload = (e) => {
    const file = e.target.files[0];
    setCharacterPdfUpload(file);
  };

  const saveItem = () => {
    if (inputValue.trim() !== '') {
      const itemsRef = dbRef(database, `worlds/${selectedWorld.id}/${modalType}`);
      const newItemRef = push(itemsRef);
      const itemData = {
        content: inputValue,
        description: modalType === 'location' || modalType === 'character' ? descriptionValue : '',
        timestamp: Date.now()
      };
      set(newItemRef, itemData)
        .then(() => {
          console.log(`${modalType} added successfully`);
          if (modalType === 'location' && locationImageUpload) {
            uploadLocationImage(newItemRef.key);
          } else if (modalType === 'character') {
            if (characterImageUpload) {
              uploadCharacterImage(newItemRef.key);
            }
            if (characterPdfUpload) {
              uploadCharacterPdf(newItemRef.key);
            }
          } else {
            closeModal();
          }
          setInputValue('');
          setDescriptionValue('');
        })
        .catch((error) => {
          console.error(`Error adding ${modalType}:`, error);
        });
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const itemRef = dbRef(database, `worlds/${selectedWorld.id}/${modalType}/${itemId}`);
      await remove(itemRef);
      console.log(`${modalType} excluído com sucesso`);
      setItemToDelete(null);
      fetchItems(modalType);
    } catch (error) {
      console.error(`Erro ao excluir ${modalType}:`, error);
    }
  };

  const uploadLocationImage = (itemId) => {
    const imageRef = storageRef(storage, `worlds/${selectedWorld.id}/locations/${itemId}`);
    uploadBytes(imageRef, locationImageUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((downloadURL) => {
            const itemRef = dbRef(database, `worlds/${selectedWorld.id}/location/${itemId}`);
            set(itemRef, { content: inputValue, description: descriptionValue, imageUrl: downloadURL, timestamp: Date.now() })
              .then(() => {
                console.log('Location image URL saved to database');
                closeModal();
              })
              .catch((error) => {
                console.error('Error saving location image URL:', error);
              });
          })
          .catch((error) => {
            console.error('Error getting download URL:', error);
          });
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  };

const uploadCharacterImage = (itemId) => {
  const imageRef = storageRef(storage, `worlds/${selectedWorld.id}/characters/${itemId}/image`);
  uploadBytes(imageRef, characterImageUpload)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref)
        .then((downloadURL) => {
          const itemRef = dbRef(database, `worlds/${selectedWorld.id}/characters/${itemId}`);
          set(itemRef, { content: inputValue, description: descriptionValue, imageUrl: downloadURL, timestamp: Date.now() })
            .then(() => {
              console.log('Character image URL saved to database');
              closeModal();
            })
            .catch((error) => {
              console.error('Error saving character image URL:', error);
            });
        })
        .catch((error) => {
          console.error('Error getting download URL:', error);
        });
    })
    .catch((error) => {
      console.error('Error uploading image:', error);
    });
};

  const uploadCharacterPdf = (itemId) => {
    const pdfRef = storageRef(storage, `worlds/${selectedWorld.id}/characters/${itemId}/pdf`);
    uploadBytes(pdfRef, characterPdfUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((downloadURL) => {
            const itemRef = dbRef(database, `worlds/${selectedWorld.id}/character/${itemId}`);
            set(itemRef, { content: inputValue, description: descriptionValue, pdfUrl: downloadURL, timestamp: Date.now() })
              .then(() => {
                console.log('Character PDF URL saved to database');
                closeModal();
              })
              .catch((error) => {
                console.error('Error saving character PDF URL:', error);
              });
          })
          .catch((error) => {
            console.error('Error getting download URL:', error);
          });
      })
      .catch((error) => {
        console.error('Error uploading PDF:', error);
      });
  };

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
  
  const handleDeleteItem = (itemId) => {
    setItemToDelete(itemId);
  };

  return (
    <div className="world-background" style={{ backgroundImage: `url(${backgroundUrl})` }}>
      <h1>{selectedWorld.name}</h1>
      <p>{selectedWorld.notes}</p>
      <input type="file" onChange={handleImageUpload} className="custom-file-input" />
      <button onClick={uploadImage}>Add Background</button>

      <div>
        <h2>Adicionar informações ao mundo</h2>
        <div className='divLogin'>
          <button onClick={() => openModal('story')}>Add Story</button>
          <button onClick={() => fetchItems('story')}>Show Stories</button>
        </div>
        <div className='divLogin'>
          <button onClick={() => openModal('character')}>Add Character</button>
          <button onClick={() => fetchItems('character')}>Show Characters</button>
        </div>
        <div className='divLogin'>
          <button onClick={() => openModal('location')}>Add Location</button>
          <button onClick={() => fetchItems('location')}>Show Locations</button>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add {modalType}</h3>
            <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Name" />
            {(modalType === 'location' || modalType === 'character') && (
              <>
                <textarea
                  value={descriptionValue}
                  onChange={handleDescriptionChange}
                  placeholder="Description"
                  rows="4"
                ></textarea>
                <label>
                  Upload Image
                  <input type="file" onChange={modalType === 'location' ? handleLocationImageUpload : handleCharacterImageUpload} className="custom-file-input" />
                </label>
                {modalType === 'character' && (
                  <label>
                    Upload PDF
                    <input type="file" onChange={handleCharacterPdfUpload} className="custom-file-input" />
                  </label>
                )}
              </>
            )}
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
              <li key={item.id}>
                <p>{item.content}</p>
                {item.description && <p>{item.description}</p>}
                {item.imageUrl && <img src={item.imageUrl} alt={item.content} className="location-thumbnail" />}
                {item.pdfUrl && (
                  <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer">
                    View PDF
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {itemToDelete && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir este item?</p>
            <button onClick={() => deleteItem(itemToDelete)}>Excluir</button>
            <button onClick={() => setItemToDelete(null)}>Cancelar</button>
          </div>
        </div>
      )}{items.length > 0 && (
        <div className="items-list">
          <h3>{modalType.charAt(0).toUpperCase() + modalType.slice(1)} List</h3>
          <ul>
            {items.map(item => (
              <li key={item.id}>
                <p>{item.content}</p>
                {item.description && <p>{item.description}</p>}
                {item.imageUrl && <img src={item.imageUrl} alt={item.content} className="location-thumbnail" />}
                {item.pdfUrl && (
                  <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer">
                    View PDF
                  </a>
                )}
                <button onClick={() => handleDeleteItem(item.id)}>Excluir</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    
  );
};

export default WorldDetails;
