import {Link} from "react-router-dom";

const CraftedImagesList = ({craftedImages}) => {
  return (
    <ul style={{ minHeight: "calc(100vh - 500px)" }} className="list-group">
      {craftedImages.map((craftedImage) => (
        <li key={craftedImage._id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
          <Link to={`/crafted-image/${craftedImage._id}`} className="text-dark-emphasis text-decoration-none">
            <div className="mb-1 mt-1 d-flex justify-content-between align-items-center">
              <p>{craftedImage.photoName}</p>
              <p>{craftedImage.photoFinishedAt}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default CraftedImagesList;