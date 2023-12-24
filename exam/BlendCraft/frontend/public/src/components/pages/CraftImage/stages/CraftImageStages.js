import {useDispatch, useSelector} from "react-redux";
import SocketConnection from "../socket/SocketConnection";
import Stage from "../../../service/Stage";
import {useEffect, useState} from "react";
import {
  nullifyCraftedImage,
  setErrorCraftingImage,
  updateCraftedImage
} from "../../../../redux/actions/craftImageActions/actions";
import {formattedDate} from "../../../service/functions";


const CraftImageStages = () => {
  const dispatch = useDispatch();
  const { craftedImage, craftedImageId, error, loading } = useSelector((state) => state.craftImage)

  const [successImageBgRemoverMessage, setSuccessImageBgRemoverMessage] = useState('');
  const [successImageMixerMessage, setSuccessImageMixerMessage] = useState('');
  const [imageCraftingFinishedMessage, setImageCraftingFinishedMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdateCraftedImage = (craftedImage, loading = true) => {
    dispatch(updateCraftedImage(craftedImage, loading));
  };

  const handleError = (error) => {
    dispatch(setErrorCraftingImage(error));
  };

  return (
    <>
      {craftedImageId && (
        <SocketConnection
          craftedImageId={craftedImageId}
          setSuccessImageBgRemoverMessage={setSuccessImageBgRemoverMessage}
          setSuccessImageMixerMessage={setSuccessImageMixerMessage}
          setImageCraftingFinishedMessage={setImageCraftingFinishedMessage}
          setErrorMessage={setErrorMessage}
          setErrorCraftingImage={handleError}
          updateCraftedImage={handleUpdateCraftedImage}
        />
      )}

      {craftedImage && (
        <div className="pt-3">
          <div className="block">
            <Stage stageNumber="First"
                   stageDescription={`Your request was accepted(${formattedDate(craftedImage.createdAt)})`}
                   linkAndImageList={[
                     { image: craftedImage.photoFrontUrl, textForLink: "Photo with the desired foreground" },
                     { image: craftedImage.photoBackgroundUrl, textForLink: "Photo with the desired background" }
                   ]}
            />
            <hr className="text-danger"/>


            {craftedImage.photoFrontNoBgUrl && (
              <>
                <Stage stageNumber="Second"
                       stageDescription={`${successImageBgRemoverMessage}(${formattedDate(craftedImage.bgRemovedAt)})`}
                       linkAndImageList={[
                         { image: craftedImage.photoFrontNoBgUrl, textForLink: "Photo with the desired foreground and a removed background." }
                       ]}/>
                <hr className="text-danger"/>
              </>
            )}


            {craftedImage.photoMixResultUrl && (
              <>
                <Stage stageNumber="Third"
                       stageDescription={`${successImageMixerMessage}(${formattedDate(craftedImage.photosMixedAt)})`}
                       linkAndImageList={[
                         { image: craftedImage.photoMixResultUrl, textForLink: "Mixture of photos featuring the desired foreground and background." }
                       ]}/>
                <hr className="text-danger"/>
              </>
            )}


            {craftedImage.photoFinishedAt && (
              <>
                <Stage stageNumber="Fourth"
                       stageDescription={`${imageCraftingFinishedMessage}(${formattedDate(craftedImage.photoFinishedAt)}). 
                                    All necessary data was saved to database and now you can find this image in your general list!`} />
                <hr className="text-danger"/>

                {!loading && (
                  <>
                    <br/>
                    <p className="text-center">Thank you for using our services!</p>
                  </>
                )}
              </>
            )}

            {error && (
              <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">Error occurred!</h4>
                <p>Error Message: {errorMessage}</p>
                <p>Error: {error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CraftImageStages;