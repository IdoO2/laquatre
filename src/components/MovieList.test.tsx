import { afterEach, describe, it, expect } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import { MovieList } from './MovieList';
import { MovieListModes } from './MovieList.types';

describe('The MovieList component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders an empty list', () => {
    const { getByTestId } = render(<MovieList />);

    expect(getByTestId('movie-list')?.children.length).toBe(0);
    expect(getByTestId('movie-list')?.className).toBe('movie-list grid');
  });

  it('renders given movies', () => {
    const movies = [
      {
        id: 1,
        name: 'One',
        picture: '1.png',
        score: 5,
      },
      {
        id: 2,
        name: 'Two',
        picture: '2.png',
        score: 10,
      },
    ];

    const { getAllByTestId, getByTestId, queryByText } = render(
      <MovieList movies={movies} />,
    );

    const list = getByTestId('movie-list');
    const listItems = list?.children;
    const images = getAllByTestId('movie-list-image') as HTMLImageElement[];

    expect(listItems.length).toBe(2);
    expect(queryByText('One')).not.toBeNull();
    expect(queryByText('Two')).not.toBeNull();
    images?.map((img, index) => {
      expect(img.src).toMatch(`${index + 1}.png`);
    });
  });

  it('displays in the expected mode', () => {
    const { getByTestId } = render(<MovieList mode={MovieListModes.LIST} />);

    expect(getByTestId('movie-list')?.className).toBe('movie-list list');
  });
});
