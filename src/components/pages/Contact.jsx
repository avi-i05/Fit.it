export default function Contact() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>

      {/* Contact Info Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-4">
            We'd love to hear from you! Whether you have a question about products,
            orders, or anything else — our team is ready to answer.
          </p>
          <p><strong>Email:</strong> support@yourstore.com</p>
          <p><strong>Phone:</strong> +91 9505434560</p>
          <p><strong>Address:</strong> Bareilly, India</p>
        </div>

        {/* Feedback Form */}
        <form className="bg-white shadow-lg rounded-lg p-6 space-y-4">
          <div>
            <label className="block mb-2 font-semibold">Name</label>
            <input type="text" placeholder="Your Name"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:border-emerald-600" />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Email</label>
            <input type="email" placeholder="Your Email"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:border-emerald-600" />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Message</label>
            <textarea placeholder="Write your message..."
              rows="4"
              className="w-full border rounded px-4 py-2 focus:outline-none focus:border-emerald-600"></textarea>
          </div>

          <button type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
