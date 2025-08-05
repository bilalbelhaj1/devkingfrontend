import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/Student/Header/Header';
import Footer from '../../components/Student/Footer/Footer';
import './EnrolledCourses.css';
import { Link } from 'react-router-dom';
import imgCourse from '/course-img.svg';
import searchCourse from '/search-courses.svg';
import filterCpurse from '/filter-course.svg';

const BACKEND_URL = 'https://devkingsbackend-production-3753.up.railway.apps'; 

const EnrolledCourses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolledTutorials, setEnrolledTutorials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Filter enrolled tutorials
  const filteredTutorials = useMemo(() => {
    let filtered = enrolledTutorials;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(tutorial => {
        const t = tutorial.tutorialId;
        return (
          t.title?.toLowerCase().includes(query) ||
          (t.category && t.category.toLowerCase().includes(query)) ||
          (t.description && t.description.toLowerCase().includes(query))
        );
      });
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tutorial => {
        const t = tutorial.tutorialId;
        return t.category === selectedCategory;
      });
    }
    return filtered;
  }, [searchQuery, selectedCategory, enrolledTutorials]);

  // Fetch categories from tutorials
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(
      enrolledTutorials
        .map(tutorial => tutorial.tutorialId?.category)
        .filter(category => category !== null && category !== undefined && category.trim())
    )];
    return ['all', ...uniqueCategories.sort()];
  }, [enrolledTutorials]);

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const fetchEnrolled = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${BACKEND_URL}/api/student/enrolled-tutorials?page=${page}&limit=${ITEMS_PER_PAGE}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to fetch enrolled tutorials');
      }
      const data = await res.json();
      setEnrolledTutorials(data.enrolledTutorials || []);
      setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolled(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const fetchEnrolled = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${BACKEND_URL}/api/student/enrolled-tutorials`, {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include'
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Failed to fetch enrolled tutorials');
        }
        const data = await res.json();
        setEnrolledTutorials(data.enrolledTutorials || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolled();
  }, []);

  return (
    <div className="enrolled-root">
      <Header />
      <div className="enrolled-container">
        <h1 className="enrolled-title">
          <span className="enrolled-title-bar"></span>
          Enrolled Courses
        </h1>
        <div className="enrolled-topbar">
          <div className="form-courses">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search courses, categories..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <img src={searchCourse} alt="Search" />
              </div>
            </form>
            <div className="filter-container">
              <div className="dropdown">
                <button
                  className="dropdown-toggle"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-expanded={isDropdownOpen}
                >
                  <img src={filterCpurse} alt="Filter" />
                  <span>
                    {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                  </span>
                  <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <button
                      className={`dropdown-item ${selectedCategory === 'all' ? 'active' : ''}`}
                      onClick={() => handleCategorySelect('all')}
                    >
                      All Categories
                    </button>
                    {categories.map((category, idx) => (
                      <button
                        key={idx}
                        className={`dropdown-item ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {(searchQuery || selectedCategory !== 'all') && (
              <button className="clear-filters" onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', margin: '40px 0', fontSize: '1.2rem' }}>Loading...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: 'red', margin: '40px 0' }}>{error}</div>
        ) : filteredTutorials.length === 0 ? (
          <div style={{ textAlign: 'center', margin: '40px 0', fontSize: '1.2rem' }}>No enrolled courses found.</div>
        ) : (
          <div className="enrolled-grid">
            {filteredTutorials.map(item => {
              const t = item.tutorialId;
              // You may need to update this if you populate teacherId with the teacher object
              const teacherDisplay = t.teacherId && typeof t.teacherId === 'object'
                ? `${t.teacherId.firstName || ''} ${t.teacherId.lastName || ''}`
                : 'Teacher';

              return (
                <div className="lesson-course-card" key={item._id}>
                  <img 
                    // src={thumbnail}
                    src={imgCourse}
                    alt="Lesson" 
                    className="lesson-course-image" 
                  />
                  <div className="lesson-course-content">
                    <div className="lesson-course-header">
                      <h4 className="lesson-course-title">{t.title}</h4>
                      <span className="lesson-course-duration">{t.price}$</span>
                    </div>
                    <p className="lesson-course-teacher">{teacherDisplay}</p>
                    <div className="progress-section">
                      <div className="progress-info">
                        <span>{t.level}</span>
                        <span>0%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                    <div className="lesson-course-footer">
                      <Link to={`/lesson/${t.lessons && t.lessons[0]}`}> {/* Link to first lesson */}
                        <button className="btn-start">Start Now</button>
                      </Link>
                      <span className="completion-status">It's not completed yet</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Pagination */}
        <div className="enrolled-pagination">
          <button 
            className="enrolled-page-btn" 
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button 
              key={page}
              className={`enrolled-page-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button 
            className="enrolled-page-btn" 
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EnrolledCourses;
