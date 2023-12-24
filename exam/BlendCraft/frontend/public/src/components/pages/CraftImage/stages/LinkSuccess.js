const LinkSuccess = ({image, textForLink}) => {
  return(
    <div className="text-center">
      <a href={image} target="_blank" rel="noopener noreferrer" className="link-success">{textForLink}</a>
    </div>
  );
};

export default LinkSuccess;