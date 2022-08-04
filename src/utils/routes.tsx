import React from 'react';
import { BandRoute, CreateSetlistRoute, CreateSongRoute, SetlistRoute, SetlistsRoute, SongRoute, SongsRoute, UserRoute } from 'routes';

export const routes = [
  {
    key: 'user',
    path: "/user-settings",
    element: <UserRoute />
  },
  {
    key: 'band',
    path: "/band-settings/:bandId",
    element: <BandRoute />
  },
  {
    key: 'create-setlist',
    path: "/create-setlist/*",
    element: <CreateSetlistRoute />
  },
  {
    key: 'create-song',
    path: "/create-song",
    element: <CreateSongRoute />
  },
  {
    key: 'songs',
    path: "/songs",
    element: <SongsRoute />
  },
  {
    key: 'song',
    path: "/songs/:songId",
    element: <SongRoute />
  },
  {
    key: 'setlists',
    path: "/setlists",
    element: <SetlistsRoute />
  },
  {
    key: 'setlist',
    path: "/setlists/:setlistId",
    element: <SetlistRoute />
  },
]