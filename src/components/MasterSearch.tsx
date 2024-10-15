import type { ChangeEvent, FC } from 'react';
import { useCallback } from 'react';
import { MovieList } from './MovieList';
import { MovieListModes } from './MovieList.types';
import { useMasterSearch } from './MasterSearch.helpers';

export const MasterSearch: FC = () => {
  const { searchResults, setSearchResults, searchedTerm, setSearchedTerm } =
    useMasterSearch(window.location);

  // TODO Debounce
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
        type="text"
        className="field jumbo-search"
        value={searchedTerm}
        onChange={updateSearchedTerm}
      />
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
