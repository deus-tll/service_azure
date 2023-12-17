import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchCraftedImages} from "../../../redux/actions/craftedImagesActions/actions";
import CraftedImagesList from "./CraftedImagesList";
import {Link} from "react-router-dom";


const Home = () => {
  const dispatch = useDispatch();
  const craftedImageState = useSelector((state) => state.craftedImage);

  useEffect(() => {
    dispatch(fetchCraftedImages());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {craftedImageState.loading && <p>Loading Crafted Images...</p>}
          {craftedImageState.error && <p>Error: {craftedImageState.error.message}</p>}
          {craftedImageState.craftedImages && (
            <>
              <h1 className="mb-4">Crafted Images</h1>

              <div className="mb-3">
                <Link to={"/craft-image"} className="btn btn-dark">
                  Craft New Image
                </Link>
              </div>

              <CraftedImagesList craftedImages={craftedImageState.craftedImages}/>
            </>
          ) }
        </div>
      </div>
    </div>
  );
};

export default Home;