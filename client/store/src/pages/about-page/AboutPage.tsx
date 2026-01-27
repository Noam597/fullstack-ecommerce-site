
const AboutPage = () => {
  return (
    <div className="min-w-full text-center px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">About This Project</h1>
        <p className="mb-4">
          Thank you for taking the time to explore my project! This is a full-stack e-commerce web application designed to demonstrate my skills and knowledge in modern web development.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">Frontend</h2>
        <p className="mb-4">
          The frontend is built using Vite, React, and TypeScript, with Redux Toolkit for state management and Redux Thunk for handling asynchronous API requests.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">Backend</h2>
        <p className="mb-4">
          The backend is implemented using Node.js, TypeScript, and Express. It includes secure authentication with password encryption and JSON Web Tokens, stored in cookies for enhanced security and authorization.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">Database & Caching</h2>
        <p className="mb-4">
          I used Docker containers to run PostgreSQL for managing users, inventory, shopping carts, orders, and payment logs. Redis is used to cache frequently accessed user data, improving performance.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">Admin Features</h2>
        <p className="mb-4">
          The project also includes an admin dashboard for managing users and inventory, as well as tracking revenue and profits. Backend security ensures that only authorized admins can access these features.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">Documentation</h2>
        <p className="mb-4">
          All API endpoints are documented with a fully functional Swagger UI for easy exploration and testing.
        </p>
        <h2 className="text-3xl font-bold mt-8">Let's Connect!</h2>
        <p>
          If you’ve made it this far, I’d love to discuss how I can contribute to your team or project!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
