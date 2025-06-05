import { useState } from 'preact/hooks';
import { Login } from './login';
import { Register } from './register';

export const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);
    
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {isLogin ? (
        <Login onSwitchToSignup={() => setIsLogin(false)} />
      ) : (
        <Register onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};
