import { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for backend register API
    toast.success("Registration successful!");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4 text-center">Register</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="flex items-center border rounded p-2">
          <FaUser className="mr-2" />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full outline-none"
          />
        </div>
        <div className="flex items-center border rounded p-2">
          <FaEnvelope className="mr-2" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full outline-none"
          />
        </div>
        <div className="flex items-center border rounded p-2">
          <FaLock className="mr-2" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;