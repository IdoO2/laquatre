import type { ChangeEvent, FC } from 'react';
import { useCallback } from 'react';
import { MovieList } from './MovieList';
import { MovieListModes } from './MovieList.types';
import { useMasterSearch } from './MasterSearch.helpers';

export const MasterSearch: FC = () => {
  const { searchResults, setSearchResults, searchedTerm, setSearchedTerm } =
    useMasterSearch(window.location);

  const updateSearchedTerm = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setSearchedTerm(value);
    },
    [setSearchedTerm],
  );

  const closeResults = useCallback(() => {
    setSearchResults([]);
  }, [setSearchResults]);

  return (
    <div className="master-search">
      <input
        id="master-search-field"
        type="text"
        className="field block-field jumbo-search"
        value={searchedTerm}
        onChange={updateSearchedTerm}
        placeholder="dolores"
      />
      <label htmlFor="master-search-field" className="block-field">
        Tapez quelques lettres pour lancer une recherche
      </label>
      {Boolean(searchResults.length) && (
        <div className="results-overlay">
          <button className="close-button" onClick={closeResults}>
            x
          </button>
          <MovieList mode={MovieListModes.LIST} movies={searchResults} />
        </div>
      )}
    </div>
  );
};
