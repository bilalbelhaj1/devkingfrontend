import './Course.css';
import { Link } from 'react-router-dom';

const Course = ({ course }) => {
  return (
    <div className="xCrdr_928">
      <img
        className="xImg_c1"
        src={`https://terrific-determination-production-cf17.up.railway.app/${course.thumbnail}`}
        alt="Course Thumbnail"
      />
      <div className="xBody_329">
        <div className="xWrap_229">
          <div className="xHead_ab1">
            <h4 className="xTitle_32">{course.title}</h4>
            <div className="xPrice_b9">
              <p>{course.price}$</p>
              <span>{course.price + 100}$</span>
            </div>
          </div>

          <div className="xInfo_13">
            <div className="xInfoTop_44">
              <p className="xTeacher_99">{course.teacherName}</p>
              <div className="xLine_21"></div>
              <div className="xCat_71">{course.category}</div>
            </div>
            <p className="xDesc_10">{course.description}</p>
            <div className="xLineLong_22"></div>
          </div>

          <div className="xFoot_55">
            <div className="xGroup_88">
              <p className="xRate_90">{course.averageRating || '4.5'}</p>
              <div className="xViewers_66">({course.reviewCount || '120'} viewers)</div>
            </div>
            <div className="xStars_5">
              {[...Array(Math.floor(course.averageRating || 4)).keys()].map((_, i) => (
                <span key={i}>⭐</span>
              ))}
            </div>
          </div>

          <Link className="xLink_33" to={`/course_enroll/${course._id}`}>
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Course;
