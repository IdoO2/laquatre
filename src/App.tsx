import type { FC } from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import { MasterSearch } from './components/MasterSearch';
import type { DBListResponse, Movie } from './types';
import { MovieList } from './components/MovieList';
import { MovieListModes } from './components/MovieList.types'
import { mapDBMoviesToAppMovies } from './movie-helpers';
import { API_V3_BASE_URL } from './consts';

// TODO Proper URL building
const API_DISCOVER_URL = `${API_V3_BASE_URL}/discover/tv?api_key=92b418e837b833be308bbfb1fb2aca1e&language=en-US&sort_by=popularity.desc&page=1&timezone=America/New_York&include_null_first_air_dates=false`;

export const App: FC = () => {
  const [suggestedMovies, setSuggestedMovies] = useState<Movie[]>([]);
  const [movieFetchError, setMovieFetchError] = useState(false);

  // TODO Clean, isolate
  useEffect(() => {
    if (suggestedMovies.length || movieFetchError) return;
    fetch(API_DISCOVER_URL)
      .then((res) => {
        return res.json();
      })
      // TODO Better `fetch` typing
      .then(({ results }: DBListResponse) => {
        const movies = mapDBMoviesToAppMovies(results);
        setSuggestedMovies(movies.slice(0, 8));
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
