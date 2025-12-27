import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationPrompt from "../components/AuthenticationPrompt";
import emailjs from 'emailjs-com';

export default function ContactUs() {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    query_type: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // EmailJS configuration - Updated with your credentials
  const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_i1o68qt',
    TEMPLATE_ID: 'template_8kic4hk',
    USER_ID: 'adklsEDnZdG8bgIyc',
    ADMIN_EMAIL: 'awd136101021@gmail.com'
  };

  // Initialize EmailJS on component mount
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.USER_ID);
  }, []);

  // Check authentication status on component mount
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      const userData = JSON.parse(user);
      setFormData(prev => ({
        ...prev,
        first_name: userData.fullName?.split(' ')[0] || "",
        last_name: userData.fullName?.split(' ').slice(1).join(' ') || "",
        email: userData.email || ""
      }));
    } else {
      setShowLoginPrompt(true);
    }
  }, []);

  const closeLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendEmailNotification = async (queryData) => {
    try {
      console.log('Sending email with data:', queryData);
      
      const templateParams = {
        to_email: EMAILJS_CONFIG.ADMIN_EMAIL,
        from_name: `${queryData.first_name} ${queryData.last_name}`,
        from_email: queryData.email,
        mobile: queryData.mobile,
        query_type: queryData.query_type,
        subject: queryData.subject,
        message: queryData.message,
        query_id: queryData.id,
        timestamp: new Date().toLocaleString(),
        reply_instructions: `Reply to this email and include the Query ID: ${queryData.id} in your response.`
      };

      console.log('Template params:', templateParams);

      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.log('Email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      console.error('Error details:', {
        serviceId: EMAILJS_CONFIG.SERVICE_ID,
        templateId: EMAILJS_CONFIG.TEMPLATE_ID,
        userId: EMAILJS_CONFIG.USER_ID,
        errorText: error.text
      });
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get current user
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    // Create query object
    const newQuery = {
      id: `QUERY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.email,
      ...formData,
      timestamp: new Date().toISOString(),
      status: "pending",
      adminReplies: [],
      lastUpdated: new Date().toISOString()
    };

    try {
      console.log('Starting form submission...');
      
      // Send email notification to admin
      const emailSent = await sendEmailNotification(newQuery);
      
      // Get existing queries from localStorage
      const existingQueries = JSON.parse(localStorage.getItem("userQueries") || "[]");
      
      // Add new query
      const updatedQueries = [...existingQueries, newQuery];
      
      // Save back to localStorage
      localStorage.setItem("userQueries", JSON.stringify(updatedQueries));

      // Show appropriate success message
      if (emailSent) {
        alert("Your query has been submitted successfully! We've sent a confirmation email and will get back to you soon.");
      } else {
        alert("Your query has been submitted successfully! However, we couldn't send the email notification. Your query is saved and we'll still respond.");
      }

      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        mobile: "",
        email: "",
        query_type: "",
        subject: "",
        message: ""
      });

    } catch (error) {
      console.error('Error submitting query:', error);
      alert('Error submitting query. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <AuthenticationPrompt 
          show={showLoginPrompt}
          onClose={closeLoginPrompt}
          title="Authentication Required"
          message="Please login first to access the Contact Us page."
          redirectPath="/login?from=protected"
        />
      </>
    );
  }

  return (
    <>
      <section className="bg-gray-100 py-12 px-6 md:px-20">
        <div className="text-center mb-10">
          <h4 className="text-4xl font-bold mb-6 text-[#004A99] mt-16">
            Contact Us
          </h4>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Submit your query and we'll respond to your email.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg max-w-3xl mx-auto p-8">
          <h2 className="text-2xl font-semibold text-center mb-6 text-[#003366]">
            Send Us Your Query
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                name="first_name"
                placeholder="your first name*"
                required
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004A99] focus:border-transparent transition duration-300"
              />
              <input
                type="text"
                name="last_name"
                placeholder="your last name*"
                required
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004A99] focus:border-transparent transition duration-300"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                name="mobile"
                placeholder="your mobile* example: 03xxxxxxxxx"
                required
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004A99] focus:border-transparent transition duration-300"
              />
              <input
                type="email"
                name="email"
                placeholder="your email*"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004A99] focus:border-transparent transition duration-300"
              />
            </div>

            <div>
              <select
                name="query_type"
                required
                value={formData.query_type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#004A99] focus:border-transparent transition duration-300"
              >
                <option value="">Query Related To</option>
                <option value="course">Course</option>
                <option value="registration">Registration</option>
                <option value="technical">Technical Support</option>
              </select>
            </div>

            <div>
              <input
                type="text"
                name="subject"
                placeholder="type your subject / reference here*"
                required
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004A99] focus:border-transparent transition duration-300"
              />
            </div>

            <div>
              <textarea
                name="message"
                placeholder="enter details here"
                rows="5"
                required
                value={formData.message}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#004A99] focus:border-transparent transition duration-300"
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-[#003366] hover:bg-[#00509e] text-white px-8 py-3 rounded-lg font-semibold transition duration-300 transform hover:scale-105 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Query'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}