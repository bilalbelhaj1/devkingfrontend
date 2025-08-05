import React from 'react'
import Hero from '../../components/Student/Hero/Hero'
import About from '../../components/Student/About/About'
import Teacher from '../../components/Student/Teacher/Teacher'
import Layout from '../../layouts/Student/Layout'
import Course from '../../components/Student/Course/Course'
import Student from '../../components/Student/Student/Student'
import Contact from '../../components/Student/Contact/Contact'
import studentBenefitsData from '../studentsBenefits'
import { useNavigate } from 'react-router-dom';
import './Home.css'

const Home = () => {
    const navigate = useNavigate();
    const [TopCourses, setTopCourses] = React.useState([]);
    const [TopTeachers, setTopTeachers] = React.useState([])
    const [studentBenefits, setStudentBenefits] = React.useState(studentBenefitsData);

    React.useEffect(() => {
        async function getTopCourses() {
            try {
                const response = await fetch('https://devkingsbackend-production-3753.up.railway.app/api/public/home');
                const responseData = await response.json();
                console.log(responseData);
                setTopCourses(responseData.topCourses)
                setTopTeachers(responseData.topTeachers)
            } catch (err) {
                console.log("Error Fetchiing the Data: ", err);
            }
        }
        getTopCourses();
    }, [])
    const coursesElements = TopCourses.map(course => {
        return <Course key={course._id} course={course} id={course._id} />
    })
    const teachersElements = TopTeachers.map((teacher, index) => {
        return <Teacher key={index} teacher={teacher} />
    })
    const studentsBenefitsElmenets = studentBenefits.map((benefit, index) => {
        return <Student key={index} benefit={benefit} />
    })

    function handleClick(category) {
        navigate(`/courses?category=${category}`)
    }
    function viewAll() {
        navigate('/courses');
    }
    return (
        <Layout>
            <Hero />
            <About />
            <section className="section-teachers">
                <h1>Our Top Teachers:</h1>
                <div className="teachers-container">
                    {teachersElements}
                </div>
            </section>
            <section className="section-courses">
                <h1>Top courses:</h1>
                <section className="category-container">
                    <button onClick={() => { handleClick("design") }}>Design</button>
                    <button onClick={() => { handleClick("JavaScript") }}>JavaScript</button>
                    <button onClick={() => { handleClick("Ai") }}>Ai and Ml</button>
                    <button onClick={() => { handleClick("python") }}>python</button>
                    <button onClick={() => { handleClick("Data") }}>Data</button>
                </section>
                <div className="courses-card">
                    {coursesElements}
                </div>
                <button
                    onClick={viewAll}
                    className="view-all">
                    Visite Courses
                </button>
            </section>
            <section className="section-students">
                <h1>For Students:</h1>
                <p className='sub-title'>Why learn with Devkings?</p>
                <div className="cards">
                    {studentsBenefitsElmenets}
                </div>
            </section>
            <Contact />
        </Layout>
    )
}

export default Home;