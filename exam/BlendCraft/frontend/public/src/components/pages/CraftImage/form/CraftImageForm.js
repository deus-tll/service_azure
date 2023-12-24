import FormField from './FormField';

const CraftImageForm = ({ name, loading, handleCraftImage,
                          handleNameChange, handleFilePhotoFrontChange, handleFilePhotoBackgroundChange,
                          nameError, filePhotoFrontError, filePhotoBackgroundError
                        }) => {
  return (
    <div className="d-flex justify-content-center align-items-center pt-4 pb-4 block">
      <form className="w-50">
        <FormField
          label="Name"
          value={name}
          error={nameError}
          onChange={(e) => handleNameChange(e.target.value)}
          disabled={loading}
        />

        <FormField
          label="Foreground Photo"
          type="file"
          error={filePhotoFrontError}
          onChange={handleFilePhotoFrontChange}
          disabled={loading}
        />

        <FormField
          label="Background Photo"
          type="file"
          error={filePhotoBackgroundError}
          onChange={handleFilePhotoBackgroundChange}
          disabled={loading}
        />

        <div className="d-flex justify-content-center align-items-center">
          <button type="button"
                  className="btn btn-primary"
                  onClick={handleCraftImage}
                  disabled={loading}>
            {loading ? 'Crafting...' : 'Craft Image'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CraftImageForm;