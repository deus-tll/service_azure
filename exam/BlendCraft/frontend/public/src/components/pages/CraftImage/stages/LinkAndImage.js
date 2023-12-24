import ScalableImage from "./ScalableImage";
import LinkSuccess from "./LinkSuccess";

const LinkAndImage = ({image, textForLink}) => {
  return (
    <>
      <div className="d-flex justify-content-center">
        <hr style={{ minWidth: '90%' }}/>
      </div>
      <LinkSuccess image={image} textForLink={textForLink}/>
      <ScalableImage image={image}/>
    </>
  );
};

export default LinkAndImage;