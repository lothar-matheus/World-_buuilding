
import React from 'react';
import { useLocation } from 'react-router-dom';

const WorldDetails = () => {
  const location = useLocation();
  const selectedWorld = location.state?.selectedWorld || {};

  return (
    <div>
      <h1>{selectedWorld.name}</h1>
      <p>{selectedWorld.notes}</p>
    </div>
  );
};

export default WorldDetails;