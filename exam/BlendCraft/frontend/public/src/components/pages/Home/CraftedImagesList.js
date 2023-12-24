import {Link} from "react-router-dom";
import {formattedDate} from "../../service/functions";

const CraftedImagesList = ({craftedImages}) => {
  return (
    <ol style={{ minHeight: "calc(100vh - 500px)" }} className="list-group list-group-numbered">
      {craftedImages.map((craftedImage) => (
        <li key={craftedImage._id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
          <Link to={`/crafted-image/${craftedImage._id}`} className="text-dark-emphasis text-decoration-none w-100 ms-2">
            <div className="mb-1 mt-1 d-flex justify-content-between align-items-center">
              <p className="m-0">{craftedImage.photoName}</p>
              <p className="m-0">{formattedDate(craftedImage.photoFinishedAt)}</p>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
};

export default CraftedImagesList;