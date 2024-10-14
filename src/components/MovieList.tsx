import type { FC } from 'react';
import { memo } from 'react';
import type { Movie } from '../types';
import { MovieListModes } from './MovieList.types';

interface MovieListProps {
  mode: MovieListModes;
  movies: Movie[];
}

export const MovieList: FC<MovieListProps> = memo(
  ({ mode = MovieListModes.GRID, movies = [] }) => {
    return (
      <ul className={['movie-list', mode].join(' ')}>
        {movies.map(({ id, name, picture }) => (
          <li key={`movie-${id}`} className="movie-list-item">
            <img
              className="movie-list-picture"
              src={picture}
              alt={`Affiche de ${name}`}
            />
            {name}
          </li>
        ))}
      </ul>
    );
  },
);

// For what it’s worth, not a solution I like.
// Prevents memo’d components from appearing as “Anonymous” in dev tools.
MovieList.displayName = 'MovieList';
