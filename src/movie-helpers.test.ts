import { describe, expect, it } from 'vitest';

import { mapDBMoviesToAppMovies } from './movie-helpers';

describe('The Movie mapper creates an application movie from a DB movie', () => {
  const id = 1;
  const name = 'Name';
  const title = 'Title';
  const poster_path = '/abc.png';
  const vote_average = 5;

  it('handles empty lists', () => {
    expect(mapDBMoviesToAppMovies([])).toEqual([]);
  });

  describe('ensures all fields are present', () => {
    it('Removes movies with no poster', () => {
      const DBMovies = [
        {
          id,
          name,
          title,
          vote_average,
        },
      ];

      expect(mapDBMoviesToAppMovies(DBMovies)).toEqual([]);
    });

    it('Uses `title` when `name` is not available', () => {
      const DBMovies = [
        {
          id,
          name: '',
          title,
          poster_path,
          vote_average,
        },
      ];

      expect(mapDBMoviesToAppMovies(DBMovies)).toEqual([
        {
          id,
          name: title,
          picture: `https://image.tmdb.org/t/p/w200${poster_path}`,
          score: vote_average,
        },
      ]);
    });

    it('Removes movies with no name or title', () => {
      const DBMovies = [
        {
          id,
          name: '',
          title: '',
          poster_path,
          vote_average,
        },
      ];

      expect(mapDBMoviesToAppMovies(DBMovies)).toEqual([]);
    });
  });

  it('builds proper URLs', () => {
    const ids = [1, 2];

    const DBMovies = ids.map((id) => ({
      id,
      name,
      title,
      poster_path: `/${id}.png`,
      vote_average,
    }));

    const AppMovies = ids.map((id) => ({
      id,
      name,
      picture: `https://image.tmdb.org/t/p/w200${id}.png`,
      score: vote_average,
    }));

    expect(AppMovies[0]).toEqual({
      id: DBMovies[0].id,
      name: DBMovies[0].name,
      picture: `https://image.tmdb.org/t/p/w200${DBMovies[0].id}.png`,
      score: DBMovies[0].vote_average,
    });

    expect(AppMovies[1]).toEqual({
      id: DBMovies[1].id,
      name: DBMovies[1].name,
      picture: `https://image.tmdb.org/t/p/w200${DBMovies[1].id}.png`,
      score: DBMovies[1].vote_average,
    });
  });

  it('sorts by average score', () => {
    const movies = [
      [1, 4],
      [2, 8],
      [3, 2],
    ].map(([movieId, score]) => ({
      id: movieId,
      name,
      title,
      poster_path,
      vote_average: score,
    }));

    const output = mapDBMoviesToAppMovies(movies);
    const sortedIdList = output.map(({ score }) => score);

    expect(sortedIdList).toEqual([8, 4, 2]);
  });
});
