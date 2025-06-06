import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'Login | EventHub';
    return () => {
      document.title = 'EventHub';
    };
  }, []);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    setLoading(true);
    
    try {
      const user = await login(email, password);
      
      if (!user) {
        setError('Email ou senha inválidos');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
            <LogIn size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Entrar</h1>
          <p className="text-gray-600 mt-1">
            Acesse sua conta para gerenciar seus eventos
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
          
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
          />
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="mt-2"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;