import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect} from "react";
import { MainNavigation } from "./MainNavigation";
import fetchUser from "../../redux/actions/userActions/actions";

const RootLayout = () => {
  const appName = 'Blend Craft';
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return(
    <div className="container mt-4">
      {userState.loading && <p>Loading...</p>}
      {userState.error && <p>Error: {userState.error.message}</p>}
      {userState.user && (
        <>
          <header className="mb-4">
            <h1 className="text-center">{appName}</h1>
            <MainNavigation />
          </header>

          <main style={{ minHeight: 'calc(100vh - 230px)' }}>
            <Outlet />
          </main>

          <footer className=" mt-4">
            <p>&copy; {new Date().getFullYear()} {appName}</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default RootLayout;