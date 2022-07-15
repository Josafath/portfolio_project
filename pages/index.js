import Head from "next/head";
import {useEffect} from "react";

export default function Home() {

  useEffect(() => {
    window.onload = function () {
      var elements = document.getElementsByClassName("typewrite");
      for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute("data-type");
        var period = elements[i].getAttribute("data-period");
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
      }
      // INJECT CSS
      var css = document.createElement("style");
      css.type = "text/css";
      css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
      document.body.appendChild(css);
    };
  });

  return (
    <>
      <Head>
        <title>Josafath Cerón's Website</title>
        <meta name="description" content="Josafath's Portfolio" />
        <meta name="author" content="Josafath Cerón" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" />
      </Head>

      <div className="title">
        <h4>Hi there! I'm</h4>
        <h3>Josafath Cerón</h3>
        <h5>and I'm a developer</h5>

      </div>
      <div className="arrow"></div>
    
      <section
        style={{
          marginTop: "10%",
          height: "auto",
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          width: "100%",
          borderRadius: "4px",
        }}
      >
        <div className="presentation">
          <div>
            <img src="/images/profile.png" alt="Josafath Cerón"></img>
          </div>
          <div style={{ padding: "2em" }}>
            <a
              style={{
                textDecoration: "none",
                color: "#000",
                fontSize: "28px",
              }}
              className="typewrite"
              data-period="2000"
              data-type='[ "Hello World !"]'
            >
              <span className="wrap"></span>{" "}
            </a>
          </div>
          <div>
            <span
              className="site-description"
              style={{ color: "#000", fontSize: "20px" }}
            >
              I'm a passionate developer based in Mexico City who loves to build
              things and solve problems. 
              
            </span>
            <p
              className="site-description"
              style={{ color: "#000", fontSize: "16px" }}
            >
              I have always been fascinated by software's potentials as a developer. So I started by building multiple websites and web applications.
            </p>
            <p
              style={{
                color: "#818189",
                margin: "24px auto 0",
                textAlign: "center",
                maxWidth: "500px",
              }}
            >
              I am currently in my third year of university and I am looking for
              an internship in a company.
            </p>
          </div>
          <div
            className="skills"
            style={{ display: "flex", flexFlow: "row wrap", alignItems:"center", justifyContent: "space-between", width:"70%" }}
          >
            <div>
              <h2>Technologies</h2>
              <ul className="check-list">
                <li>HTML5, CSS3 & JavaScript</li>
                <li>React</li>
                <li>Redux</li>
                <li>NodeJS</li>
                <li>REST APIs </li>
                <li>Python</li>
                <li>Django</li>
                <li>Java</li>
                <li>PostgreSQL</li>
                <li>MySQL</li>
                <li>Git</li>
              </ul>
            </div>

            <div>
              <h2>Skills</h2>
              <ul className="check-list">
                <li>Responsive Design</li>
                <li>DOM manipulation</li>
                <li>OOP</li>
                <li>MVC</li>
                <li>Unit Testing - Refactoring</li>
                <li>Deployment</li>
                <li>Relational Databases</li>
                <li>Git Flow</li>
                <li>Pair Programming</li>
                <li>Wireframing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section style={{marginTop: "5%"}}>
        <p style={{ letterSpacing: "2px", textAlign: "center", fontSize: "24px", fontWeight: "300" }}>
          My Projects
        </p>
        <div className="row1-container">
          <div className="box box-down cyan">
            <h2>Video Chat - JS</h2>
            <p>
              Using socket.io, WebRTC API (no libraries) and Passport I was able to understand the Peer2Peer Connection.
            </p>
            <a
              style={{ color: "black" }}
              href="https://study-partner.herokuapp.com/"
            >
              See Live
            </a>
          </div>

          <div className="box red">
            <h2>Attendance Management - Python </h2>
            <p>
              Using Facial Recognition with OpenCV take attendance for a school.
            </p>
            <a
              style={{ color: "black" }}
              href="https://github.com/Josafath/attendance-management.git"
            >
              Source
            </a>
            
          </div>

          <div className="box box-down blue">
            <h2>Sorting Algorithms GUI -  Java</h2>
            <p>GUI where each sorting algorithm is implemented</p>
            <a
              style={{ color: "black" }}
              href="https://github.com/Josafath/Sorting-Algorithms.git"
            >
              Source
            </a>
            
          </div>
        </div>
        <div className="row2-container">
          <div className="box orange">
            <h2>CRUD System - JS</h2>
            <p>Simple CRUD program using ExpressJS and MongoDB</p>
            <a
              style={{ color: "black" }}
              href="https://jossify-crud.herokuapp.com/music/"
            >
              See Live
            </a>
          </div>
        </div>
      </section>

      <section style={{
          marginTop: "10%",
          height: "auto",
          width: "100%",
          borderRadius: "4px",
          backgroundColor: "#1a1111",
          display:"flex",
          flexFlow: "column nowrap",
          alignContent:"center",
          justifyContent:"center",
          padding: "2em 0",
        }}>
        <p className="section-header">Contact Me</p>
      
        <div className="direct-social-container" style={{textAlign:"center"}}>
          <ul className="contact-list">
            <li className="list-item">
            <i class="fa fa-map-marker fa-2x"><span className="contact-text place" style={{paddingLeft: "1em"}}>Mexico City</span></i>
            </li>
            <li className="list-item">
            <i className="fa fa-envelope fa-2x"><span className="contact-text gmail"><a href="mailto:josafathcrn@gmail.com" title="Send me an email" style={{color:"white"}}>josafathcrn@gmail.com</a></span></i>
            </li>

          </ul>

          
          <ul className="social-media-list">
            <li>
              <a href="https://github.com/Josafath" className="contact-icon">
                <i className="fa fa-github" aria-hidden="true"></i>
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/josafath-cer%C3%B3n-5b7a5a226/" className="contact-icon">
              <i className="fa fa-linkedin" aria-hidden="true"></i>
              </a>
            </li>

            <li>
              <a href="https://www.instagram.com/josafathcrn/" className="contact-icon">
                <i className="fa fa-instagram" aria-hidden="true"></i>
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/josafath.cc/" className="contact-icon">
                <i className="fa fa-facebook" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
          <div className="copyright">&copy; Josafath Cerón </div>
        </div>


      </section>
    </>
  );
}

var TxtType = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};
