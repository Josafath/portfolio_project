import ReCAPTCHA from "react-google-recaptcha"
import { useRef, useState } from "react";
import emailjs from '@emailjs/browser';
import Link from "next/link";

export default function Contact() {

    const captcha = useRef(null); 
    const form = useRef();

    const [captchaValid, setcaptchaValid] = useState(null);
    const [validUser, setvalidUser] = useState(false);


    const onChange = () =>{
        if(captcha.current.getValue()){
            setcaptchaValid(true);
        }
    }

    const sendEmail = (event) => {
        event.preventDefault();

        if(captcha.current.getValue()){
            setvalidUser(true);
            setcaptchaValid(true)
            emailjs.sendForm('service_h1m6hlj', 'template_kymvpln', form.current, 'user_boJl2gnXjtSBFd71VJYCr')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });

        } else {
            setvalidUser(false);
            setcaptchaValid(false);
        }
    }

    return (
        <div>
            <div className="container_contact">
                {!validUser && 
                <form ref={form}  onSubmit={sendEmail}>
                    <div className="field" tabIndex="1">
                        <label htmlFor="name">
                            <i className="far fa-user"></i>Your Name
                        </label>
                        <input name="name" autoComplete="off" type="text" placeholder="e.g. john doe" required />
                    </div>
                    <div className="field" tabIndex="2">
                        <label htmlFor='email'>
                            <i className="far fa-envelope"></i>Your Email
                        </label>
                        <input name="email" autoComplete="off" type="email" placeholder="email@domain.com" required />
                    </div>
                    <div className="field" tabIndex="3">
                        <label>
                            <i className="far fa-edit"></i>Your Message
                        </label>
                        <textarea name="message" placeholder="type here" required></textarea>
                    </div>
                    <div className="captcha" tabIndex="4">
                        <ReCAPTCHA 
                                sitekey="6Lfr3EkeAAAAAOqZBpfHgDYdhOzD1NJXfT-dHbNN"
                                onChange={onChange}
                                style={{padding: '2em 0 0 0'}}
                                ref={captcha}
                        />
                        {captchaValid === false && <div className="error-captcha" style={{color:'red'}}>Please, confirm you're not a robot. </div>}
                    </div>
                    <button className="sendmail" type="submit">Send Message</button>
                </form>
                }
                {validUser &&
                    <div style={{display: 'flex', flexFlow: 'column wrap', alignItems: 'center'}}>
                        <h2>Your message has been sent. :)</h2>
                        <Link href='/' passHref> Go Back </Link>
                    </div>
                }
            </div>
        </div>
    )
    }