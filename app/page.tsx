// app/page.tsx
export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0d1117] text-white font-manrope">
      {/* Hero Section */}
      <section className="wavy-gradient px-4 py-20 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Buy Cheap Mobile Data Instantly
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-8">
            Affordable MTN, Glo, Airtel, and 9mobile data plans with instant
            delivery across Nigeria.
          </p>
          <a
            href="/signup"
            className="inline-block bg-[#19e586] text-black px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-[#0d1117]">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Use Loyatee?</h2>
          <p className="text-gray-400 text-lg">
            We’re focused on fast delivery, great pricing, and top-notch
            support.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              title: "Instant Delivery",
              desc: "Your data gets delivered almost instantly, even during peak hours.",
              icon: "⚡",
            },
            {
              title: "Affordable Pricing",
              desc: "We offer one of the lowest rates in Nigeria for all networks.",
              icon: "💸",
            },
            {
              title: "24/7 Support",
              desc: "Got issues? We’re available round the clock to assist you.",
              icon: "🎧",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="border border-gray-800 rounded-2xl p-6 text-center hover:border-emerald-400 transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0a0f1f] px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Join Loyatee Today</h2>
          <p className="text-gray-400 mb-6">
            Experience seamless data purchases with our user-friendly dashboard
            and secure payments.
          </p>
          <a
            href="/signup"
            className="inline-block bg-[#19e586] text-black px-8 py-3 rounded-full text-lg font-semibold shadow hover:scale-105 transition-transform"
          >
            Create Account
          </a>
        </div>
      </section>
    </main>
  );
}
