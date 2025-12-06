import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/home';
import Chat from '@/pages/Chat';

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'chat', // /chat
        element: <Chat />,
      },
    ],
  },
]);
