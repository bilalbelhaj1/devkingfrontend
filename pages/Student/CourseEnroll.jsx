import Header from '../../components/Student/Header/Header';
import Footer from '../../components/Student/Footer/Footer';
import imgUser from '/user-teacher.svg';
import imgCourse from '/icon_courses.svg';
import imgPeople from '/people.svg';
import imgReview from '/customer-reviews.svg';
import imgProfile from '/line-profile.svg';
import heroCourse from '/hero-course.svg';
import lineHeroUp from '/hero-line-up.svg';
import lineHeroDown from '/hero-line-down.svg';
import './CourseEnroll.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CourseEnroll = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [course, setCourse] = useState(null);
  const { courseId } = useParams()
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`https://devkingsbackend-production-3753.up.railway.app/api/public/course/${courseId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include'
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Failed to fetch course data');
        }
        const data = await res.json();
        console.log(data);
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!course) return null;

  const handleEnrollClick = async (e) => {
    e.preventDefault();
  const token = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user')
  console.log(user);
  console.log("hello")
  if (!token) {
    navigate('/login'); 
    return;
  }

  setLoading(true);
  try {
    console.log(courseId)
    const res = await fetch(`https://devkingsbackend-production-3753.up.railway.app/api/student/is-enrolled/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    const data = await res.json();
    console.log(data);
    
    if (data.enrolled) {
      console.log("enrolled");
      navigate(`/course/${courseId}`);
    } else {
      console.log(courseId)
      const res = await fetch(`https://devkingsbackend-production-3753.up.railway.app/api/student/stripe/create-checkout-session/${courseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials:'include'
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    }
  } catch (err) {
    console.error("Error checking enrollment:", err);
    setError("Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Header />
      <main>
        <section className="hero-course">
          <h1 className='hero-title'>{course.title}</h1>
          <div className="hero-course-container">
            <div className="hero-course-info">
              <div className='hero-shape-course'></div>
              <div className='hero-course-cover'>
                <img className='hero-course-cover-img' src={`https://devkingsbackend-production-3753.up.railway.app/${course.thumbnail}` || heroCourse} alt="Thumbnail" />
                <div className='hero-cover-info'>
                  <div className='hero-cover-info-teacher'>
                    <div className='hero-cat-info'>
                      <div className='students-profile-card-head'>
                        <img src={imgUser} alt="Teacher" />
                        <div>
                          <h1>{course.teacher.fullName}</h1>
                          <p><span>{course.teacher.profile}, </span><span>{course.category}</span></p>
                        </div>
                      </div>
                      <img src={lineHeroUp} alt="Line Up" />
                      <div className='hero-info-price'>
                        <div className='hero-cat-info-price'>{course.price- (course.price*10)/100}</div>
                        <div className='hero-cat'>
                          <div className='hero-cat-info-percentage'>10%</div>
                          <div className='hero-cat-info-price-old'>${course.price}</div>
                        </div>
                      </div>
                    </div>
                    <div className='hero-cat-info-teacher'>
                      <div className='hero-cat-info-course'>
                        <div>
                          <span className='hero-cat-info-key'>Category:</span>
                          <span className='hero-cat-info-value'>{course.category}</span>
                        </div>
                        <div>
                          <span className='hero-cat-info-key'>Price:</span>
                          <span className='hero-cat-info-value'>${course.price}</span>
                        </div>
                        <div>
                          <span className='hero-cat-info-key'>Lessons:</span>
                          <span className='hero-cat-info-value'>{course.lessons?.length}</span>
                        </div>
                        <div>
                          <span className='hero-cat-info-key'>Resources:</span>
                          <span className='hero-cat-info-value'>N/A</span>
                        </div>
                      </div>
                      <img src={lineHeroDown} alt="Line Down" />
                      <div className='hero-cat-info-action'>
                        <div className='hero-cat-info-add'>
                          <a href=''>Add to Card</a>
                          {/* SVG icon */}
                        </div>
                        <a onClick={handleEnrollClick} className='hero-cat-info-enroll'>Register to Enroll</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-teacher-info">
              <div className="student-profile-card">
                <div className='students-profile-card-bio'>
                  <div className='students-profile-card-head'>
                    <img src={imgUser} alt="Teacher" />
                    <div>
                      <h1>{course.teacher.fullName}</h1>
                      <p><span>{course.teacher.profile}, </span><span>{course.category}</span></p>
                    </div>
                  </div>
                  <div className='students-profile-card-body'>{course.description}</div>
                </div>
                <img src={imgProfile} alt="Profile Line" />
                <div className='students-profile-card-performance'>
                  <div className="card-performance">
                    <img src={imgCourse} alt="Courses" />
                    <div className='count'>3455</div>
                    <div className='title'>Courses</div>
                  </div>
                  <div className="card-performance">
                    <img src={imgPeople} alt="Students" />
                    <div className='count'>{course.totalEnrolled}</div>
                    <div className='title'>Students</div>
                  </div>
                  <div className="card-performance">
                    <img src={imgReview} alt="Reviews" />
                    <div className='count'>{course.totalReviews}</div>
                    <div className='title'>Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className='descrpition-course'>
          <h1>Description:</h1>
          <div>{course.description}</div>
        </section>
        <section className='benefit-course'>
          <h1>Course Benefits:</h1>
          <div className='benefit-container'>
            {course.benefits?.map((benefit, index) => (
              <div key={index} className='benefit-cover'>
                <div className='benefit-key'></div>
                <div className='benefit-value'>{benefit}</div>
              </div>
            ))}
          </div>
        </section>
        <section className='prerequisite-course'>
          <h1>Prerequisites</h1>
          <div className='prerequisite-container'>
            {course.prerequisites?.map((prereq, index) => (
              <div key={index} className='prerequisite-cover'>
                <div className='prerequisite-key'></div>
                <div className='prerequisite-value'>{prereq}</div>
              </div>
            ))}
          </div>
        </section>
        <section className='review-course'>
          <h1>Reviews & Ratings:</h1>
          <div className="review-profile-cards">
            {course.reviews?.map((review, index) => (
              <div key={index} className="review-profile-card">
                <div className="review-profile-card-head">
                  <img src={imgUser} alt="Reviewer" />
                  <div className="info-card-head">
                    <h3>{review.fullName}</h3>
                  </div>
                </div>
                <div className="review-profile-card-body">
                  {review.comment}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className='faq-course'>
          <h1>FAQ:</h1>
          <div className='faq-container'>
            {course.faqs?.map((faq, index) => (
              <div key={index} className='faq-left'>
                <div className='faq-left-left'>
                  <div className="question">{faq.question}</div>
                  <svg width="215" height="4" viewBox="0 0 215 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="107.5" cy="2" rx="107.5" ry="2" fill="#F0F8FF" fillOpacity="0.5" />
                  </svg>
                  <div className="answer">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CourseEnroll;