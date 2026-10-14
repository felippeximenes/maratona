import assert from 'node:assert/strict';
import { test } from 'node:test';

import { formatEpisodeCode } from './episode-code.ts';

test('formats season and episode as "T2 E5"', () => {
  assert.equal(formatEpisodeCode(2, 5), 'T2 E5');
});

test('keeps season 0 (Extras) as T0', () => {
  assert.equal(formatEpisodeCode(0, 1), 'T0 E1');
});
