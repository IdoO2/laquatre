import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react';

import type { Movie } from '../types';
import * as api from '../api';
import { URL_SEARCH_PARAM, useMasterSearch } from './MasterSearch.helpers';

function getMockLocationParams(href: string = 'https://example.com') {
  return {
    windowLocation: {
      href,
      search: (href.match(/\?.+/) || '')[0],
    } as unknown as Location,
    windowHistory: {
      pushState: vi.fn(),
    } as unknown as History,
  };
}

describe('The Master Search custom hook', () => {
  it('returns sane initial state', () => {
    const { windowLocation, windowHistory } = getMockLocationParams();
    const { result } = renderHook(() =>
      useMasterSearch(windowLocation, windowHistory),
    );

    expect(result.current).toEqual({
      searchResults: [],
      setSearchResults: expect.any(Function),
      searchedTerm: '',
      setSearchedTerm: expect.any(Function),
    });
  });

  describe('runs an initial search from query string', () => {
    it('runs no search if no query string', () => {
      vi.spyOn(api, 'fetchMoviesByKeyword').mockReturnValue(
        Promise.resolve({ results: [] }),
      );

      const { windowLocation, windowHistory } = getMockLocationParams();

      renderHook(() => useMasterSearch(windowLocation, windowHistory));

      expect(api.fetchMoviesByKeyword).not.toHaveBeenCalled();
    });

    it('runs no search for faulty query string and resets QS', () => {
      vi.spyOn(api, 'fetchMoviesByKeyword').mockReturnValue(
        Promise.resolve({ results: [] }),
      );

      const { windowLocation, windowHistory } = getMockLocationParams(
        `https://example.com?${URL_SEARCH_PARAM}=1c`,
      );

      renderHook(() => useMasterSearch(windowLocation, windowHistory));

      expect(api.fetchMoviesByKeyword).not.toHaveBeenCalled();

      return vi.waitFor(() => {
        expect(location.search).toBe('');
      });
    });

    it('runs a search for a given query string, and only one', () => {
      vi.spyOn(api, 'fetchMoviesByKeyword').mockReturnValue(
        Promise.resolve({ results: [] }),
      );

      const sought = 'movie';
      const { windowLocation, windowHistory } = getMockLocationParams(
        `https://example.com/?${URL_SEARCH_PARAM}=${sought}`,
      );

      renderHook(() => useMasterSearch(windowLocation, windowHistory));

      return vi.waitFor(() => {
        expect(api.fetchMoviesByKeyword).toHaveBeenCalledTimes(1);
        expect(api.fetchMoviesByKeyword).toHaveBeenCalledWith(sought);
        expect(windowHistory.pushState).toHaveBeenLastCalledWith(
          expect.any(Object),
          '',
          'https://example.com/',
        );
      });
    });
  });

  it('allows updating search terms, provides updated value, and updates query string', () => {
    const sought = 'find me';
    const { windowLocation, windowHistory } = getMockLocationParams();

    const { result } = renderHook(() =>
      useMasterSearch(windowLocation, windowHistory),
    );

    act(() => {
      result.current.setSearchedTerm(sought);
    });

    expect(result.current.searchedTerm).toBe(sought);
    return vi.waitFor(() => {
      expect(windowHistory.pushState).toHaveBeenLastCalledWith(
        expect.any(Object),
        '',
        new URL('https://example.com/?keyword=find+me'),
      );
    });
  });

  it('allows updating search results and provides updated value', () => {
    const newResults = [] as Movie[];
    const { windowLocation, windowHistory } = getMockLocationParams();

    const { result } = renderHook(() =>
      useMasterSearch(windowLocation, windowHistory),
    );

    act(() => {
      result.current.setSearchResults(newResults);
    });

    expect(result.current.searchResults).toEqual(newResults);
  });

  it('prevents concurrent calls', () => {
    vi.spyOn(api, 'fetchMoviesByKeyword').mockReturnValue(
      Promise.resolve({ results: [] }),
    );
    const { windowLocation, windowHistory } = getMockLocationParams();

    const { result } = renderHook(() =>
      useMasterSearch(windowLocation, windowHistory),
    );

    act(() => {
      result.current.setSearchedTerm('first');
      result.current.setSearchedTerm('second');
    });

    expect(api.fetchMoviesByKeyword).toHaveBeenCalledTimes(1);
  });
});
