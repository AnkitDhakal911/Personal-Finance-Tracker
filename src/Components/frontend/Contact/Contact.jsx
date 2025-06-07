export default function Contact() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Contact Us</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="input mt-1"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input mt-1"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              required
              className="input mt-1"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full btn btn-primary"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
} 