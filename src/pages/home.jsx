import React from 'react';
import { Box, Button, Heading, VStack, HStack, Container, Icon } from '@chakra-ui/react';
import { BiSolidUser,BiSolidDonateBlood,BiSolidCube    } from 'react-icons/bi';
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <Box backgroundColor="teal.600" minHeight="100vh" p={5} display="flex" flexDirection="column" alignItems="center">
      <Heading color="white" textAlign="center" mb={8} fontSize="3xl">Préstamos Universitarios</Heading>
      <Container maxW="container.md" bg="white" p={8} borderRadius="lg" boxShadow="xl">
        <VStack spacing={6} align="center">
          <HStack spacing={6} justify="center">
            <Link to="/Usuarios"> 
              <Button leftIcon={<Icon as={BiSolidUser} />} colorScheme="teal" size="lg" width="220px" borderRadius="full" boxShadow="md" _hover={{ transform: 'scale(1.05)' }}>
               Usuarios
             </Button>
            </Link>
            <Link to="/prestamos"> 
              <Button leftIcon={<Icon as={BiSolidDonateBlood } />} colorScheme="teal" size="lg" width="220px" borderRadius="full" boxShadow="md" _hover={{ transform: 'scale(1.05)' }}>
                Préstamos
              </Button>
              </Link>
            <Link to="/materiales"> 
              <Button leftIcon={<Icon as={BiSolidCube } />} colorScheme="teal" size="lg" width="220px" borderRadius="full" boxShadow="md" _hover={{ transform: 'scale(1.05)' }}>
                Materiales
              </Button>
              </Link>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard;