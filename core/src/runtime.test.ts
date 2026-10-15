import assert from 'node:assert/strict';
import { test } from 'node:test';

import { movieRuntime, seasonRuntimes } from './runtime.ts';

test('TMDB wins over TVmaze', () => {
  assert.deepEqual(seasonRuntimes([{ runtimeTmdb: 50, runtimeTvmaze: 45 }], null), [
    { runtime: 50, isEstimated: false },
  ]);
});

test('TVmaze fills a missing TMDB runtime', () => {
  assert.deepEqual(seasonRuntimes([{ runtimeTmdb: null, runtimeTvmaze: 45 }], null), [
    { runtime: 45, isEstimated: false },
  ]);
});

test('missing runtime uses the season average, marked as estimated', () => {
  const result = seasonRuntimes(
    [
      { runtimeTmdb: 50, runtimeTvmaze: null },
      { runtimeTmdb: 61, runtimeTvmaze: null },
      { runtimeTmdb: null, runtimeTvmaze: null },
    ],
    30,
  );
  assert.deepEqual(result[2], { runtime: 56, isEstimated: true });
});

test('season without any runtime uses the typical runtime, then 40', () => {
  const episodes = [{ runtimeTmdb: null, runtimeTvmaze: null }];
  assert.deepEqual(seasonRuntimes(episodes, 22), [{ runtime: 22, isEstimated: true }]);
  assert.deepEqual(seasonRuntimes(episodes, null), [{ runtime: 40, isEstimated: true }]);
});

test('zero or over 5 hours counts as missing', () => {
  const result = seasonRuntimes(
    [
      { runtimeTmdb: 0, runtimeTvmaze: null },
      { runtimeTmdb: 301, runtimeTvmaze: null },
    ],
    null,
  );
  assert.deepEqual(result, [
    { runtime: 40, isEstimated: true },
    { runtime: 40, isEstimated: true },
  ]);
});

test('movie falls back to 100 minutes', () => {
  assert.deepEqual(movieRuntime(118), { runtime: 118, isEstimated: false });
  assert.deepEqual(movieRuntime(null), { runtime: 100, isEstimated: true });
});
