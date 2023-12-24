import LinkAndImage from "../pages/CraftImage/stages/LinkAndImage";

const Stage = ({stageNumber, stageDescription, linkAndImageList, craftingFlag = true}) => {

  const isPlural = () => {
    return linkAndImageList && linkAndImageList.length > 1 ? 's' : ''
  };

  return(
    <>
      <h3 className="ps-4 pt-4 text-center">
        {stageNumber} stage {craftingFlag && (<>&#10003;</>)}
      </h3>
      <p className="ps-4 pt-4 text-center">
        {stageDescription}
        {linkAndImageList && linkAndImageList.length > 0 && (
          <>. Here's link{isPlural()} to image{isPlural()} in storage and preview:</>
      )}
      </p>

      {linkAndImageList && linkAndImageList.length > 0 && (
        linkAndImageList.map((linkAndImage, index) => (
          <div key={index}>
            <LinkAndImage image={linkAndImage.image} textForLink={linkAndImage.textForLink}/>
          </div>
        ))
      )}
    </>
  );
};

export default Stage;