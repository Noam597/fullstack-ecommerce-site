const LandingPage = () => {
  return (
    <div className="relative h-screen w-full">
      {/* Background image */}
      <img
        src="https://plus.unsplash.com/premium_photo-1681426664478-b039637f29f1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Technology background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Black overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Centered title */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 text-center">
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold opacity-0 animate-fade-drop leading-tight">
          Welcome to My Fullstack E-commerce Project
        </h1>
      </div>

      {/* Tailwind keyframes for animation */}
      <style>
        {`
          @keyframes fadeDrop {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-drop {
            animation: fadeDrop 1.5s ease forwards;
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;
