import { useState } from 'react';
import AddNewAccount from './AddNewAccount';
import AddNewItem from './AddNewItem';

const AddingPage = () => {
  const [addAccount, setAddAccount] = useState<boolean>(false);

  const activeClasses = 'bg-blue-600 text-white shadow-lg';
  const inactiveClasses = 'bg-gray-200 text-gray-700 hover:bg-gray-300';

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-white">Add New</h1>

      {/* Toggle Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => setAddAccount(false)}
          className={`px-6 py-2 rounded-lg font-medium transition ${!addAccount ? activeClasses : inactiveClasses}`}
        >
          Add New Item
        </button>
        <button
          onClick={() => setAddAccount(true)}
          className={`px-6 py-2 rounded-lg font-medium transition ${addAccount ? activeClasses : inactiveClasses}`}
        >
          Add New Account
        </button>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md bg-gray-700 p-6 md:p-8 rounded-lg shadow-md">
        {!addAccount ? <AddNewItem /> : <AddNewAccount />}
      </div>
    </div>
  );
};

export default AddingPage;
