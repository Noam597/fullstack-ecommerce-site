import { FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 flex items-center justify-center space-x-4">
      <p>&copy; {new Date().getFullYear()} My Project</p>
      <a
        href="https://github.com/Noam597"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-gray-400 transition-colors duration-300"
        aria-label="GitHub"
      >
        <FaGithub size={24} data-testid="github-icon"/>
      </a>
    </footer>
  );
};

export default Footer;
