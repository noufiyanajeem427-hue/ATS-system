import { useEffect, useState } from "react";
import axios from "axios";
import "./ContactMessages.css";

function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH CONTACT MESSAGES
  // ==========================================
  const fetchMessages = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5001/api/contact",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Contact messages:", res.data);

      setMessages(res.data.contacts || []);
    } catch (error) {
      console.log(
        "Error fetching contact messages:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD MESSAGES WHEN PAGE OPENS
  // ==========================================
  useEffect(() => {
    fetchMessages();
  }, []);

  // ==========================================
  // MARK MESSAGE AS READ
  // ==========================================
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5001/api/contact/${id}`,
        {
          status: "Read",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh messages after updating
      fetchMessages();
    } catch (error) {
      console.log(
        "Error updating message:",
        error
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="contact-messages">

        <div className="contact-messages-header">
          <div>
            <h2>Contact Messages</h2>

            <p>
              View and manage messages submitted
              through Contact Us.
            </p>
          </div>
        </div>

        <div className="no-messages">
          <p>Loading messages...</p>
        </div>

      </div>
    );
  }

  // ==========================================
  // MAIN COMPONENT
  // ==========================================
  return (
    <div className="contact-messages">

      {/* =====================================
          HEADER
      ====================================== */}
      <div className="contact-messages-header">

        <div>
          <h2>Contact Messages</h2>

          <p>
            View and manage messages submitted
            through Contact Us.
          </p>
        </div>

        <span className="message-count">
          {messages.length}{" "}
          {messages.length === 1
            ? "Message"
            : "Messages"}
        </span>

      </div>


      {/* =====================================
          NO MESSAGES
      ====================================== */}
      {messages.length === 0 ? (

        <div className="no-messages">
          <p>
            No contact messages found.
          </p>
        </div>

      ) : (

        /* =====================================
           MESSAGE LIST
        ====================================== */
        <div className="messages-list">

          {messages.map((message) => (

            <div
              className={`message-card ${
                message.status === "Unread"
                  ? "unread"
                  : ""
              }`}
              key={message._id}
            >

              {/* =================================
                  MESSAGE TOP
              ================================== */}
              <div className="message-top">

                <div>

                  <h3>
                    {message.subject}
                  </h3>

                  <p className="sender">
                    {message.name}
                    {" · "}
                    {message.email}
                  </p>

                </div>


                {/* STATUS */}
                <span
                  className={`message-status ${
                    message.status === "Unread"
                      ? "status-unread"
                      : "status-read"
                  }`}
                >
                  {message.status}
                </span>

              </div>


              {/* =================================
                  MESSAGE CONTENT
              ================================== */}
              <div className="message-content">

                <p>
                  {message.message}
                </p>

              </div>


              {/* =================================
                  MESSAGE BOTTOM
              ================================== */}
              <div className="message-bottom">

                <span>
                  {message.createdAt
                    ? new Date(
                        message.createdAt
                      ).toLocaleString()
                    : "Date unavailable"}
                </span>


                {/* MARK AS READ */}
                {message.status === "Unread" && (

                  <button
                    type="button"
                    onClick={() =>
                      markAsRead(message._id)
                    }
                  >
                    Mark as Read
                  </button>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default ContactMessages;
