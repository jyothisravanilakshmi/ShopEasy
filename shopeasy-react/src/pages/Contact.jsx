import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    // id: "contact-name" -> "name"
    const key = id.replace("contact-", "");
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting ShopEasy! We will get back to you soon.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <main>
      {/* ================= PAGE HEADER ================= */}
      <section className="page-header">
        <h1>Contact Us</h1>
        <p>Have a question? We'd love to hear from you.</p>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section className="contact-section">
        <div className="contact-container">
          {/* Contact Information */}
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p>
              If you have any questions, suggestions or feedback, feel free to
              contact us.
            </p>

            <div className="contact-info-item">
              <div className="contact-icon">📧</div>
              <div>
                <h3>Email</h3>
                <p>support@shopeasy.com</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">📞</div>
              <div>
                <h3>Phone</h3>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">📍</div>
              <div>
                <h3>Location</h3>
                <p>India</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">🕐</div>
              <div>
                <h3>Working Hours</h3>
                <p>Monday - Saturday</p>
                <p>9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-box">
            <h2>Send Us a Message</h2>

            <form id="contact-form" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="contact-input-group">
                <label htmlFor="contact-name">Your Name</label>
                <input
                  type="text"
                  id="contact-name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="contact-input-group">
                <label htmlFor="contact-email">Email Address</label>
                <input
                  type="email"
                  id="contact-email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Subject */}
              <div className="contact-input-group">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  type="text"
                  id="contact-subject"
                  placeholder="Enter subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Message */}
              <div className="contact-input-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  rows="6"
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {/* Submit */}
              <button type="submit" className="contact-submit-btn">
                📩 Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
