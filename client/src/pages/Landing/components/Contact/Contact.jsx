import "./Contact.css";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaClock,
} from "react-icons/fa";
import { useState } from "react";
import axios from "axios";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
  
      const res = await axios.post(
        "http://localhost:5000/api/contact",
        formData
      );
  
      alert(res.data.message);
  
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
  
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="contact" id="contact">

      <div className="contact-header">

        <span>Contact Us</span>

        <h2>Let's Connect</h2>

        <p>
          Have questions or need assistance? We'd love to hear from you.
        </p>

      </div>

      <div className="contact-container">

        <div className="contact-info">

          <div className="info-card">
            <FaMapMarkerAlt />
            <div>
              <h3>Address</h3>
              <p>Banglore, India</p>
            </div>
          </div>

          <div className="info-card">
            <FaEnvelope />
            <div>
              <h3>Email</h3>
              <p>support@nexhire.ai</p>
            </div>
          </div>

          <div className="info-card">
            <FaPhoneAlt />
            <div>
              <h3>Phone</h3>
              <p>+91 98765 43210</p>
            </div>
          </div>

          <div className="info-card">
            <FaClock />
            <div>
              <h3>Working Hours</h3>
              <p>Mon - Fri | 9:00 AM - 6:00 PM</p>
            </div>
          </div>

        </div>

        <form className="contact-form" onSubmit={handleSubmit}>

          <input
  type="text"
  name="name"
  placeholder="Full Name"
  value={formData.name}
  onChange={handleChange}
/>

          <input
  type="email"
  name="email"
  placeholder="Email Address"
  value={formData.email}
  onChange={handleChange}
/>
          <input
  type="text"
  name="subject"
  placeholder="Subject"
  value={formData.subject}
  onChange={handleChange}
/>
         <textarea
  rows="6"
  name="message"
  placeholder="Your Message"
  value={formData.message}
  onChange={handleChange}
/>
         <button type="submit" disabled={loading}>
  {loading ? "Sending..." : "Send Message"}
</button>

        </form>

      </div>

    </section>
  );
}

export default Contact;