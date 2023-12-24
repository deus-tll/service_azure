const ScalableImage = ({image, alt}) => {
  return(
    <div className="w-100 d-flex justify-content-center">
      <div className="scalable-image d-block">
        <div className="img-container">
          <img src={image} alt={alt} className="img-fluid" />
        </div>
      </div>
    </div>
  );
};

export default ScalableImage;