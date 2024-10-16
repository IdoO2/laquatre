/* Helpers related to search rules */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { ListResponse, Movie } from '../types';
import { fetchMoviesByKeyword } from '../api';
import { sanitiseInput } from '../form-helpers';

const MIN_TITLE_SEARCH_LENGTH = 4;
const MAX_TITLE_SEARCH_LENGTH = 40;
const noop = () => {};

export const URL_SEARCH_PARAM = 'keyword';

export function useMasterSearch(
  windowLocation: Location,
  windowHistory: History,
) {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchedTerm, setSearchedTerm] = useState<string>('');
  const searchOngoing = useRef(false);

  const successCallback = useCallback(
    ({ results }: Pick<ListResponse, 'results'>) => {
      reflectSearchOnURL({ windowLocation, windowHistory }, searchedTerm);
      setSearchResults(results);
    },
    [windowHistory, windowLocation, searchedTerm],
  );

  // TODO User feedback, possibly retry
  const errorCallback = noop;

  useEffect(() => {
    // Run previous search from query string,
    // ONCE, on page load
    const query = getQueryFromURL(windowLocation.search);
    if (query && !searchOngoing.current) {
      searchOngoing.current = true;
      fetchMoviesForQuery(query)
        .then(successCallback)
        .catch(errorCallback)
        .finally(() => {
          searchOngoing.current = false;
        });
      setSearchedTerm(query);
    }
    reflectSearchOnURL({ windowLocation, windowHistory }, query);
    // Because we want this to run only once,
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!searchedTermsAreValid(searchedTerm)) return;
    if (!searchOngoing.current) {
      // Perform new search when search terms have changed
      searchOngoing.current = true;
      fetchMoviesForQuery(searchedTerm)
        .then(successCallback)
        .catch(errorCallback)
        .finally(() => (searchOngoing.current = false));
    }
  }, [errorCallback, searchedTerm, successCallback]);

  return useMemo(
    () => ({
      searchResults,
      setSearchResults,
      searchedTerm,
      setSearchedTerm,
    }),
    [searchResults, setSearchResults, searchedTerm, setSearchedTerm],
  );
}

function searchedTermsAreValid(query: string) {
  return (
    query.length >= MIN_TITLE_SEARCH_LENGTH &&
    query.length <= MAX_TITLE_SEARCH_LENGTH
  );
}

function reflectSearchOnURL(
  {
    windowLocation,
    windowHistory,
  }: { windowLocation: Location; windowHistory: typeof window.history },
  query: string,
) {
  const url = new URL(windowLocation.href);

  if (!searchedTermsAreValid(query)) {
    windowHistory.pushState({}, '', windowLocation.href.split('?')[0]);
    return;
  }

  url.searchParams.set(URL_SEARCH_PARAM, query);
  windowHistory.pushState({}, '', url);
}

// `search` from `window.location`
function getQueryFromURL(search: string) {
  if (search) {
    const params = new URLSearchParams(search);
    const query = params.get(URL_SEARCH_PARAM) || '';
    if (!searchedTermsAreValid(query)) {
      return '';
    }
    return query;
  }
  return '';
}

function fetchMoviesForQuery(terms: string) {
  const query = sanitiseInput(terms);

  if (!searchedTermsAreValid(query)) {
    return Promise.reject('Searched terms invalid.');
  }

  return fetchMoviesByKeyword(query);
}
