import React, { useEffect, useState } from "react";

export default function Home() {
  const [greeting, setGreeting] = useState("");
  const [bgIndex, setBgIndex] = useState(0);
  const bgImages = [
    "/images/block.jpg",
    "/images/lab.jpg",
    "/images/lab1.jpg",
    "/images/lab3.jpg",
  ];

  // HOD Image Path - You can change this to your actual HOD image path
  const hodImagePath = "/images/hod-profile.jpg"; // Change this path to your HOD image

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning!");
    else if (hour < 18) setGreeting("Good Afternoon!");
    else setGreeting("Good Evening!");
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".scroll-reveal").forEach((el) => {
      observer.observe(el);
    });
  }, []);

  // Manual background image navigation
  const nextImage = () => {
    setBgIndex((prev) => (prev + 1) % bgImages.length);
  };

  const prevImage = () => {
    setBgIndex((prev) => (prev - 1 + bgImages.length) % bgImages.length);
  };

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-[#ffffff] text-[#132A46] mt-0 pt-0 font-sans">
      
      {/* Hero Section with Navigation Controls */}
      <section
        id="hero"
        className="h-[650px] flex flex-col items-center justify-center text-center text-white transition-all duration-1000 ease-in-out shadow-2xl relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,31,63,0.9), rgba(0,102,204,0.7)),url(${bgImages[bgIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm z-20"
          aria-label="Previous image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm z-20"
          aria-label="Next image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {bgImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setBgIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === bgIndex 
                  ? "bg-white scale-125" 
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-4">
          <h2 className="text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg animate-fade-in-down">
            Welcome to the Computer Science Department
          </h2>
          <p className="max-w-3xl text-xl leading-relaxed font-light drop-shadow-md animate-fade-in-up mx-auto">
            Our mission is to provide a <strong>quality and value-laden education</strong> in computing, producing
            competent graduates equipped to transform society through innovation and integrity.
          </p>
          <div className="mt-10 text-4xl font-black text-[#FDCB5A] drop-shadow-xl">{greeting}</div>
        </div>
      </section>

      {/* Main Content Section - Professional Layout */}
      {/* Main Content Section - Professional Layout */}
<section className="scroll-reveal opacity-0 translate-y-10 transition-all duration-[2000ms] py-24 px-10 flex flex-col lg:flex-row gap-10 justify-center items-start -mt-8 relative z-10 max-w-7xl mx-auto">
  
  {/* Introduction Section */}
  <div className="bg-white p-10 rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition duration-500 flex-1">
    <div className="text-center mb-8">
      <h2 className="text-4xl font-extrabold text-[#004A99] mb-4">Department Overview</h2>
      <div className="w-20 h-1 bg-[#FDCB5A] mx-auto mb-6"></div>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Pioneering computer science education since 2005, we are committed to excellence in teaching, research, and innovation.
      </p>
    </div>
    
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-[#004A99] mb-4 flex items-center">
          <span className="w-3 h-3 bg-[#FDCB5A] rounded-full mr-3"></span>
          Our Mission & Vision
        </h3>
        <p className="text-lg leading-relaxed text-gray-700 pl-6 border-l-4 border-[#004A99]">
          To provide exceptional computer science education through innovative teaching, cutting-edge research, 
          and industry collaboration, preparing students for successful careers in technology and beyond. Our vision 
          is to be a nationally recognized center of excellence in computing education and research.
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-[#004A99] mb-4 flex items-center">
          <span className="w-3 h-3 bg-[#FDCB5A] rounded-full mr-3"></span>
          Academic Excellence
        </h3>
        <p className="text-lg leading-relaxed text-gray-700 pl-6 border-l-4 border-[#FDCB5A]">
          Our curriculum combines theoretical foundations with practical applications, ensuring graduates 
          are equipped with the skills needed to excel in the rapidly evolving field of computer science. 
          We offer comprehensive programs from undergraduate to doctoral levels with specialized tracks in 
          emerging technologies.
        </p>
      </div>


    </div>

    {/* Enhanced Statistics Section */}
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-[#004A99] mb-6 text-center">By The Numbers</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <div className="bg-gradient-to-br from-[#E6F0FF] to-[#F0F7FF] p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
          <div className="text-3xl font-bold text-[#004A99] mb-2">25+</div>
          <div className="text-sm font-semibold text-gray-700">Faculty Members</div>
          <div className="text-xs text-gray-500 mt-1">PhD Qualified</div>
        </div>
        <div className="bg-gradient-to-br from-[#E6F0FF] to-[#F0F7FF] p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
          <div className="text-3xl font-bold text-[#004A99] mb-2">1,200+</div>
          <div className="text-sm font-semibold text-gray-700">Students</div>
          <div className="text-xs text-gray-500 mt-1">Across Programs</div>
        </div>
        <div className="bg-gradient-to-br from-[#E6F0FF] to-[#F0F7FF] p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
          <div className="text-3xl font-bold text-[#004A99] mb-2">18</div>
          <div className="text-sm font-semibold text-gray-700">Research Labs</div>
          <div className="text-xs text-gray-500 mt-1">State-of-the-Art</div>
        </div>
        <div className="bg-gradient-to-br from-[#E6F0FF] to-[#F0F7FF] p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
          <div className="text-3xl font-bold text-[#004A99] mb-2">60+</div>
          <div className="text-sm font-semibold text-gray-700">Industry Partners</div>
          <div className="text-xs text-gray-500 mt-1">Global & Local</div>
        </div>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center mt-6">
        <div className="bg-gradient-to-br from-[#FFF8E6] to-[#FFFBF0] p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
          <div className="text-3xl font-bold text-[#D97706] mb-2">95%</div>
          <div className="text-sm font-semibold text-gray-700">Placement Rate</div>
          <div className="text-xs text-gray-500 mt-1">Within 6 Months</div>
        </div>
        <div className="bg-gradient-to-br from-[#FFF8E6] to-[#FFFBF0] p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
          <div className="text-3xl font-bold text-[#D97706] mb-2">50+</div>
          <div className="text-sm font-semibold text-gray-700">Research Papers</div>
          <div className="text-xs text-gray-500 mt-1">Annual Publications</div>
        </div>
        <div className="bg-gradient-to-br from-[#FFF8E6] to-[#FFFBF0] p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
          <div className="text-3xl font-bold text-[#D97706] mb-2">15M+</div>
          <div className="text-sm font-semibold text-gray-700">Research Grants</div>
          <div className="text-xs text-gray-500 mt-1">Funding Secured</div>
        </div>
        <div className="bg-gradient-to-br from-[#FFF8E6] to-[#FFFBF0] p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
          <div className="text-3xl font-bold text-[#D97706] mb-2">100+</div>
          <div className="text-sm font-semibold text-gray-700">Projects</div>
          <div className="text-xs text-gray-500 mt-1">Industry Collaboration</div>
        </div>
      </div>
    </div>

    {/* Key Achievements Section */}
   
  </div>

        {/* Message from HOD Section */}
        <div className="bg-gradient-to-br from-[#004A99] to-[#00224e] p-8 rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition duration-500 text-white flex-1 max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-6">Leadership Message</h2>
            
            {/* HOD Profile */}
            <div className="relative mx-auto mb-6">
              <div className="relative w-40 h-40 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FDCB5A] to-[#FFD124] rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  {/* HOD Image - Replace the path with your actual HOD image */}
                  <img 
                    src={"/images/abdul rehman.jpg"} 
                    alt="Head of Department"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback placeholder if image doesn't load */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center hidden">
                    <div className="text-center">
                      <div className="text-4xl mb-1">👨‍🏫</div>
                      <div className="text-xs text-gray-600 font-medium">HOD Profile</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-[#FDCB5A]">Dr. Abd Ur Rehman

</h3>
              <p className="text-white/80 text-sm">Head of Department</p>
              <p className="text-white/70 text-xs mt-1">Professor of Computer Science</p>
            </div>
          </div>
            <br /><br />
          <div className="space-y-6">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-white/95 leading-relaxed italic text-center">
                "Welcome to the Department of Computer Science, where innovation meets excellence in education and research."
              </p>
            </div>
                    <br />
            <div className="space-y-4">
              <p className="text-white/90 leading-relaxed">
                At the University of Gujrat's Computer Science Department, we are committed to providing 
                a transformative educational experience that prepares students for leadership roles in 
                technology and beyond.
              </p>
              
              <p className="text-white/90 leading-relaxed">
                Our faculty comprises distinguished scholars and industry experts dedicated to mentoring 
                the next generation of computer scientists, engineers, and innovators.
              </p>

              <p className="text-white/90 leading-relaxed">
                Through our comprehensive programs and state-of-the-art facilities, we empower students 
                to tackle complex challenges and drive technological advancement.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="text-center">
              <p className="text-[#FDCB5A] text-sm font-semibold mb-2">Our Commitment</p>
              <div className="flex flex-wrap justify-center gap-3 text-xs">
                <span className="bg-white/20 px-3 py-1 rounded-full">Academic Excellence</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">Research Innovation</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">Student Success</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Programs - Distinctive background and modern layout for contrast */}
      <section className="scroll-reveal opacity-0 translate-y-10 transition-all duration-[2000ms] mt-24 bg-[#F0F4F8] py-20 px-8">
        <div className="flex flex-wrap justify-between items-start gap-12 max-w-[1200px] mx-auto">
          <div className="flex-1 min-w-[300px]">
            <h2 className="text-4xl font-black mb-8 tracking-tighter text-[#004A99]">
              Academic Programs
            </h2>

            {/* Program Lists - Highlighting key text with different color */}
            <h3 className="text-2xl font-bold mt-6 mb-3 text-[#4B2483]">Undergraduate</h3>
            <ul className="list-disc pl-6 text-[#132A46] font-semibold space-y-2 text-lg">
              <li className="hover:text-[#4B2483] transition">Bachelor of Science in <strong>Computer Science</strong></li>
              <li className="hover:text-[#4B2483] transition">Bachelor of Science in <strong>Software Engineering</strong></li>
              <li className="hover:text-[#4B2483] transition">Bachelor of Science in <strong>AI</strong></li>
              <li className="hover:text-[#4B2483] transition">Bachelor of Science in <strong>Cyber Security</strong></li>
              <li className="hover:text-[#4B2483] transition">Bachelor of Science in <strong>Data Science</strong></li>
            </ul>

            <h3 className="text-2xl font-bold mt-6 mb-3 text-[#4B2483]">Graduate</h3>
            <ul className="list-disc pl-6 text-[#132A46] font-semibold space-y-2 text-lg">
              <li className="hover:text-[#4B2483] transition">MS in Computer Science</li>
              <li className="hover:text-[#4B2483] transition">MS in Software Engineering</li>
              <li className="hover:text-[#4B2483] transition">MS in Artificial Intelligence</li>
            </ul>

            <h3 className="text-2xl font-bold mt-6 mb-3 text-[#4B2483]">PhD</h3>
            <ul className="list-disc pl-6 text-[#132A46] font-semibold space-y-2 text-lg">
              <li className="hover:text-[#4B2483] transition">PhD in Computer Science</li>
            </ul>

            {/* Primary Call-to-Action Button - Strong, filled background, shadow, and hover effect */}
            <a
              href="/programs"
              className="inline-block bg-[#004A99] text-white px-8 py-4 mt-8 font-extrabold rounded-full shadow-lg hover:bg-[#003366] hover:shadow-xl transition transform hover:scale-105 uppercase tracking-widest"
            >
              Explore All Programs
            </a>
          </div>

          {/* Image Block - Retained and enhanced overlapping effect for depth */}
          <div className="relative flex-1 min-w-[300px] max-w-[500px] h-[400px]">
            <div className="absolute top-[-20px] left-[20px] w-full h-full bg-[#4B2483] rounded-xl shadow-2xl"></div>
            <div className="absolute top-[20px] left-[-20px] w-full h-full bg-[#FDCB5A] rounded-xl shadow-xl"></div>
            <img 
              src="/images/block.jpg" 
              alt="Academic Building" 
              className="rounded-xl relative z-10 w-full h-full object-cover shadow-2xl" 
            />
          </div>
        </div>
      </section>

      {/* Info Cards - Uniform modern look with strong focus color */}
      <div className="scroll-reveal opacity-0 translate-y-10 transition-all duration-[2000ms] flex flex-col gap-8 items-start mt-24 mb-20 mx-auto w-[90%] max-w-[1000px]">
        {[
          {
            title: "About Us",
            text: "The Department of Computer Science at the University of Gujrat was established in 2005 with a vision to become a center of excellence in computer science education and research. Over the years, we have grown from a small department with limited resources to a thriving academic unit with state-of-the-art facilities and a diverse faculty. Our mission is to provide quality and value-laden education in computing, producing competent graduates equipped to transform society through innovation and integrity.",
            link: "/about",
          },
          {
            title: "Our Faculty",
            text: "Our department boasts a diverse team of highly qualified faculty members who are experts in their respective fields. They bring a wealth of knowledge, experience, and passion to the classroom, ensuring that our students receive the highest quality education. With over 20 faculty members, including professors, associate professors, assistant professors, and lecturers, our team is dedicated to academic excellence and cutting-edge research.",
            link: "/faculty",
          },
          {
            title: "FAQs",
            text: "Find answers to the most frequently asked questions about our programs, admissions, facilities, and more. Our comprehensive FAQ section covers topics such as admission requirements, program durations, internship opportunities, computing facilities, and career prospects. If you cannot find the information you are looking for, our team is always ready to help with any additional questions you may have.",
            link: "/faqs",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white p-10 rounded-2xl shadow-xl border-b-4 border-[#FDCB5A] hover:shadow-2xl hover:-translate-y-1 transition duration-500 w-full"
          >
            <h3 className="text-3xl font-extrabold mb-4 text-[#004A99]">{card.title}</h3>
            <p className="mb-4 text-lg leading-relaxed text-[#132A46]">{card.text}</p>
            <a
              href={card.link}
              className="inline-block bg-[#FDCB5A] text-[#132A46] px-6 py-3 mt-2 font-bold rounded-lg shadow hover:bg-[#D97706] transition"
            >
              Read More &rarr;
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}