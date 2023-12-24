import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {fetchCraftedImage} from "../../../redux/actions/craftedImagesActions/actions";
import {formattedDate} from "../../service/functions";
import Stage from "../../service/Stage";


const CraftedImageDetails = () => {
  const dispatch = useDispatch();
  const { id: craftedImageId } = useParams();
  const {error, currentCraftedImage} = useSelector(state => state.craftedImages);

  useEffect(() => {
    dispatch(fetchCraftedImage(craftedImageId));
  }, [dispatch, craftedImageId]);

  return(
    currentCraftedImage && (
      <div className="pt-3">
        <h2 className="pt-1 pb-1 text-center">Crafted Image Details</h2>

        <div className="block">
          <h4 className="pt-3 pb-3 text-center">Name: {currentCraftedImage.photoName}</h4>

          <hr className="text-danger"/>

          <Stage stageNumber="First"
                 craftingFlag={false}
                 stageDescription={`Your request was accepted at (${formattedDate(currentCraftedImage.createdAt)})`}
                 linkAndImageList={[
                   { image: currentCraftedImage.photoFrontUrl, textForLink: "Photo with the desired foreground" },
                   { image: currentCraftedImage.photoBackgroundUrl, textForLink: "Photo with the desired background" }
                 ]}
          />
          <hr className="text-danger"/>


          {currentCraftedImage.photoFrontNoBgUrl && (
            <>
              <Stage stageNumber="Second"
                     craftingFlag={false}
                     stageDescription={`Background was removed at (${formattedDate(currentCraftedImage.bgRemovedAt)})`}
                     linkAndImageList={[
                       { image: currentCraftedImage.photoFrontNoBgUrl, textForLink: "Photo with the desired foreground and a removed background." }
                     ]}/>
              <hr className="text-danger"/>
            </>
          )}


          {currentCraftedImage.photoMixResultUrl && (
            <>
              <Stage stageNumber="Third"
                     craftingFlag={false}
                     stageDescription={`Photos were mixed at (${formattedDate(currentCraftedImage.photosMixedAt)})`}
                     linkAndImageList={[
                       { image: currentCraftedImage.photoMixResultUrl, textForLink: "Mixture of photos featuring the desired foreground and background." }
                     ]}/>
              <hr className="text-danger"/>
            </>
          )}


          {currentCraftedImage.photoFinishedAt && (
            <>
              <Stage stageNumber="Fourth"
                     craftingFlag={false}
                     stageDescription={`Crafted image was finished and saved to database at (${formattedDate(currentCraftedImage.photoFinishedAt)}).`} />
              <hr className="text-danger"/>
            </>
          )}

          <>
            <br/>
            <p className="text-center">Thank you for using our services!</p>
          </>

          {error && (
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error occurred!</h4>
              <p>Error: {error}</p>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default CraftedImageDetails;