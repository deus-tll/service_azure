import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchCraftedImages} from "../../../redux/actions/craftedImagesActions/actions";
import CraftedImagesList from "./CraftedImagesList";
import {Link} from "react-router-dom";


const Home = () => {
  const dispatch = useDispatch();
  const craftedImagesState = useSelector((state) => state.craftedImages);

  useEffect(() => {
    dispatch(fetchCraftedImages());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {craftedImagesState.loading && <p>Loading Crafted Images...</p>}
          {craftedImagesState.error && <p>Error: {craftedImagesState.error.message}</p>}
          {craftedImagesState.craftedImages && (
            <>
              <h1 className="mb-4 text-center">Crafted Images</h1>

              <div className="d-flex justify-content-center align-items-center mb-3">
                <Link to={"/craft-image"} className="btn btn-dark">
                  Craft New Image
                </Link>
              </div>

              <CraftedImagesList craftedImages={craftedImagesState.craftedImages}/>
            </>
          ) }
        </div>
      </div>
    </div>
  );
};

export default Home;