import React, { useEffect, useState } from "react";
import { FaLinkedin, FaYoutube } from "react-icons/fa";
import { SiGooglescholar } from "react-icons/si";

export default function Faculty() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null); // ✅ to track which card is clicked

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const faculty = [
    {
      name: "Dr. Umer Shoaib",
      designation: "Professor & Head of Department",
      specialization: "Artificial Intelligence, Machine Learning",
      education: "PhD in Computer Science, Stanford University",
      email: "umar.shoaib@uog.edu.pk",
      office: "CS-101",
      img: "/images/umar.jpg",
      category: "professors",
      links: {
        linkedin: "https://www.linkedin.com/in/umar-shoaib-9997701b/",
        scholar: "https://www.researchgate.net/scientific-contributions/Umar-Shoaib-2177468469",
      },
    },
    {
      name: "Mr Najeeb-Ur-Rehman",
      designation: "Assistant Professor",
      specialization: "Data Science, Big Data Analytics",
      education: "MS in Data Science, MIT",
      email: "najeeb.rehman@uog.edu.pk",
      office: "CS-102",
      img: "/images/NAJEEB.jpeg",
      category: "assistant",
      links: {
        linkedin: "https://www.linkedin.com/in/najeeb-ur-rehman-09b78bb3/",
        scholar: "https://scholar.google.com.pk/citations?user=buxBXpsAAAAJ&hl=en",
      },
    },
    {
      name: "Dr. Abdur Rehman",
      designation: "Assistant Professor",
      specialization: "Computer Science",
      education: "PhD, University of Engg & Tech Lhr",
      email: "a.rehman@uog.edu.pk",
      office: "CS-201",
      img: "/images/abdul rehman.jpg",
      category: "assistant",
      links: {
        scholar: "https://www.researchgate.net/profile/Abdul-Rehman-269",
      },
    },
    {
      name: "Dr. Muhammad Usman Ali",
      designation: "Assistant Professor",
      specialization: "Information and Communication Engineering",
      education: "MS, University of Engineering & Technology Texila",
      email: "m.usmanali@uog.edu.pk",
      office: "CS-401",
      img: "/images/usman.jpeg",
      category: "lecturers",
      links: {
        linkedin: "https://www.linkedin.com/in/muhammad-usman-ali-6b12645/",
      },
    },
    {
      name: "Dr. Naveed Anwer Butt",
      designation: "Assistant Professor",
      specialization: "Artificial Intelligence",
      education: "PhD Computer Science, International Islamic University",
      email: "naveed@uog.edu.pk",
      office: "CS-302",
      img: "/images/anwer.jpeg",
      category: "assistant",
      links: {
        linkedin: "https://www.linkedin.com/in/naveed-anwer-butt-b669a7133/",
        scholar: "https://scholar.google.com/citations?user=aU6rNxwAAAAJ&hl=en",
      },
    },
    {
      name: "Ehtisham Rasheed",
      designation: "Lecturer",
      specialization: "Computer Engineering",
      education: "MS in Computer Science, LUMS",
      email: "ehtisham.rashid@uog.edu.pk",
      office: "CS-202",
      img: "/images/Ehtisham.jpg",
      category: "associate",
      links: {
        linkedin: "https://www.linkedin.com/in/ehtisham-rasheed-02809019",
        youtube: "https://www.youtube.com/@ehtishamrasheed",
      },
    },
  ];

  const categories = [
    { id: "all", label: "All Faculty" },
    { id: "professors", label: "Professors" },
    { id: "associate", label: "Associate Professors" },
    { id: "assistant", label: "Assistant Professors" },
    { id: "lecturers", label: "Lecturers" },
  ];

  return (
    <main
      className={`min-h-screen bg-gradient-to-br from-slate-50 pt-18 via-blue-50 to-indigo-100 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Hero Section */}
      <section className="text-center py-16 px-8">
        <h1 className="text-4xl font-bold text-[#003366] mb-4 tracking-wide">
          Meet Our Distinguished Faculty
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
          Our department prides itself on having a team of dedicated educators and researchers who
          inspire students through knowledge, innovation, and mentorship.
        </p>
      </section>

      {/* Category Buttons */}
      <section className="flex justify-center gap-4 flex-wrap mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-md ${
              activeCategory === cat.id
                ? "bg-gradient-to-r from-[#004A99] to-[#0066CC] text-white scale-105 shadow-lg"
                : "bg-white text-[#003366] border border-[#004A99] hover:bg-[#E6F0FF]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </section>

      {/* Faculty Grid */}
      <section className="grid gap-10 px-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mb-20">
        {faculty
          .filter((f) => activeCategory === "all" || f.category === activeCategory)
          .map((f, i) => (
            <div
              key={i}
              onClick={() => setSelectedFaculty(i)} // ✅ when clicked
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-500 overflow-hidden group cursor-pointer ${
                selectedFaculty === i
                  ? "border-yellow-400 shadow-yellow-400 shadow-xl scale-[1.03]"
                  : "border-gray-200 hover:shadow-2xl hover:-translate-y-2"
              }`}
            >
              {/* Circular Image */}
              <div className="relative flex justify-center mt-6">
                <div className="rounded-full overflow-hidden w-40 h-40 border-4 border-[#004A99] shadow-lg group-hover:shadow-[#004A99]/50 transition-all duration-500">
                  <img
                    src={f.img}
                    alt={f.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-[#003366] group-hover:text-[#004A99] transition-colors duration-300 mb-1">
                  {f.name}
                </h3>
                <p className="text-[#4B2483] font-semibold mb-1">{f.designation}</p>
                <p className="text-gray-700 text-sm mb-2">{f.specialization}</p>
                <p className="text-gray-500 text-sm italic mb-4">{f.education}</p>
                <p className="text-sm">
                  <strong>Email:</strong> {f.email}
                </p>
                <p className="text-sm mb-3">
                  <strong>Office:</strong> {f.office}
                </p>

                {/* Links */}
                <div className="flex justify-center gap-4 mt-4">
                  {f.links.linkedin && (
                    <a
                      href={f.links.linkedin}
                      className="text-[#0077B5] hover:text-[#005582] text-2xl transition-all duration-300"
                      target="_blank"
                    >
                      <FaLinkedin />
                    </a>
                  )}
                  {f.links.scholar && (
                    <a
                      href={f.links.scholar}
                      className="text-[#34A853] hover:text-[#2a853e] text-2xl transition-all duration-300"
                      target="_blank"
                    >
                      <SiGooglescholar />
                    </a>
                  )}
                  {f.links.youtube && (
                    <a
                      href={f.links.youtube}
                      className="text-[#FF0000] hover:text-[#cc0000] text-2xl transition-all duration-300"
                      target="_blank"
                    >
                      <FaYoutube />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 px-8 border-t border-gray-200 shadow-inner">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
          {[
            { num: "20+", text: "Faculty Members" },
            { num: "85%", text: "PhD Holders" },
            { num: "150+", text: "Research Publications" },
            { num: "25+", text: "Research Projects" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-[#E6F0FF] to-[#F8FAFF] p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-[#dbe3f0]"
            >
              <h3 className="text-4xl font-extrabold text-[#004A99] mb-2">{stat.num}</h3>
              <p className="text-lg font-medium text-[#132A46]">{stat.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
