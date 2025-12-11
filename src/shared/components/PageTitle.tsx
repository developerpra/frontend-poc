import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faStar as faStarSolid,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@progress/kendo-react-buttons";

interface PageTitleProps {
  text: string;
  onAdd?: () => void;
}

export default function PageTitle({ text, onAdd }: PageTitleProps) {
  const [fav, setFav] = useState(false);

  return (
    <div className="flex justify-between items-center gap-2 w-full shadow-lg py-2 px-4">
      <div className="flex items-center gap-2">
        <h4 className="text-lg font-medium">{text}</h4>
        <FontAwesomeIcon
          icon={fav ? faStarSolid : faStarRegular}
          onClick={() => setFav(!fav)}
          className="transition"
        />
      </div>
      <div className="flex gap-2">
        <Button fillMode="flat" themeColor="primary">
          Reference
        </Button>
        <Button themeColor="primary" className="w-16" onClick={onAdd}>
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
}
