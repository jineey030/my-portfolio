import { PROFILE } from '../constants/profile';

function Contact() {
  return (
    <section id="contact">
      <h2>Contact</h2>
      <div className="contact-links">
        <a href={`mailto:${PROFILE.email}`} className="btn-outline">
          Email
        </a>
        <a href={PROFILE.github} target="_blank" rel="noreferrer" className="btn-outline">
          GitHub
        </a>
      </div>
    </section>
  );
}

export default Contact;