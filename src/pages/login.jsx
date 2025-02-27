import React from 'react';
import { Card,Input,Heading, CardBody,Button,CardFooter, Image,Text, Box, FormControl, FormLabel} from '@chakra-ui/react';
import {ArrowForwardIcon} from '@chakra-ui/icons'
const Login = () => {
  return (
    <Box backgroundColor="teal.500" minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
    <Card width="30%" align="center"  variant='elevated'>
      <CardBody>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Image borderRadius='full' boxSize='50px' src='https://cdn-icons-png.freepik.com/512/178/178398.png'/>
        </Box> <br/>
        <Heading size='md' align="center">Prestamos Universitarios</Heading> <br/>
        <Text color='teal' fontSize='m' align="center" >Ingresa tus datos de sesion</Text> <br/>
        <FormControl isRequired>
          <FormLabel>Correo electronico</FormLabel>
          <Input variant='filled' type='email' placeholder='hola@ut.edu.mx' />
          <FormLabel>Contraseña</FormLabel>
          <Input variant='filled' type='password' placeholder='******' />
        </FormControl>
      </CardBody>
      <CardFooter>
      <Button rightIcon={<ArrowForwardIcon />} colorScheme='teal' variant='solid' marginBottom={10}>
        Iniciar sesion
      </Button>
      </CardFooter>
    </Card>
    </Box>
  );
};

export default Login;
