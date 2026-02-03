const AboutPage = () => {
  return (
    <div className="min-w-full text-center px-4 py-12 sm:py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">About This Project</h1>
        <p className="mb-6 text-base sm:text-lg">
          Thank you for exploring my project! This is a full-stack e-commerce web application built to demonstrate modern web development skills and best practices.
        </p>

        <h2 className="text-2xl sm:text-3xl font-semibold mt-8 mb-2">Frontend</h2>
        <p className="mb-4 text-base sm:text-lg">
          Built with Vite, React, and TypeScript. Redux Toolkit handles state management, while Redux Thunk manages asynchronous API requests.
        </p>

        <h2 className="text-2xl sm:text-3xl font-semibold mt-8 mb-2">Backend</h2>
        <p className="mb-4 text-base sm:text-lg">
          Node.js, TypeScript, and Express power the backend. Secure authentication uses encrypted passwords and JWTs stored in cookies for authorization.
        </p>

        <h2 className="text-2xl sm:text-3xl font-semibold mt-8 mb-2">Database & Caching</h2>
        <p className="mb-4 text-base sm:text-lg">
          PostgreSQL manages users, inventory, carts, orders, and payments inside Docker containers. Redis caches frequently accessed user data for improved performance.
        </p>

        <h2 className="text-2xl sm:text-3xl font-semibold mt-8 mb-2">Admin Features</h2>
        <p className="mb-4 text-base sm:text-lg">
          Admin dashboard allows managing users and inventory, tracking revenue and profits. Only authorized admins can access these features.
        </p>

        <h2 className="text-2xl sm:text-3xl font-semibold mt-8 mb-2">PDF Receipts</h2>
        <p className="mb-4 text-base sm:text-lg">
          Customers receive PDF receipts for their purchases, which can be downloaded directly from the frontend. This feature is powered by the backend API for secure generation and retrieval.
        </p>

        <h2 className="text-2xl sm:text-3xl font-semibold mt-8 mb-2">Documentation</h2>
        <p className="mb-4 text-base sm:text-lg">
          All API endpoints are fully documented using Swagger UI, making exploration and testing easy.
        </p>

        <h2 className="text-3xl sm:text-4xl font-bold mt-12 mb-4">Let's Connect!</h2>
        <p className="text-base sm:text-lg">
          If you’ve made it this far, I’d love to discuss how I can contribute to your team or project!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
