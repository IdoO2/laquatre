import type { FC } from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import { MasterSearch } from './components/MasterSearch';
import type { Movie } from './types';
import { MovieList } from './components/MovieList';
import { MovieListModes } from './components/MovieList.types';
import { fetchSuggestedMovies } from './api';

export const App: FC = () => {
  const [suggestedMovies, setSuggestedMovies] = useState<Movie[]>([]);
  const [movieFetchError, setMovieFetchError] = useState(false);

  // TODO Clean, isolate
  useEffect(() => {
    if (suggestedMovies.length || movieFetchError) return;
    fetchSuggestedMovies()
      .then(({ results }) => {
        setSuggestedMovies(results.slice(0, 8));
      })
      .catch((error) => {
        // TODO User feedback, possibly Retry
        console.error(error);
        setMovieFetchError(true);
      });
  }, [movieFetchError, suggestedMovies]);

  return (
    <>
      <header id="main-header" className="page-section">
        <h1 className="title">La Quatre</h1>
      </header>
      <section id="search-section" className="page-section">
        <h1 className="section-title">Trouvez le film de vos rêves</h1>
        <MasterSearch />
      </section>
      <section id="list-section" className="page-section">
        <h1 className="section-title">Ou choisissez parmi notre sélection</h1>
        <MovieList mode={MovieListModes.GRID} movies={suggestedMovies} />
      </section>
    </>
  );
};

export default App;
