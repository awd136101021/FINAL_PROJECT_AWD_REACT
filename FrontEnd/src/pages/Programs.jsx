import React, { useEffect, useState } from "react";

export default function Programs() {
  const [filter, setFilter] = useState("all");

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

  // Program data
  const programs = [
    {
      level: "undergraduate",
      title: "Bachelor of Science in Computer Science",
      duration: "4 Years",
      desc: "Provides a strong foundation in computing principles, algorithms, programming languages, and software development.",
      courses: [
        "Data Structures and Algorithms",
        "Object-Oriented Programming",
        "Database Systems",
        "Computer Networks",
        "Artificial Intelligence",
        "Web Development",
      ],
      careers: [
        "Software Developer",
        "Systems Analyst",
        "Database Administrator",
        "Web Developer",
        "IT Consultant",
      ],
    },
    {
      level: "undergraduate",
      title: "Bachelor of Science in Software Engineering",
      duration: "4 Years",
      desc: "Focuses on software design, testing, and project management for large-scale systems.",
      courses: [
        "Software Engineering Principles",
        "Software Design and Architecture",
        "Software Testing and Quality Assurance",
        "Software Project Management",
        "Requirements Engineering",
        "Mobile Application Development",
      ],
      careers: [
        "Software Engineer",
        "Software Architect",
        "QA Engineer",
        "Project Manager",
        "DevOps Engineer",
      ],
    },
    {
      level: "undergraduate",
      title: "Bachelor of Science in Artificial Intelligence",
      duration: "4 Years",
      desc: "Prepares students to develop intelligent systems using ML, neural networks, and NLP.",
      courses: [
        "Introduction to Artificial Intelligence",
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing",
        "Computer Vision",
        "Robotics",
      ],
      careers: [
        "AI Engineer",
        "Machine Learning Engineer",
        "Data Scientist",
        "Research Scientist",
        "AI Product Manager",
      ],
    },
    {
      level: "graduate",
      title: "Master of Science in Computer Science",
      duration: "2 Years",
      desc: "Advanced study in computing theory and applications with specializations in AI, data science, or cybersecurity.",
      courses: [
        "Advanced Algorithms",
        "Advanced Database Systems",
        "Distributed Systems",
        "Cloud Computing",
        "Advanced Computer Networks",
        "Research Methodology",
      ],
      careers: [
        "Senior Software Engineer",
        "Research Scientist",
        "Systems Architect",
        "Technical Lead",
        "Academic Researcher",
      ],
    },
    {
      level: "graduate",
      title: "Master of Science in Software Engineering",
      duration: "2 Years",
      desc: "Provides advanced knowledge in software development, QA, and enterprise systems.",
      courses: [
        "Advanced Software Engineering",
        "Software Metrics and Models",
        "Software Verification and Validation",
        "Enterprise Software Architecture",
        "Agile Methodologies",
        "Software Risk Management",
      ],
      careers: [
        "Senior Software Engineer",
        "Software Architect",
        "Project Manager",
        "QA Manager",
        "Process Improvement Specialist",
      ],
    },
    {
      level: "doctorate",
      title: "PhD in Computer Science",
      duration: "3–5 Years",
      desc: "For students pursuing advanced research in AI, networks, security, and theoretical computing.",
      courses: [
        "Artificial Intelligence & ML",
        "Big Data Analytics",
        "Computer Networks & Security",
        "Human-Computer Interaction",
        "Software Systems",
      ],
      careers: [
        "University Professor",
        "Research Scientist",
        "R&D Director",
        "CTO",
        "Research Lab Director",
      ],
    },
  ];

  // Admissions Info
  const admissions = [
    {
      title: "Undergraduate Admissions",
      desc: "Open twice a year in Fall and Spring. Requires Intermediate (Pre-Engineering or ICS) with at least 60% marks.",
      reqs: [
        "Intermediate Certificate",
        "Entrance Test Score",
        "Application Form",
        "Personal Statement",
      ],
    },
    {
      title: "Graduate Admissions",
      desc: "Conducted once a year. Requires a relevant bachelor's degree with a minimum CGPA of 2.5 or 60%.",
      reqs: [
        "Bachelor's Degree Certificate",
        "Transcript",
        "GAT/GRE Score",
        "Two Reference Letters",
        "Statement of Purpose",
      ],
    },
    {
      title: "Doctorate Admissions",
      desc: "Highly competitive; requires MS/MPhil degree, research proposal, and supervisor availability.",
      reqs: [
        "MS/MPhil Degree Certificate",
        "Transcript",
        "Research Proposal",
        "GAT/GRE Subject Score",
        "Three Reference Letters",
        "Interview",
      ],
    },
  ];

  return (
    <main className="bg-[#ffffff] text-[#132A46] font-sans">
      
      {/* Intro */}
      <section className="scroll-reveal opacity-0 translate-y-10 transition-all duration-1000 text-center py-16 px-8 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-[#004A99] mt-10">
          Explore Our Programs
        </h2>
        <p className="text-lg leading-relaxed text-[#132A46]">
          The Department of Computer Science offers a range of academic programs
          designed to prepare students for successful careers in the evolving
          field of computing. Our curriculum blends theoretical knowledge with
          hands-on experience.
        </p>
      </section>

     
      {/* Program Cards */}
      <section className="scroll-reveal opacity-0 translate-y-10 transition-all duration-[1500ms] max-w-[1200px] mx-auto px-6 grid gap-10 md:grid-cols-2">
        {programs
          .filter((p) => filter === "all" || p.level === filter)
          .map((p, i) => (
            <div
              key={i}
              className="bg-white border-t-4 border-[#004A99] rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition duration-500"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-extrabold text-[#004A99]">
                  {p.title}
                </h3>
                <span className="text-sm bg-[#FDCB5A] text-[#132A46] px-3 py-1 rounded-full font-semibold">
                  {p.duration}
                </span>
              </div>
              <p className="mb-4 text-[#132A46]">{p.desc}</p>
              <h4 className="font-bold text-[#4B2483] mb-2">Key Courses:</h4>
              <ul className="list-disc pl-6 mb-4 text-[#132A46] space-y-1">
                {p.courses.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
              <h4 className="font-bold text-[#4B2483] mb-2">
                Career Opportunities:
              </h4>
              <ul className="list-disc pl-6 text-[#132A46] space-y-1">
                {p.careers.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
              
            </div>
          ))}
      </section>

      {/* Admission Info */}
      <section className="scroll-reveal opacity-0 translate-y-10 transition-all duration-[2000ms] bg-[#F0F4F8] py-20 px-8 mt-20">
        <h2 className="text-4xl font-black text-center text-[#004A99] mb-10">
          Admission Information
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
          {admissions.map((a, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-[#FDCB5A] hover:shadow-2xl hover:-translate-y-1 transition duration-500"
            >
              <h3 className="text-2xl font-bold text-[#004A99] mb-3">
                {a.title}
              </h3>
              <p className="mb-3 text-[#132A46]">{a.desc}</p>
              <h4 className="font-semibold text-[#4B2483] mb-2">
                Requirements:
              </h4>
              <ul className="list-disc pl-6 text-[#132A46] space-y-1">
                {a.reqs.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <a
  href="https://uog.edu.pk/admissions"
  target="_blank"
  rel="noopener noreferrer"
>
  <button className="mt-6 bg-[#FDCB5A] text-[#132A46] px-6 py-2 rounded-full font-bold hover:bg-[#D97706] transition">
    Apply Now
  </button>
</a>

            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
