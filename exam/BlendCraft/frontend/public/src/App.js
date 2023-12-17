import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/routing/RootLayout";
import Home from "./components/pages/Home/Home";
import CraftImage from "./components/pages/CraftImage/CraftImage";
import CraftedImageDetails from "./components/pages/CraftedImageDetails/CraftedImageDetails";


function App() {
  const router = createBrowserRouter([
    {
      path: '/', element: <RootLayout/>,
      children: [
        { path: '/', element: <Home/> },
        { path: '/craft-image', element: <CraftImage/> },
        { path: '/crafted-image/:id', element: <CraftedImageDetails/> }
      ]
    }
  ]);

  return <RouterProvider router={router} basename={process.env.PUBLIC_URL} />;
}

export default App;
