import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Card = ({ title, description, id, photo }) => {
  return (
    <div className="flex flex-col w-full h-full bg-gradient-to-br from-white to-[#eee8d5] dark:from-[#21222c] dark:to-[#282a36] dark:text-[#f8f8f2] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-[#eee8d5] dark:border-[#44475a]">
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 flex-grow">
        <h2 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2 md:mb-3 text-[#268bd2] dark:text-[#8be9fd] line-clamp-2">{title}</h2>
      </div>
      {photo && (
        <div className="px-3 sm:px-4 md:px-5 lg:px-6 pb-2 sm:pb-3">
          <img 
            src={photo} 
            alt={title} 
            className="w-full h-24 sm:h-28 md:h-32 lg:h-40 object-cover rounded-md"
          />
        </div>
      )}
      <div className="mt-auto p-2 sm:p-3 md:p-4 bg-[#268bd2] hover:bg-[#2aa198] dark:bg-[#bd93f9] dark:hover:bg-[#ff79c6] transition-colors">
        <Link to={`/article/${id}`} className="block">
          <button className="text-xs sm:text-sm md:text-base font-medium text-[#f8f8f2] hover:text-[#8be9fd] transition-colors w-full text-left dark:text-[#f8f8f2] dark:hover:text-[#8be9fd]">
            Read More →
          </button>
        </Link>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  id: PropTypes.string.isRequired,
  photo: PropTypes.string,
};

export default Card;
