import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MovieList from './pages/MovieList';
import MovieDetails from './pages/MovieDetails';
import FavoritesPage from './pages/FavoritesPage';


  
const router = createBrowserRouter([
  {
    path: "/",
    element: <MovieList/>,
  },
  {
    path: "/movie/:id",
    element: <MovieDetails/>,
  },
  {
    path: "/favorites",
    element: <FavoritesPage/>,
  },
])


export {router};