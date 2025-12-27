import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Assuming these paths are correct for your setup
import abdullahImg from "/images/abdullah.png";
import inshaImg from "/images/insha.png";
import anzaImg from "/images/anza.jpg";

function About() {
  // isVisible is already used for main container opacity transition
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // This is a simple mount animation for the whole page
    setIsVisible(true);
  }, []);

  const teamMembers = [
    {
      photo: abdullahImg,
      name: "Abdullah Tanveer",
      role: "Full Stack Developer",
      desc: "5th semester CS student specializing in web development and programming with expertise in React, JavaScript, and backend technologies.",
      skills: ["React", "JavaScript", "Node.js", "MongoDB"]
    },
    {
      photo: inshaImg,
      name: "Insha Fakhar",
      role: "UI/UX Designer",
      desc: "Creative designer focused on front-end styling, content writing, and creating exceptional user experiences.",
      skills: ["UI/UX Design", "Content Writing", "Figma"]
    },
    {
      photo: anzaImg,
      name: "Anza Imtiaz",
      role: "Research Specialist",
      roleLong: "Research Specialist", // Adding a long role for better text
      desc: "Organized professional responsible for research, content structuring, and ensuring projects align with academic goals.",
      skills: ["Research", "Project Management", "Analysis"]
    },
  ];

  const features = [
    {
      title: "Web Development",
      desc: "Modern, responsive websites built with cutting-edge technologies for exceptional user experiences.",
      icon: "💻"
    },
    {
      title: "SEO Services",
      desc: "Professional SEO services including technical audits and on-page optimization for better visibility.",
      icon: "📈"
    },
    {
      title: "UI/UX Design",
      desc: "User-centered design approach creating intuitive interfaces across all devices.",
      icon: "🎨"
    },
    {
      title: "Content Strategy",
      desc: "Strategic content planning that engages your audience and establishes brand authority.",
      icon: "📝"
    }
  ];

  const facts = [
    { number: "3+", text: "Years of Academic Excellence", icon: "🎓" },
    { number: "100+", text: "Successful Projects Completed", icon: "✨" },
    { number: "95%", text: "Student Satisfaction Rate", icon: "💖" },
    { number: "5+", text: "Core Technologies Mastered", icon: "🛠️" },
  ];

  return (
    // Main container with mount animation
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-32z mt-40 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>

      {/* Hero Section - NEW */}
      <section className="max-w-6xl mx-auto px-6 mb-20 text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-10 border-t-4 border-[#003366] transform transition-all duration-500 ease-in-out hover:scale-[1.01]">
          <h1 className="text-5xl font-extrabold text-[#003366] mb-4 animate-fadeInDown">
            Innovating the Future of Tech Education
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-6 animate-fadeInUp delay-200">
            We are a group of dedicated Computer Science students committed to excellence in development, design, and research. Our collaborative spirit drives us to turn academic knowledge into real-world digital solutions.
          </p>
          <Link
            to="/contactus" // Assuming you have a contact route
            className="inline-block bg-[#ffcc00] text-[#003366] font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-[#ffb300] transition-all duration-300 transform hover:scale-105"
          >
            Get in Touch
          </Link>
        </div>
      </section>
      {/* End Hero Section */}

      {/* Team Section - Existing, with minor padding tweak */}
      <section className="max-w-6xl mx-auto px-6 mb-16 mt-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-[#003366] mb-4 border-b-2 border-[#ffcc00] inline-block pb-1">Meet Our Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Dedicated students working together to create innovative digital solutions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="relative bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer overflow-hidden"
            >
              {/* Profile Image with Hover Effect */}
              <div className="relative mb-6">
                <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-r from-[#003366] to-[#004080] p-1 group-hover:from-[#004080] group-hover:to-[#0055aa] transition-all duration-300">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover border-4 border-white group-hover:border-[#ffcc00] transition-all duration-300"
                  />
                </div>
              </div>

              {/* Content with Hover Effects */}
              <h3 className="text-xl font-semibold text-[#003366] mb-2 group-hover:text-[#004080] transition-colors duration-300">
                {member.name}
              </h3>
              <div className="text-[#004080] font-medium text-sm mb-3 group-hover:text-[#0055aa] transition-colors duration-300">
                {member.role}
              </div>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {member.desc}
              </p>

              {/* Skills with Hover Effects */}
              <div className="flex flex-wrap justify-center gap-2">
                {member.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="bg-[#003366] text-white px-3 py-1 rounded-full text-xs font-medium group-hover:bg-[#004080] group-hover:scale-105 transition-all duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Border highlight on hover (Ensure relative/absolute positioning is correct) */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#ffcc00] transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </section>
      {/* End Team Section */}


      {/* Key Facts / Stats Section - NEW */}
      <section className="max-w-6xl mx-auto px-6 mb-16 py-10 bg-[#003366] rounded-2xl shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
          {facts.map((fact, index) => (
            <div key={index} className="transition-transform duration-300 hover:scale-105">
              <div className="text-5xl mb-3 text-[#ffcc00]">{fact.icon}</div>
              <div className="text-4xl font-extrabold mb-1">{fact.number}</div>
              <p className="text-lg font-light">{fact.text}</p>
            </div>
          ))}
        </div>
      </section>
      {/* End Key Facts Section */}


      {/* Mission & Vision - Existing */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-l-[#003366] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-3xl mb-4 text-[#003366]">🎯</div>
            <h3 className="text-2xl font-bold text-[#003366] mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To provide quality computer science education that prepares students for successful
              careers in technology through innovative teaching, research, and hands-on experience.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-l-[#ffcc00] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-3xl mb-4 text-[#ffcc00]">🚀</div>
            <h3 className="text-2xl font-bold text-[#003366] mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To be a leading computer science department recognized for excellence in education,
              research, and innovation that addresses real-world challenges.
            </p>
          </div>
        </div>
      </section>
      {/* End Mission & Vision */}


      {/* Features Section - Existing, with enhanced heading */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-[#003366] mb-4 border-b-2 border-[#ffcc00] inline-block pb-1">Our Core Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Comprehensive services and learning opportunities for our students
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Changed grid to 4 columns on large screens */}
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="text-3xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 inline-block">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-[#003366] mb-3 group-hover:text-[#004080] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
      {/* End Features Section */}


      {/* Technology Stack - Existing, with enhanced styling */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div className="bg-white rounded-2xl shadow-2xl p-10 border-t-4 border-t-[#ffcc00] hover:shadow-3xl transition-all duration-300">
          <h2 className="text-4xl font-extrabold text-[#003366] mb-10 text-center border-b-2 border-gray-100 pb-4">Technologies We Use</h2>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
            {[
              { name: "React.js", emoji: "⚛️" },
              { name: "JavaScript", emoji: "💻" },
              { name: "Node.js", emoji: "⚙️" },
              { name: "MongoDB", emoji: "🗄️" },
              { name: "Tailwind CSS", emoji: "🎨" },
              { name: "Express", emoji: "🚀" },
              { name: "Git", emoji: "📚" },
              { name: "Figma", emoji: "🎯" }
            ].map((tech, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-3 text-center hover:bg-[#e0e7ff] hover:text-[#003366] hover:scale-105 hover:shadow-md transition-all duration-300 cursor-pointer border border-transparent hover:border-[#003366]"
              >
                <div className="text-3xl mb-1">{tech.emoji}</div>
                <h4 className="font-semibold text-sm text-[#003366]">{tech.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* End Technology Stack */}


      {/* CTA Section - NEW */}
      
      {/* End CTA Section */}

    </div>
  );
}

export default About;