import React, { useState, useEffect } from 'react';
import {
  Box, Button, Heading, Table, Thead, Tbody, Tr, Th, Td, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, Select, ModalFooter, useDisclosure
} from '@chakra-ui/react';
import { BiSolidChevronLeft, BiSolidUserPlus, BiSolidUserX, BiSolidPencil } from "react-icons/bi";
import { Link } from 'react-router-dom';

const Usuarios = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const [usuarios, setUsuarios] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    last_name: '',
    type_user: '',
    user_name: '',
    email: '',
    password: '',
    phone_number: '',
    status: 'Activo' // Valor predeterminado
  });

  const [selectedUser, setSelectedUser] = useState(null);

  // Cargar usuarios desde la API
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error al hacer la solicitud:', error);
      }
    };
    fetchUsuarios();
  }, []);

  // Guardar un nuevo usuario
  const handleSaveNewUser = async () => {
    // Validación para asegurarse de que todos los campos estén completos
    console.log('Formulario:', newUser);

    if (!newUser.name || !newUser.last_name || !newUser.type_user || !newUser.user_name || !newUser.email || !newUser.password || !newUser.phone_number || !newUser.status) {
      console.error('Todos los campos son requeridos');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newUser),
      });

      // Verificar que la respuesta sea exitosa
      if (response.ok) {
        const addedUser = await response.json();
        setUsuarios([...usuarios, addedUser]);
        onClose();
        setNewUser({
          name: '',
          last_name: '',
          type_user: '',
          user_name: '',
          email: '',
          password: '',
          phone_number: '',
          status: 'Active'
        });
      } else {
        const errorData = await response.json();
        console.error('Error al agregar usuario:', errorData);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  // Editar un usuario
  const handleSaveEdit = async () => {
    try {
      if (!selectedUser?.id) {
        console.error("El usuario seleccionado no tiene un ID válido.");
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/user/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(selectedUser),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsuarios(usuarios.map(user => user.id === updatedUser.id ? updatedUser : user));
        onEditClose();
      } else {
        const errorData = await response.json();
        console.error('Error al editar usuario:', errorData.detail || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error.message);
    }
  };


  const handleDeleteUser = async (id) => {
    const response = await fetch(`http://127.0.0.1:8000/user/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      setUsuarios(usuarios.filter(user => user.id !== id));
    } else {
      console.error('Error al eliminar usuario');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    onEditOpen();
  };

  return (
    <Box backgroundColor="orange.400" minHeight="100vh" p={5} display="flex" flexDirection="column" alignItems="center">
      <Heading color="white" textAlign="center" mb={8} fontSize="3xl">Gestión de Usuarios</Heading>
      <Box bg="white" p={6} borderRadius="lg" boxShadow="xl" >
        <Button leftIcon={<BiSolidUserPlus />} colorScheme="green" mb={4} onClick={onOpen}>
          Agregar Usuario
        </Button>
        <Link to="/Dashboard">
          <Button marginLeft={10} leftIcon={<BiSolidChevronLeft />} colorScheme="blue" mb={4}>
            Dashboard
          </Button>
        </Link>

        <Table variant="striped" colorScheme='blue' size='sm'>
          <Thead>
            <Tr>
              <Th>Nombre</Th>
              <Th>Apellido</Th>
              <Th>Tipo</Th>
              <Th>Correo</Th>
              <Th>Teléfono</Th>
              <Th>Estatus</Th>
              <Th>Registro</Th>
              <Th>Actualización</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {usuarios.map(user => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.last_name}</Td>
                <Td>{user.type_user}</Td>
                <Td>{user.email}</Td>
                <Td>{user.phone_number}</Td>
                <Td>{user.status}</Td>
                <Td>{user.registration_date}</Td>
                <Td>{user.update_date}</Td>
                <Td>
                  <IconButton icon={<BiSolidPencil />} size='sm' colorScheme="blue" variant='ghost' mr={2} onClick={() => handleEdit(user)} />
                  <IconButton icon={<BiSolidUserX />} size='sm' colorScheme="red" variant='ghost' onClick={() => handleDeleteUser(user.id)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal para agregar usuario */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Usuario</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Nombre</FormLabel>
              <Input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Apellido</FormLabel>
              <Input value={newUser.last_name} onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Tipo de Usuario</FormLabel>
              <Select value={newUser.type_user} onChange={(e) => setNewUser({ ...newUser, type_user: e.target.value })}>
                <option>Teacher</option>
                <option>Secretary</option>
                <option>Student</option>
                <option>Laboratory</option>
                <option>Executive</option>
                <option>Administrative</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Nombre de Usuario</FormLabel>
              <Input value={newUser.user_name} onChange={(e) => setNewUser({ ...newUser, user_name: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Correo</FormLabel>
              <Input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Contraseña</FormLabel>
              <Input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Teléfono</FormLabel>
              <Input value={newUser.phone_number} onChange={(e) => setNewUser({ ...newUser, phone_number: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Estatus</FormLabel>
              <Select value={newUser.status} onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSaveNewUser}>Guardar</Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para editar usuario */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Usuario</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Nombre</FormLabel>
              <Input value={selectedUser?.name || ''} onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Apellido</FormLabel>
              <Input value={selectedUser?.last_name || ''} onChange={(e) => setSelectedUser({ ...selectedUser, last_name: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Tipo de Usuario</FormLabel>
              <Select value={selectedUser?.type_user || ''} onChange={(e) => setSelectedUser({ ...selectedUser, type_user: e.target.value })}>
                <option>Teacher</option>
                <option>Secretary</option>
                <option>Student</option>
                <option>Laboratory</option>
                <option>Executive</option>
                <option>Administrative</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Nombre de Usuario</FormLabel>
              <Input value={selectedUser?.user_name || ''} onChange={(e) => setSelectedUser({ ...selectedUser, user_name: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Correo</FormLabel>
              <Input value={selectedUser?.email || ''} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Teléfono</FormLabel>
              <Input value={selectedUser?.phone_number || ''} onChange={(e) => setSelectedUser({ ...selectedUser, phone_number: e.target.value })} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveEdit}>Guardar</Button>
            <Button onClick={onEditClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Usuarios;
