
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const teamMembers = [
    {
      name: "Mihai Gruia",
      role: "Lead Composer & Music Director",
      color: "bg-purple-500"
    },
    {
      name: "Ionela Mirunescu", 
      role: "Lead Vocalist & Lyricist",
      color: "bg-purple-500"
    },
    {
      name: "Radu Popescu",
      role: "Sound Engineer & Producer", 
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section with centered title */}
      <section className="pt-24 pb-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">About MusicGift</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-purple-600 mb-6">
                  Creating Musical Memories Since 2020
                </h2>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p>
                    MusicGift.ro was founded with a simple mission: to help people 
                    express their deepest emotions through personalized music. We believe 
                    that every love story, every friendship, and every special moment 
                    deserves its own soundtrack.
                  </p>
                  
                  <p>
                    Our team of talented composers, lyricists, and vocalists work 
                    together to transform your stories into beautiful, custom-made 
                    songs. From romantic ballads to upbeat celebration songs, we've 
                    helped over 1,000 customers create unforgettable musical gifts.
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-purple-600 mb-2">1,000+</h3>
                  <p className="text-gray-600">Songs Created</p>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-purple-600 mb-2">3+</h3>
                  <p className="text-gray-600">Years Experience</p>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-purple-600 mb-2">98%</h3>
                  <p className="text-gray-600">Client Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Right Content - Team */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Our Creative Team</h3>
              <div className="space-y-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-sm">
                    <div className={`w-16 h-16 ${member.color} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold text-xl">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{member.name}</h4>
                      <p className="text-gray-600">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
