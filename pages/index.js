
import Link from 'next/link'
import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Josafath Cerón</title>
      </Head>
      <section className='first_section'>
    <div className='container'>
      <div className="box">
        <div className="title">
          <div className="block"></div>
          <h1 className="name">Josafath Cerón<span></span></h1>
        </div>

      <div className="role">
        <div className="block"></div>
        <p className="description">Software Developer</p>
      </div>

      <div className='social-media'>
        <a href="https://www.facebook.com/josafath.cc/"><img src="/facebook.svg" alt="facebook image" /></a>
        <a href="https://www.instagram.com/josafathcrn/"><img src="/instagram.svg" alt="instagram image"/></a>
        <a href="https://twitter.com/jossa_x10"><img src="/tweter.svg" alt="twitter image" /></a>
        <a href="https://github.com/Josafath"><img src="/github.svg" alt="github image" /></a>
        <a href="https://www.linkedin.com/in/josafath-cer%C3%B3n-5b7a5a226/"><img src="/linkedin.svg" alt="linkedin image"/></a>
        <a href="https://discord.com/channels/jossa_09"><img src="/discord.svg" alt="discord image" /></a>
      </div>

      </div>
    </div>

    <svg className="arrows">
      <path className="a1" d="M0 0 L30 32 L60 0"></path>
      <path className="a2" d="M0 20 L30 52 L60 20"></path>
      <path className="a3" d="M0 40 L30 72 L60 40"></path>
    </svg>
    </section>
    <section id="personal-projects">
      
      <h2 id="title-projects" style={{color: 'black'}}>Personal Projects</h2>
        <div className="projects">

          <div className="project">
            <h2>Top Music with Spotify</h2>
            <br/>
            <svg height="15" width="fit-content">
              <line x1="0" y1="0" x2="300" y2="0" style={{stroke:'rgb(134, 96, 73)', strokeWidth:'6', borderRadius:'18px'}} />
              Sorry, your browser does not support inline SVG.
              </svg>
              <p>
                Web App using React and the Spotify API to show the user their top artist and songs of differents times.
              </p>
              
            <div className="buttons">
              <a id="go-website" href="https://jossify-joss.web.app/">Watch project</a>
              <a id="code" href="https://github.com/Josafath/Spotify-React-App">Code</a>
            </div>

          </div>

          <div className="project">

            <h2>Attendance Management</h2>
            <br/>
            <svg height="15" width="fit-content">
              <line x1="0" y1="0" x2="300" y2="0" style={{stroke:'rgb(134, 96, 73)', strokeWidth:'6', borderRadius:'18px'}} />
              Sorry, your browser does not support inline SVG.
            </svg>
            <p>
              Using OpenCV library I develop a program where a teacher can take attendance and download the list.
              I also use sqlite3 for storing the students, this project was more for personal use.
            </p>
            <div className="buttons">
              <a id="code" href="https://github.com/Josafath/attendance-management">Code</a>
            </div>

          </div>

          <div className="project">

            <h2>CRUD System</h2>
            <br />
            <svg height="15" width="fit-content">
              <line x1="0" y1="0" x2="300" y2="0" style={{stroke:'rgb(134, 96, 73)', strokeWidth:'6', borderRadius:'18px'}} />
              Sorry, your browser does not support inline SVG.
            </svg>
            <p>
              Taking the curse from The Odin Project. The user can make any CRUD operation unless delete.
              To delete the user has to have the password. 
              For this project I use Nodejs, Express and MongoDB.
            </p>
            <div className="buttons">
              <a id="go-website" href="https://jossify-crud.herokuapp.com/music">Watch project</a>
              <a id="code" href="https://github.com/Josafath/Simple-CRUD-project">Code</a>
            </div>

          </div>

          <div className="project">

            <h2>Video Chat</h2>
            <br/>
            <svg height="15" width="fit-content">
              <line x1="0" y1="0" x2="300" y2="0" style={{stroke:'rgb(134, 96, 73)', strokeWidth:'6', borderRadius:'18px'}} />
              Sorry, your browser does not support inline SVG.
            </svg>
            <p>
              Using socket.io, WebRTC API (no libraries), mongoDB for store users and rooms and Passport for authenticate users you can connect with someone creating a room or joining one of your friends. <br/>
              Pd: I try to make this project like if it was a real product.
            </p>
            <div className="buttons">
              <a id="go-website" href="https://study-partner.herokuapp.com/">Watch project</a>
              <a id="code" href="https://github.com/Josafath/simple-video-chat">Code</a>
            </div>

          </div>

          <div className="project">

            <h2>Sorting Algorithms</h2>
            <br />
            <svg height="15" width="fit-content">
              <line x1="0" y1="0" x2="300" y2="0" style={{stroke:'rgb(134, 96, 73)', strokeWidth:'6', borderRadius:'18px'}} />
              Sorry, your browser does not support inline SVG.
            </svg>
            <p>
              A little program where the user put a unlimited random numbers, then choose an algorithm and finally the program shows the data sorted.  <br/>
              This was made only with Java, the intention was to learn the layouts and more about the Java language.
            </p>
            <div className="buttons">
              <a id="code" href="https://github.com/Josafath/Sorting-Algorithms">Code</a>
            </div>

          </div>


    

        </div>
    </section>
    
    <section style={{backgroundColor: '#2B2D2D'}}>
      <div id="future-ventures">
      
        <div className="ventures">
          <h2 id="future-ventures-h2">Futures Ventures about Tech (Teach Myself in 2022): </h2>
          <ul>
            <li>Blockchain</li>
            <li>Data Science</li>
            <li>Scalable Distributed Systems (infrastructure, networks, microservices)</li>
          </ul>
        </div>

        <div className="ventures">
          <h2 id="future-ventures-h2">Personal Goals in 2022: </h2>
          <ul>
            <li>Read 14 books</li>
            <li>Meditate</li>
            <li>Learn Italian/French</li>
            <li>Learn to dance</li>
          </ul>

       </div>
      </div>
    </section>

    <section className='contact-section'>
      <Link href='/contact' passHref>Contact Me</Link>
    </section>
  </div>
  )
}