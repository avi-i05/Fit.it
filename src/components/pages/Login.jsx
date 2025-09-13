import { useNavigate } from "react-router-dom";

const Login = ({setIsAuthenticated}) => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
    navigate("/home"); 
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-centre" style={{backgroundImage : "url('/download.jpeg')"}}>
   
      <div className="bg-white/80 backdrop:blur-md shadow-xl rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-bold text-purple-500 mb-6 text-center">Welcome Back to Fit.It</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full border p-3 rounded" required />
          <input type="password" placeholder="Password" className="w-full border p-3 rounded" required />
          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
            Login
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Don’t have an account? <a href="/signup" className="text-purple-600 font-medium">Sign Up</a>
        </p>
      </div>
      </div>
    
  );
};

export default Login;
