import React, { useState } from 'react';
import { useGetCharactersQuery, useGetCharacterDetailsQuery } from './generated/graphql';

const CharactersList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1); 
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  const { data, loading, error, fetchMore } = useGetCharactersQuery({
    variables: { page: currentPage },
  });

  const { data: characterDetailsData, loading: detailsLoading } = useGetCharacterDetailsQuery({
    variables: { id: selectedCharacterId },
    skip: !selectedCharacterId, 
  });

  
  const goToNextPage = () => {
    const nextPage = data?.characters.info.next;
    if (nextPage) {
      setCurrentPage(nextPage);
    }
  };

  const goToPrevPage = () => {
    const prevPage = data?.characters.info.prev;
    if (prevPage) {
      setCurrentPage(prevPage);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      {data?.characters?.results?.map(({ id, name, image }) => 
        id && name && image ? (
          <div key={id} onClick={() => setSelectedCharacterId(id)} style={{ cursor: 'pointer' }}>
            <img src={image} alt={name} />
            <p>{name}</p>
          </div>
        ) : null
      )}

      {/* Pagination controls */}
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={goToPrevPage} disabled={!data?.characters.info.prev}>Previous</button>
        <button onClick={goToNextPage} disabled={!data?.characters.info.next}>Next</button>
      </div>

      {selectedCharacterId && characterDetailsData && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', 
          backgroundColor: 'white',
          padding: '20px',
          border: '1px solid #ccc',
          zIndex: 100,
          overflowY: 'auto', 
          maxHeight: '80%', 
          width: '60%', 
          boxSizing: 'border-box' 
        }}>
          {detailsLoading ? (
            <p>Loading details...</p>
          ) : (
            <>
              <h2>{characterDetailsData.character?.name}</h2>
              <img src={characterDetailsData.character?.image} alt={characterDetailsData.character?.name} style={{ width: '200px' }} />
              <p>Status: {characterDetailsData.character?.status}</p>
              <p>Species: {characterDetailsData.character?.species}</p>
              <p>Type: {characterDetailsData.character?.type || 'N/A'}</p>
              <p>Gender: {characterDetailsData.character?.gender}</p>
              <p>Origin: {characterDetailsData.character?.origin?.name}</p>
              <p>Location: {characterDetailsData.character?.location?.name}</p>
              <div>
                <h3>Episodes:</h3>
                <ul>
                  {characterDetailsData.character?.episode.map((episode, index) => 
                    episode ? <li key={index}>{episode.name} - {episode.episode}</li> : null
                  )}
                </ul>
              </div>
              <button onClick={() => setSelectedCharacterId(null)}>Close</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CharactersList;




