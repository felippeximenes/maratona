import assert from 'node:assert/strict';
import { test } from 'node:test';

import { airMoment } from './air-moment.ts';

test('exact when TVmaze gives a time, even if TMDB date differs', () => {
  assert.deepEqual(airMoment({ airDate: '2026-10-18', airstamp: '2026-10-19T02:00:00Z' }), {
    quality: 'exact',
    at: new Date('2026-10-19T02:00:00Z'),
  });
});

test('date only when there is just the TMDB date', () => {
  assert.deepEqual(airMoment({ airDate: '2026-10-18', airstamp: null }), {
    quality: 'date',
    date: '2026-10-18',
  });
});

test('none without date', () => {
  assert.deepEqual(airMoment({ airDate: null, airstamp: null }), { quality: 'none' });
});
