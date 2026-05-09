import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { Providers } from './provider/Providers';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          duration: 3000,
          style: {
            width: 'fit-content',
            maxWidth: '100vw',
          },
        }}
      />
    </Providers>
  );
}

export default App;
