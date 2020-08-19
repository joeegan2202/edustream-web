import React from 'react'
import './Home.css'

function Home() {
    return (
        <div className="Home" id="give-space">
            <h1><b>EduStream</b></h1><h4>Integrated, Automated, Hands-Off Classroom Live Streaming</h4>
            <a id="help" href="https://docs.google.com/document/d/1Eoy1xEUL_Ds67yLz5kR5hX9l8ezdNLuqOaoFNLWWD_Q/edit?ts=5f3c1ea6"><h3>Having issues with your stream? Click here!</h3></a>
            <section><h3>CoViD-19 Response:</h3><p>
                As the CoViD-19 pandemic shakes the world, schools need a new approach to education that includes distance learning and reduced in-person attendance.
                Many schools have moved to a hybrid education model with some students in classrooms and others learning virtually.
                However, the loss of direct teacher instruction is an unappealing prospect for schools and parents, and many schools are struggling to justify tuition with no guarantee of student-teacher interaction.
                EduStream provides a solution to this problem with a system that integrates with Learning Management Systems and 
            </p></section>
            <footer>
                <h6>Contact Us:</h6>
                <p>Phone Number: +1 (866) 812-2253</p>
                <p>Email Us At: <a href="mailto:contact@edustream.biz"></a></p>
                <p>© Copyright 2020 EduStream LLC</p>
            </footer>
        </div>
    )
}

export default Home