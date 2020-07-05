import React, { useState, useEffect } from 'react';
import '../assets/styles/containers/Player.scss';

const Loader = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'green',
      color: '#fff',
    }}
  >
    Cargando...
  </div>
);

const Player = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState(null);
  const [source, setSource] = useState(null);
  useEffect(() => {
    const { id, source } = props.location.state;

    setIsLoading(false);

    setId(id);

    setSource(source);
  }, []);

  return (
    <div className="player">
      {isLoading ? (
        <Loader />
      ) : (
        <video controls autoPlay>
          <source src={source} type="video/mp4" />
        </video>
      )}

      <div className="player-back">
        <button type="button" onClick={() => props.history.goBack()}>
          Regresar
        </button>
      </div>
    </div>
  );
};

export default Player;
