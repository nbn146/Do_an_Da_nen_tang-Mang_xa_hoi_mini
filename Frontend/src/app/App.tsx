// import { RouterProvider } from 'react-router';
// import { router } from './routes';

// export default function App() {
//   return (
//     <div className="size-full">
//       <RouterProvider router={router} />
//     </div>
//   );
// }
import { Routes, Route } from 'react-router-dom';
import { LoginView } from './components/LoginView';
import { RegisterView } from './components/RegisterView';
import { SocialMediaApp} from './components/SocialMediaApp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SocialMediaApp />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />
    </Routes>
  );
}

export default App;