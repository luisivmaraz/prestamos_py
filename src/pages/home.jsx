import React from 'react';
import { Box, Button, Heading, VStack, HStack, Container, Icon } from '@chakra-ui/react';
import { BiSolidUser, BiSolidDonateBlood, BiSolidCube } from 'react-icons/bi';
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();  

  const handleLogout = () => {
    localStorage.removeItem('token');   
    navigate('/');  
  };

  return (
    <Box backgroundColor="orange.400" minHeight="100vh" p={5} display="flex" flexDirection="column" alignItems="center">
      <Heading color="white" textAlign="center" mb={8} fontSize="3xl">Préstamos Universitarios</Heading>
      <Container maxW="container.md" bg="white" p={8} borderRadius="lg" boxShadow="xl">
        <VStack spacing={6} align="center">
          <HStack spacing={6} justify="center">
            <Link to="/Usuarios">
              <Button leftIcon={<Icon as={BiSolidUser} />} colorScheme="blue" size="lg" width="220px" borderRadius="full" boxShadow="md" _hover={{ transform: 'scale(1.05)' }}>
                Usuarios
              </Button>
            </Link>
            <Link to="/prestamos">
              <Button leftIcon={<Icon as={BiSolidDonateBlood} />} colorScheme="green" size="lg" width="220px" borderRadius="full" boxShadow="md" _hover={{ transform: 'scale(1.05)' }}>
                Préstamos
              </Button>
            </Link>
            <Link to="/materiales">
              <Button leftIcon={<Icon as={BiSolidCube} />} colorScheme="red" size="lg" width="220px" borderRadius="full" boxShadow="md" _hover={{ transform: 'scale(1.05)' }}>
                Materiales
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Container>
      <Container position="fixed" bottom="0" left="0" width="100%" justifyContent="flex-end" p={4} bg="transparent">
        <Button
          leftIcon={<Icon as={IoMdArrowRoundBack} />}
          colorScheme="black"
          variant="outline"
          size="lg"
          width="130px"
          borderRadius="full"
          boxShadow="md"
          _hover={{ transform: 'scale(1.05)' }}
          onClick={handleLogout}  
        >
          Salir
        </Button>
      </Container>
    </Box>
  );
};

export default Dashboard;
