import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'Criar Conta | EventHub';
    return () => {
      document.title = 'EventHub';
    };
  }, []);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      
      if (!user) {
        setErrors({ email: 'Este email já está em uso' });
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrors({ general: 'Erro ao criar conta' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Criar Conta</h1>
          <p className="text-gray-600 mt-1">
            Crie sua conta para começar a organizar eventos
          </p>
        </div>
        
        {errors.general && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Nome Completo"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Seu nome completo"
            error={errors.name}
          />
          
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            error={errors.email}
          />
          
          <Input
            label="Telefone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(11) 99999-9999"
            error={errors.phone}
          />
          
          <Input
            label="Senha"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            error={errors.password}
          />
          
          <Input
            label="Confirmar Senha"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirme sua senha"
            error={errors.confirmPassword}
          />
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="mt-2"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;