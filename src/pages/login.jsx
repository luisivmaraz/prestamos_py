import React, { useState } from 'react';
import { Card, Input, Heading, CardBody, Button, CardFooter, Image, Text, Box, FormControl, FormLabel } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('https://api-linux-prestamos-b4vl.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
  
      if (!response.ok) {
        throw new Error('Credenciales incorrectas.');
      }
  
      if (data.token) {
        localStorage.setItem('token', data.token); // Guardar token
        navigate('/Dashboard'); // Redirigir al Dashboard
      } else {
        throw new Error('Token inválido.');
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };
  

  return (
    <Box backgroundColor="teal.500" minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
      <Card width="30%" align="center" variant='elevated'>
        <CardBody>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Image borderRadius='full' boxSize='50px' src='https://cdn-icons-png.freepik.com/512/178/178398.png' />
          </Box>
          <br />
          <Heading size='md' align="center">Prestamos Universitarios</Heading>
          <br />
          <Text color='teal' fontSize='m' align="center">Ingresa tus datos de sesión</Text>
          <br />
          {error && <Text color="red.500" fontSize="sm" align="center">{error}</Text>}
          <FormControl isRequired>
            <FormLabel>Correo electrónico</FormLabel>
            <Input
              variant='filled'
              type='email'
              placeholder='hola@ut.edu.mx'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormLabel>Contraseña</FormLabel>
            <Input
              variant='filled'
              type='password'
              placeholder='******'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </CardBody>
        <CardFooter>
          <Button
            rightIcon={<ArrowForwardIcon />}
            colorScheme='teal'
            variant='solid'
            marginBottom={10}
            onClick={handleLogin}
          >
            Iniciar sesión
          </Button>
        </CardFooter>
      </Card>
    </Box>
  );
};

export default Login;