import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Packages = () => {
  const addons = {
    rushDelivery: { 
      price: 100, 
      label: 'Livrare rapidă (24–48h)',
      description: 'Procesare prioritară pentru livrare mai rapidă.',
      availableFor: ['personal', 'business', 'premium', 'instrumental', 'remix']
    },
    commercialRights: { 
      price: 100, 
      label: 'Drepturi comerciale (YouTube, Spotify etc.)',
      description: 'Drept de a folosi melodia pe Youtube, Tik-Tok, Spotify.',
      availableFor: ['personal']
    },
    distributieMangoRecords: {
      price: 200, 
      label: 'Distribuție exclusivă pe Mango Records',
      description: 'Distribuție prin canalul nostru cu vizibilitate maximă.',
      availableFor: ['personal', 'remix', 'instrumental']
    },				 
    customVideo: { 
      price: 149, 
      label: 'Videoclip personalizat (cu pozele tale)',
      description: 'Videoclip realizat cu materialele vizuale oferite de tine (foto/video).',
      availableFor: ['personal', 'business', 'premium', 'instrumental', 'remix']
    },
    audioMessageFromSender: { 
      price: 100, 
      label: 'Mesaj audio de la expeditor',
      description: 'Include un mesaj audio personalizat de la tine.',
      availableFor: ['personal', 'business', 'premium']
    },
    commercialRightsUpgrade: {
      price: 400,
      label: 'Upgrade drepturi comerciale',
      description: 'Transfer complet de drepturi comerciale – permite utilizarea nelimitată inclusiv online, TV sau pentru vânzare.',
      availableFor: ['business']
    },
    extendedSong: {
      price: 49,
      label: 'Melodie extinsă (3 strofe)',
      description: 'Melodie mai lungă – 3 strofe în loc de 2. Ideal pentru povești mai detaliate.',
      availableFor: ['personal', 'premium', 'business']
    }
  };

  const packages = {
    personal: {
      name: 'Pachet Personal',
      icon: '🎁',
      price: 300,
      currency: 'RON',
      delivery: '3-5 zile',
      tagline: 'Un cântec creat special pentru tine și cei dragi.',
      description: 'Pentru cei care vor să transforme o poveste emoționantă într-un cadou unic – ideal pentru aniversări, nunți sau alte ocazii speciale.',
      features: [
        'Cântec complet personalizat inspirat din povestea ta',
        'Voce profesionistă oferită de echipa MusicGift',
        'Livrare în 3–5 zile',
        'Drepturi de utilizare personală (fără scop comercial)',
        'Consultare creativă – povestea ta și preferințele muzicale'
      ],
      availableAddons: [
        'rushDelivery',
        'commercialRights',
        'distributieMangoRecords',
        'customVideo',
        'audioMessageFromSender',
        'extendedSong'
      ],
      popular: false,
      isGiftCard: false
    },
    business: {
      name: 'Pachet Business',
      icon: '💼',
      price: 500,
      currency: 'RON',
      delivery: '5-7 zile',
      tagline: 'Oferă brandului tău vocea pe care o merită.',
      description: 'Ideal pentru companii și branduri care vor un cântec personalizat pentru branding, reclame sau campanii de imagine.',
      features: [
        'Cântec compus special pentru afacerea ta',
        'Producție premium și voce profesionistă',
        'Mix & Master profesional',
        'Licență comercială limitată'
      ],
      availableAddons: [
        'rushDelivery',
        'customVideo',
        'audioMessageFromSender',
        'commercialRightsUpgrade',
        'extendedSong'
      ],
      popular: false,
      isGiftCard: false
    },
    premium: {
      name: 'Pachet Premium',
      icon: '🌟',
      price: 500,
      currency: 'RON',
      delivery: '5-7 zile',
      tagline: 'Creează un impact. Lasă muzica să vorbească pentru tine.',
      description: 'Pentru cei care vor o lansare completă: cântec, videoclip și distribuție globală.',
      features: [
        'Cântec original cu producție completă',
        'Videoclip animat standard (stil Do Music for Good Band)',
        'Distribuție oficială prin Mango Records',
        'Drepturi comerciale extinse'
      ],
      availableAddons: [
        'rushDelivery',
        'customVideo',
        'audioMessageFromSender',
        'extendedSong'
      ],
      popular: true,
      isGiftCard: false
    },
    artist: {
      name: 'Pachet Artist',
      icon: '🎤',
      price: 8000,
      currency: 'RON',
      delivery: '7–10 zile',
      tagline: 'Călătoria ta muzicală începe aici.',
      description: 'Pentru artiști dedicați care caută o piesă originală de top și distribuție reală.',
      features: [
        'Piesă originală și instrumental compus profesional',
        'Ghid vocal + înregistrare cu voce de studio',
        'Copropietate 50/50 asupra masterului',
        'Distribuție completă prin Mango Records pe toate platformele majore'
      ],
      availableAddons: [],
      popular: false,
      isGiftCard: false
    },
    instrumental: {
      name: 'Pachet Instrumental',
      icon: '🎶',
      price: 500,
      currency: 'RON',
      delivery: '3-5 zile',
      tagline: 'Construiește-ți cântecul pe un instrumental premium.',
      description: 'Pentru artiști care doresc un instrumental de calitate, dar preferă să compună melodia și vocea proprii.',
      features: [
        'Instrumental original compus de echipa MusicGift',
        'Aranjament complet: beat, armonii, structură',
        'Fără voce (spațiu pentru vocea ta)',
        'Fișier audio de calitate (WAV sau MP3)'
      ],
      availableAddons: [
        'rushDelivery',
        'customVideo',
        'distributieMangoRecords'
      ],
      popular: false,
      isGiftCard: false
    },
    remix: {
      name: 'Pachet Remix',
      icon: '🔁',
      price: 500,
      currency: 'RON',
      delivery: '4-6 zile',
      tagline: 'Reinterpretează piesa ta. Creează un vibe complet nou.',
      description: 'Pentru artiști sau creatori care dețin 100% din drepturile unei piese și vor o versiune remixată profesional într-un nou stil muzical.',
      features: [
        '1 remix complet într-un gen ales de tine (ex: deep house, R&B, lofi)',
        'Etichetă personalizabilă: "Remix by Mango Records" sau "Remix by Mihai Gruia"',
        'Mix & Master profesional',
        'Export WAV + MP3',
        'Versiune scurtă pentru social media (opțional)',
        'Necesită trimiterea piesei originale + dovada drepturilor'
      ],
      availableAddons: [
        'rushDelivery',
        'customVideo',
        'distributieMangoRecords'
      ],
      popular: false,
      isGiftCard: false
    },
    gift: {
      name: 'Pachet Cadou',
      icon: '🎁',
      price: 0,
      currency: 'RON',
      delivery: 'Livrare digitală instantanee',
      tagline: 'Oferă darul muzicii – o poveste transformată în cântec.',
      description: 'Pentru cei care vor să surprindă pe cineva drag cu un cadou muzical personalizat, lăsându-l să aleagă stilul și atmosfera.',
      features: [
        'Card cadou digital valabil pentru orice pachet MusicGift',
        'Mesaj personalizat de la expeditor (opțional cu mesaj audio)',
        'Livrare prin e-mail sau PDF printabil',
        'Destinatarul alege pachetul preferat'
      ],
      isGiftCard: true,
      availableAddons: []
    }
  };

  // Convert packages object to array for rendering
  const packageArray = Object.values(packages);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">Choose Your Package</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Select the perfect music package that fits your needs and budget
          </p>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-8xl mx-auto">
            {packageArray.map((pkg, index) => (
              <Card 
                key={index} 
                className={`relative hover:shadow-xl transition-all duration-300 ${
                  pkg.popular ? 'border-2 border-purple-200 scale-105' : ''
                } ${pkg.isGiftCard ? 'border-2 border-yellow-200' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {pkg.isGiftCard && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Gift Card
                    </span>
                  </div>
                )}
                
                <CardContent className="p-6">
                  {/* Icon and Title */}
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-3">{pkg.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <p className="text-sm text-purple-600 font-medium mb-3">{pkg.tagline}</p>
                    
                    {/* Price */}
                    <div className="mb-4">
                      {pkg.price === 0 ? (
                        <div className="text-3xl font-bold text-purple-600">
                          Free
                        </div>
                      ) : (
                        <div className="text-3xl font-bold text-purple-600">
                          {pkg.price}
                          <span className="text-lg text-gray-500 ml-1">{pkg.currency}</span>
                        </div>
                      )}
                      <div className="text-sm text-gray-500 mt-1">{pkg.delivery}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-xs font-bold">✓</span>
                        </span>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${
                      pkg.popular 
                        ? 'bg-gradient-purple hover:opacity-90 text-white' 
                        : pkg.isGiftCard
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90 text-white'
                        : 'bg-gradient-purple hover:opacity-90'
                    }`}
                    size="lg"
                  >
                    {pkg.isGiftCard ? 'Get Gift Card' : 'Order Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Packages;
