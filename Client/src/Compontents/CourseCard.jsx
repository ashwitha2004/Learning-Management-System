import { useNavigate } from "react-router-dom";
import { FaStar, FaPlayCircle, FaUserGraduate } from "react-icons/fa";

function CourseCard({ data }) {
  const navigate = useNavigate();

  const thumbnail =
    data?.thumbnail?.secure_url ||
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97";

  const rating = data?.rating || 4.5; // fallback demo rating
  const lectures = data?.numberOfLectures || 12;
  const students = data?.studentsEnrolled || 1200;
  const price = data?.price === 0 ? "FREE" : `₹${data?.price}`;

  return (
    <div
      onClick={() => navigate("/course/description/", { state: { ...data } })}
      className="bg-gray-900 text-white w-[20rem] rounded-xl shadow-lg overflow-hidden cursor-pointer group hover:-translate-y-2 transition duration-300"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <img
          src={thumbnail}
          alt="course thumbnail"
          className="h-48 w-full object-cover group-hover:scale-110 transition duration-300"
        />

        {/* Price badge */}
        <span className="absolute top-2 right-2 bg-yellow-500 text-black px-3 py-1 text-xs font-bold rounded">
          {price}
        </span>
      </div>

      {/* Course Info */}
      <div className="p-5 space-y-2">
        <h2 className="text-lg font-bold text-yellow-400 line-clamp-2">
          {data?.title}
        </h2>

        <p className="text-sm text-gray-300 line-clamp-2">
          {data?.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 text-yellow-400 text-sm">
          <FaStar />
          <span>{rating}</span>
          <span className="text-gray-400">(200 reviews)</span>
        </div>

        {/* Course Meta */}
        <div className="flex justify-between text-sm text-gray-300 pt-2">
          <span className="flex items-center gap-1">
            <FaPlayCircle /> {lectures} lectures
          </span>

          <span className="flex items-center gap-1">
            <FaUserGraduate /> {students}
          </span>
        </div>

        {/* Instructor */}
        <p className="text-sm pt-2">
          <span className="text-yellow-400 font-semibold">Instructor:</span>{" "}
          {data?.createdBy}
        </p>
      </div>
    </div>
  );
}

export default CourseCard;
