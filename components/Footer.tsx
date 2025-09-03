import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900/50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link
              href="#"
              className="text-[#a0aec0] hover:text-[#19e586] transition-colors duration-300"
            >
              FAQs
            </Link>
            <Link
              href="#"
              className="text-[#a0aec0] hover:text-[#19e586] transition-colors duration-300"
            >
              Contact Us
            </Link>
            <Link
              href="#"
              className="text-[#a0aec0] hover:text-[#19e586] transition-colors duration-300"
            >
              X
            </Link>
            <Link
              href="#"
              className="text-[#a0aec0] hover:text-[#19e586] transition-colors duration-300"
            >
              Email
            </Link>
          </div>
          <p className="text-[#a0aec0] text-sm">
            © {new Date().getFullYear()} Yata. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
