import React from "react";
import { ImCross } from "react-icons/im";
import { BsRecordCircleFill } from "react-icons/bs";
import clsx from "clsx";

interface Props {
  content: number;
  onClick?: () => void;
}

const Cell: React.FC<Props> = ({ content, onClick }) => {
  return (
    <div
      className={clsx(
        "flex h-20 w-20 items-center justify-center rounded-md bg-white/10 p-2  ",
        [1, 2].includes(content) ? "" : "cursor-pointer hover:bg-white/20"
      )}
      onClick={onClick}
    >
      {content === 1 && <ImCross className="h-8 w-8 text-kashmir-blue-400 " />}
      {content === 2 && <BsRecordCircleFill className="h-8 w-8 text-kashmir-blue-400" />}
    </div>
  );
};

export default Cell;
