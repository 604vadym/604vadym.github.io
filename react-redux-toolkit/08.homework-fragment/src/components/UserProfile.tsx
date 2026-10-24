import { Fragment } from "react/jsx-runtime";
import "./UserProfile.css";

const user = {
  name: "Олена Шевченко",
  avatar: "https://via.placeholder.com/150",
  email: "olena@example.com",
  phone: "+380 67 123 4567",
  bio: "Full-stack розробник. Люблю React та TypeScript.",
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/...", icon: "🐙" },
    { platform: "LinkedIn", url: "https://linkedin.com/...", icon: "💼" },
    { platform: "Twitter", url: "https://twitter.com/...", icon: "🐦" },
  ],
};

function UserProfile() {
  return (
    <div className="profile-card">
      <>
        <img className="profile-avatar" src={user.avatar} alt={user.name} />
        <h1 className="profile-name">{user.name}</h1>
      </>

      <>
        <div className="contact-info">
          <p className="contact-item">
            <span className="contact-text">{user.email}</span>
          </p>
          <p className="contact-item">
            <span className="contact-text">{user.phone}</span>
          </p>
        </div>
      </>

      <p className="profile-bio ">{user.bio}</p>

      <>
        <div className="skills-section">
          <h2 className="section-title">Навички</h2>
          <ul className="skills-list">
            {user.skills.map((skill, i) => (
              <li key={i} className="skill-item">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </>

      <>
        <h2 className="section-title">Соціальні мережі</h2>
        <div className="social-links">
          {user.socialLinks.map(({ url, icon, platform }, i) => (
            <Fragment key={i}>
              <a
                className="social-link"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="social-icon ">{icon}</span>
                <span className="social-platform">{platform}</span>
              </a>
            </Fragment>
          ))}
        </div>
      </>
    </div>
  );
}

export default UserProfile;
