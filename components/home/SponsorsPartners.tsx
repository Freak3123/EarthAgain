import React from 'react'
import Image from 'next/image'

export default function SponsorsPartners() {
  return (
    <div className='bg-[#fefaf2]'>
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Partners & Sponsors</h2>
            <p className="text-xl text-gray-600">Collaborating with leading organizations for maximum impact</p>
          </div>

          {/* Media Partners */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Media Partners</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
              {[
                { name: "Sambad", logo: "Sambad newspaper logo" },
                { name: "Kanak News", logo: "Kanak News channel logo" },
                { name: "OTV", logo: "OTV news channel logo" },
                { name: "Argus News", logo: "Argus News logo" },
                { name: "Kalinga TV", logo: "Kalinga TV logo" },
                { name: "News7", logo: "News7 channel logo" },
              ].map((partner, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Image
                    src={`/placeholder.svg?height=60&width=120&query=${partner.logo}`}
                    alt={partner.name}
                    width={120}
                    height={60}
                    className="w-full h-12 object-contain grayscale hover:grayscale-0 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Climate Organizations */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Climate Organizations</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
              {[
                { name: "WWF India", logo: "WWF India panda logo" },
                { name: "Greenpeace", logo: "Greenpeace environmental logo" },
                { name: "CSE", logo: "Centre for Science and Environment logo" },
                { name: "TERI", logo: "TERI energy research logo" },
                { name: "CII", logo: "Confederation of Indian Industry logo" },
              ].map((org, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Image
                    src={`/placeholder.svg?height=60&width=120&query=${org.logo}`}
                    alt={org.name}
                    width={120}
                    height={60}
                    className="w-full h-12 object-contain grayscale hover:grayscale-0 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Government Support */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Government Support</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              {[
                { name: "Govt of Odisha", logo: "Government of Odisha official emblem" },
                { name: "Ministry of Environment", logo: "Ministry of Environment India logo" },
                { name: "Forest Department", logo: "Odisha Forest Department logo" },
                { name: "Pollution Control Board", logo: "Odisha Pollution Control Board logo" },
              ].map((govt, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Image
                    src={`/placeholder.svg?height=60&width=120&query=${govt.logo}`}
                    alt={govt.name}
                    width={120}
                    height={60}
                    className="w-full h-12 object-contain grayscale hover:grayscale-0 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
