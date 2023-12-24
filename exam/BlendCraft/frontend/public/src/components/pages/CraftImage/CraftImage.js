import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {craftImage, nullifyCraftedImage} from "../../../redux/actions/craftImageActions/actions";
import CraftImageForm from "./form/CraftImageForm";
import CraftImageStages from "./stages/CraftImageStages";

const CraftImage = () => {
  const dispatch = useDispatch();
  const { craftedImage, error, loading} = useSelector((state) => state.craftImage)

  const [name, setName] = useState('');
  const [filePhotoFront, setFilePhotoFront] = useState(null);
  const [filePhotoBackground, setFilePhotoBackground] = useState(null);

  const [nameError, setNameError] = useState('');
  const [filePhotoFrontError, setFilePhotoFrontError] = useState('');
  const [filePhotoBackgroundError, setFilePhotoBackgroundError] = useState('');


  useEffect(() => {
    return () => {
      dispatch(nullifyCraftedImage());
    };
  }, [dispatch]);


  const validateInputs = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!filePhotoFront) {
      setFilePhotoFrontError('Photo with desired foreground is required');
      isValid = false;
    } else {
      setFilePhotoFrontError('');
    }

    if (!filePhotoBackground) {
      setFilePhotoBackgroundError('Photo with desired background is required');
      isValid = false;
    } else {
      setFilePhotoBackgroundError('');
    }

    return isValid;
  };

  const handleCraftImage = () => {
    if (validateInputs() && !loading) {
      dispatch(craftImage(name, filePhotoFront, filePhotoBackground));
    }
  };

  const handleFilePhotoFrontChange = (e) => {
    if (!loading) {
      setFilePhotoFront(e.target.files[0]);
    }
  };

  const handleFilePhotoBackgroundChange = (e) => {
    if (!loading) {
      setFilePhotoBackground(e.target.files[0]);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb4 text-center">Craft Image</h2>

      <CraftImageForm
        name={name}
        loading={loading}
        handleCraftImage={handleCraftImage}
        handleNameChange={(value) => setName(value)}
        handleFilePhotoFrontChange={handleFilePhotoFrontChange}
        handleFilePhotoBackgroundChange={handleFilePhotoBackgroundChange}
        nameError={nameError}
        filePhotoFrontError={filePhotoFrontError}
        filePhotoBackgroundError={filePhotoBackgroundError}
      />

      {!craftedImage && error && (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error occurred!</h4>
          <p>Error: {error}</p>
        </div>
      )}

      <CraftImageStages/>
    </div>
  );
};

export default CraftImage;