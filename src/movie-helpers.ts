import type { DBMovie, Movie } from './types';

const DUPLICATE_SLASH_REGEX = /\/+/g;
const FALLBACK_POSTER =
  'https://imgix.ranker.com/user_node_img/50045/1000882195/original/-and-quot-i-have-now-and-quot-photo-u1?fit=crop&fm=pjpg&q=60&w=200&dpr=2';

export function mapDBMoviesToAppMovies(movies: DBMovie[]): Movie[] {
  return (
    movies
      // TODO Do we want this (esp. in search): no image -> no film?
      .filter(
        ({ poster_path, name, title }) =>
          Boolean(poster_path) && Boolean(name || title),
      )
      // TODO Sort available in URL params
      .sort(({ vote_average: a }, { vote_average: b }) => b - a)
      .map(({ id, name, poster_path, title, vote_average }) => ({
        id,
        name: name || title || '',
        // TODO get base URL, handle image size
        picture: poster_path
          ? 'https://' +
            'image.tmdb.org' +
            `/t/p/w200/${poster_path}`.replace(DUPLICATE_SLASH_REGEX, '/')
          : FALLBACK_POSTER,
        score: vote_average,
      }))
  );
}
