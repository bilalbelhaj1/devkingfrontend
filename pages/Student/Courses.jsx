import searchCourse from '/search-courses.svg'
import filterCpurse from '/filter-course.svg'
import Header from '../../components/Student/Header/Header'
import Footer from '../../components/Student/Footer/Footer'
import Course from '../../components/Student/Course/Course'
import { useState, useEffect, useMemo } from 'react'
import './Courses.css'

function Courses() {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState({});
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setIsDropdownOpen(false);
    };
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
    };
    const filteredCourses = useMemo(() => {
        let filtered = courses;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(course =>
                course.title.toLowerCase().includes(query) ||
                course.category.toLowerCase().includes(query) ||
                (course.description && course.description.toLowerCase().includes(query))
            );
        }
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(course => course.category === selectedCategory);
        }
        return filtered;
    }, [searchQuery, selectedCategory, courses]);
    const coursesByCategory = useMemo(() => {
        const map = {};

        const filteredCategories = [...new Set(filteredCourses.map(course => course.category))];

        filteredCategories.forEach(cat => {
            map[cat] = filteredCourses.filter(course => course.category === cat);
        });

        return map;
    }, [filteredCourses]);
    const toggleCategoryExpansion = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://devkingsbackend-production-3753.up.railway.app/api/public/AllCourses');

                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data = await response.json();
                const coursesArray = Array.isArray(data) ? data : [];

                setCourses(coursesArray);

                const uniqueCategories = [...new Set(
                    coursesArray
                        .map(course => course.category)
                        .filter(Boolean)
                )].sort();
                setCategories(uniqueCategories);

            } catch (err) {
                setError(err.message);
                console.error('Error fetching courses:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);
    if (loading) {
        return (
            <>
                <Header />
                <main>
                    <div className="courses-head">
                        <h1>Courses</h1>
                    </div>
                    <div className="loading-state">
                        <p>Loading courses...</p>
                    </div>
                </main>
            </>
        );
    }
    if (error) {
        return (
            <>
                <Header />
                <main>
                    <div className="courses-head">
                        <h1>Courses</h1>
                    </div>
                    <div className="error-state">
                        <p>Error loading courses: {error}</p>
                        <button onClick={() => window.location.reload()}>Try Again</button>
                    </div>
                </main>
            </>
        );
    }
    return (
        <>
            <Header />
            <main>
                <div className="courses-head">
                    <h1>Courses</h1>
                    <div className="form-courses">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="Search courses, categories..."
                                    value={searchQuery}
                                    onChange={handleSearch}
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
                                        {categories.map(category => (
                                            <button
                                                key={category}
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
                <div className="courses-results">
                    {searchQuery || selectedCategory !== 'all' ? (
                        <div className="filter-info">
                            <p>
                                Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
                                {searchQuery && ` matching "${searchQuery}"`}
                                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                            </p>
                        </div>
                    ) : null}
                </div>
                <div className="courses">
                    {Object.keys(coursesByCategory).length === 0 ? (
                        <div className="no-courses">
                            <h3>No courses found</h3>
                            <p>
                                {searchQuery || selectedCategory !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'No courses available at the moment.'
                                }
                            </p>
                        </div>
                    ) : (
                        Object.entries(coursesByCategory).map(([category, catCourses]) => (
                            <div key={category} className="category-section">
                                <div className="category-header">
                                    <h2 className="category-title" style={{ marginLeft: '50px' }}>{category}</h2>
                                    <span className="course-count">({catCourses.length} course{catCourses.length !== 1 ? 's' : ''})</span>
                                </div>
                                <div className="category-courses">
                                    {(expandedCategories[category] ? catCourses : catCourses.slice(0, 3)).map(course => (
                                        <Course key={course._id} course={course} />
                                    ))}
                                </div>
                                {catCourses.length > 3 && (
                                    <div className="show-btn" style={{ marginTop: '25px' }}>
                                        <button
                                            className="view-all-btn"
                                            onClick={() => toggleCategoryExpansion(category)}
                                        >
                                            {expandedCategories[category] ? 'Show Less' : `View All ${catCourses.length} Courses`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Courses;