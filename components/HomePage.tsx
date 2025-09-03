"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import HeroImage from "@/public/illustrations/hero_image.png";
import { YataLogoMinimal } from "./logo/LogoOptions";

// Define DataPlan type (adjust based on your actual type)
interface DataPlan {
  dataplan_id: string;
  plan_network: string;
  plan_type: string;
  plan_amount: string;
  final_price: number;
  [key: string]: any;
}

// Props for HomePage
interface HomePageProps {
  plans: DataPlan[];
  error: string | null;
}

// SVG icons for features and trust badges
const LockIcon = () => (
  <svg
    className="w-10 h-10 mx-auto"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 11V9a4 4 0 00-4-4H8a4 4 0 00-4 4v2m0 0v6a2 2 0 002 2h12a2 2 0 002-2v-6m-16 0h16"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="w-10 h-10 mx-auto"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const MoneyIcon = () => (
  <svg
    className="w-10 h-10 mx-auto"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// Fallback SVG for Hero illustration
const HeroIllustration = () => (
  <svg
    className="w-full max-w-[300px] mx-auto"
    viewBox="0 0 200 300"
    fill="none"
  >
    <rect x="40" y="20" width="120" height="260" rx="20" fill="#2d3748" />
    <circle cx="100" cy="50" r="15" fill="#19e586" />
    <circle cx="80" cy="80" r="10" fill="#ffffff" opacity="0.5" />
    <circle cx="120" cy="80" r="10" fill="#ffffff" opacity="0.5" />
    <path d="M60 120 h80 v120 h-80 Z" fill="#19e586" fillOpacity="0.2" />
    <animateTransform
      attributeName="transform"
      type="scale"
      from="1"
      to="1.05"
      dur="2s"
      repeatCount="indefinite"
      values="1;1.05;1"
      keyTimes="0;0.5;1"
    />
  </svg>
);

export default function HomePage({ plans, error }: HomePageProps) {
  // State for quick-buy form
  const [network, setNetwork] = useState("");
  const [dataPlan, setDataPlan] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <main className="min-h-screen bg-[#0d1117] text-white font-manrope">
      {/* Hero Section: Enhanced with quick-buy form, stats, and fallback SVG illustration */}
      {/* Hero Section */}
      <section className="relative wavy-gradient px-4 py-20 md:py-28 text-center overflow-hidden">
        {/* Background Image */}
        {HeroImage && (
          <div className="absolute inset-0">
            <Image
              src={HeroImage}
              alt="Mobile phone with Nigerian network logos (MTN, Glo, Airtel, 9mobile)"
              fill
              className="object-cover object-right opacity-25"
              priority
            />
            {/* Overlay to improve contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117]/90 via-[#0d1117]/80 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Text + CTA */}
          <div className="text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight animate-fade-in">
              Buy Cheap Mobile Data Instantly
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-8">
              Get affordable MTN, Glo, Airtel, and 9mobile plans with instant
              delivery across Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto md:mx-0">
              <Link
                href="/dashboard/buy-data"
                className="w-full sm:w-auto bg-[#19e586] text-black px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-[var(--button-primary-hover)] hover:scale-105 transition-all duration-300 text-center"
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative z-10 mt-16 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 gap-y-8 text-center animate-fade-in">
          <div>
            <p className="text-2xl font-bold">10,000+</p>
            <p className="text-gray-400">Happy Users</p>
          </div>
          <div>
            <p className="text-2xl font-bold">99%</p>
            <p className="text-gray-400">Instant Delivery</p>
          </div>
          <div>
            <p className="text-2xl font-bold">24/7</p>
            <p className="text-gray-400">Support</p>
          </div>
          <div>
            <p className="text-2xl font-bold">4.8/5</p>
            <p className="text-gray-400">User Rating</p>
          </div>
        </div>
      </section>

      {/* Features Section: Expanded with more cards, SVG icons, and micro-animations */}
      <section className="px-4 py-16 bg-[#0d1117]">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            Why Choose{" "}
            <span>
              <YataLogoMinimal className="inline-block h-[1.6em] w-auto align-baseline -mb-3 -mr-2" />
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Enjoy fast, secure, and affordable mobile data with unmatched
            support.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {[
            {
              title: "Instant Delivery",
              desc: "Data delivered in seconds, even during peak hours.",
              icon: <ClockIcon />,
            },
            {
              title: "Affordable Pricing",
              desc: "Lowest rates for MTN, Glo, Airtel, and 9mobile.",
              icon: <MoneyIcon />,
            },
            {
              title: "Secure Transactions",
              desc: "Protected by SSL encryption for safe payments.",
              icon: <LockIcon />,
            },
            {
              title: "24/7 Support",
              desc: "Round-the-clock assistance for all your needs.",
              icon: <ClockIcon />,
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="border border-gray-800 rounded-2xl p-6 text-center hover:border-[#19e586] hover:shadow-emerald transition-all duration-300"
              role="region"
              aria-label={feature.title}
            >
              <div className="text-[#19e586] mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section: New, with timeline and animations */}
      <section className="px-4 py-16 bg-[var(--navy-blue)]">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get your data in just a few simple steps.
          </p>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div
            className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#19e586] hidden md:block"
            aria-hidden="true"
          ></div>
          {[
            {
              step: "Sign Up",
              desc: "Create a free account in seconds.",
              icon: "✍️",
            },
            {
              step: "Select Plan",
              desc: "Choose your network and data amount.",
              icon: "📱",
            },
            {
              step: "Pay Securely",
              desc: "Use our secure payment gateway.",
              icon: "💳",
            },
            {
              step: "Instant Top-Up",
              desc: "Get your data delivered instantly.",
              icon: "⚡",
            },
          ].map((step, i) => (
            <div
              key={i}
              className={`mb-8 flex items-center ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } animate-fade-in`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div className="w-full md:w-1/2 p-4">
                <div className="bg-[var(--card-solid-bg)] rounded-lg p-6">
                  <div className="text-3xl mb-2">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.step}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </div>
              </div>
              <div className="hidden md:block w-1/2"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Teaser Section: Dynamic plans from props */}
      <section className="px-4 py-16 bg-[#0d1117]">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            Popular Data Plans
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Affordable plans for all networks, starting at just ₦
            {plans[0]?.final_price || 200}.
          </p>
        </div>
        {error ? (
          <p className="text-center text-red-400">
            Error loading plans: {error}
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {plans.slice(0, 3).map((plan) => (
              <div
                key={plan.dataplan_id}
                className="border border-gray-800 rounded-2xl p-6 text-center hover:border-[#19e586] hover:shadow-emerald transition-all duration-300"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {plan.plan_network}
                </h3>
                <p className="text-2xl font-bold text-[#19e586]">
                  {plan.plan_amount}
                </p>
                <p className="text-gray-400 mb-2">₦{plan.final_price}</p>
                <p className="text-gray-400 mb-4">{plan.plan_type}</p>
                <Link
                  href="/dashboard/buy-data"
                  className="inline-block bg-[#19e586] text-black px-6 py-2 rounded-full font-semibold hover:bg-[var(--button-primary-hover)] hover:scale-105 transition-all duration-300"
                >
                  Buy Now
                </Link>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Link
            href="/buy-data"
            className="text-[#19e586] font-semibold hover:underline"
          >
            View All Plans
          </Link>
        </div>
      </section>

      {/* Testimonials Section: New, with simple grid for social proof */}
      <section className="px-4 py-16 bg-[var(--navy-blue)]">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            What Our Users Say
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied customers enjoying seamless data
            purchases.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              name: "Chidi O.",
              quote:
                "Fastest data top-up I've ever used! Got my MTN 1GB in seconds.",
              avatar: "/avatar1.jpg",
            },
            {
              name: "Aisha M.",
              quote:
                "Super affordable and reliable. Customer support was amazing!",
              avatar: "/avatar2.jpg",
            },
            {
              name: "Tunde K.",
              quote:
                "The quick-buy form is so easy to use. Highly recommend Yata!",
              avatar: "/avatar3.jpg",
            },
          ].map((testimonial, i) => (
            <div
              key={i}
              className="bg-[var(--card-solid-bg)] rounded-2xl p-6 text-center testimonial-card"
            >
              <Image
                src={testimonial.avatar}
                alt={`${testimonial.name}'s avatar`}
                width={60}
                height={60}
                className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                loading="lazy"
              />
              <p className="text-gray-400 mb-4 italic">"{testimonial.quote}"</p>
              <p className="font-semibold">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Security Section: New, with badges for credibility */}
      <section className="px-4 py-16 bg-[#0d1117]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            Shop with Confidence
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Your trust is our priority with industry-leading security and
            support.
          </p>
          <div className="grid gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
            {[
              {
                title: "SSL Secure",
                icon: <LockIcon />,
                desc: "Encrypted transactions",
              },
              {
                title: "24/7 Support",
                icon: <ClockIcon />,
                desc: "Always here to help",
              },
              {
                title: "Money-Back Guarantee",
                icon: <MoneyIcon />,
                desc: "Risk-free purchases",
              },
            ].map((badge, i) => (
              <div
                key={i}
                className="p-6 hover:shadow-emerald transition-all duration-300"
                role="region"
                aria-label={badge.title}
              >
                <div className="text-[#19e586] mb-4">{badge.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{badge.title}</h3>
                <p className="text-gray-400">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog/FAQ Teaser Section: New, to drive engagement */}
      <section className="px-4 py-16 bg-[var(--navy-blue)]">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            Learn More
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore tips and answers to make the most of your data.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              title: "Tips to Save Data",
              href: "/blog/save-data",
              desc: "Maximize your data usage with these tricks.",
            },
            {
              title: "Which Network is Best?",
              href: "/blog/network-guide",
              desc: "Compare MTN, Glo, Airtel, and 9mobile.",
            },
            {
              title: "FAQs",
              href: "/faq",
              desc: "Answers to common questions about Yata.",
            },
          ].map((article, i) => (
            <div
              key={i}
              className="border border-gray-800 rounded-2xl p-6 hover:border-[#19e586] hover:shadow-emerald transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
              <p className="text-gray-400 mb-4">{article.desc}</p>
              <Link
                href={article.href}
                className="text-[#19e586] font-semibold hover:underline"
              >
                Read More
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section: Enhanced with newsletter signup */}
      <section className="bg-[var(--dark-navy)] px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            Join Yata Today
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Sign up for exclusive offers and seamless data purchases with our
            user-friendly platform.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            aria-label="Newsletter signup"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 p-3 rounded-lg bg-[var(--input-bg-dark)] text-white border border-[var(--border-color)] focus:border-[#19e586] focus:outline-none transition-colors"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="bg-[#19e586] text-black px-6 py-3 rounded-full font-semibold hover:bg-[var(--button-primary-hover)] hover:scale-105 transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
          <Link
            href="/signup"
            className="inline-block mt-6 bg-[#19e586] text-black px-8 py-3 rounded-full text-lg font-semibold shadow hover:bg-[var(--button-primary-hover)] hover:scale-105 transition-all duration-300"
          >
            Create Account
          </Link>
        </div>
      </section>
    </main>
  );
}
