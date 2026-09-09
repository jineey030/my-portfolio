import { PROFILE } from '../constants/profile';
import SectionTitle from '../../../components/ui/SectionTitle';

function Contact() {
  return (
    <section id="contact">
      <SectionTitle>Contact</SectionTitle>

      <div className="contact-links">
        <a
          href={`mailto:${PROFILE.email}`}
          className="btn-outline"
        >
          Email
        </a>

        <a
          href={PROFILE.github}
          target="_blank"
          rel="noreferrer"
          className="btn-outline"
        >
          GitHub
        </a>
      </div>
    </section>
  );
}

export default Contact;
