import React, { useState } from 'react'; 
import {
  Box, Button, Heading, Table, Thead, Tbody, Tr, Th, Td, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, Select, ModalFooter, useDisclosure
} from '@chakra-ui/react';
import { BiSolidChevronLeft, BiSolidUserPlus, BiSolidUserX, BiSolidPencil } from "react-icons/bi";

  {/* aqui van kos hooks y datos de ejemplo para la tabla */}
const Usuarios = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: 'Juan', apellido: 'Pérez', tipo: 'Admin', correo: 'juan@example.com', telefono: '1234567890', estatus: 'Activo', registro: '2023-01-01', actualizacion: '2023-06-01' },
    { id: 2, nombre: 'Ana', apellido: 'Gómez', tipo: 'Usuario', correo: 'ana@example.com', telefono: '0987654321', estatus: 'Inactivo', registro: '2023-02-01', actualizacion: '2023-07-01' }
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    nombre: '',
    apellido: '',
    tipo: '',
    correo: '',
    telefono: '',
    estatus: ''
  });

  const handleEdit = (user) => {
    setSelectedUser(user);
    onEditOpen();
  };

  const handleSaveEdit = () => {
    setUsuarios(usuarios.map(user => user.id === selectedUser.id ? selectedUser : user));
    onEditClose();
  };

  const handleSaveNewUser = () => {
    setUsuarios([
      ...usuarios,
      { id: usuarios.length + 1, ...newUser, registro: new Date().toISOString().split('T')[0], actualizacion: new Date().toISOString().split('T')[0] }
    ]);
    onClose(); 
    setNewUser({ nombre: '', apellido: '', tipo: '', correo: '', telefono: '', estatus: '' }); // Limpiar formulario
  };

  return (
    <Box backgroundColor="teal.600" minHeight="100vh" p={5} display="flex" flexDirection="column" alignItems="center">
      <Heading color="white" textAlign="center" mb={8} fontSize="3xl">Gestión de Usuarios</Heading>
      <Box bg="white" p={6} borderRadius="lg" boxShadow="xl" width="80%">
        <Button leftIcon={<BiSolidUserPlus />} colorScheme="teal" mb={4} onClick={onOpen}>
          Agregar Usuario
        </Button>
        <Button marginLeft={10} leftIcon={<BiSolidChevronLeft />} colorScheme="teal" mb={4}>
          Dashboard
        </Button>

          {/* se utilioza usuraiors para agregar los datos de manea oiteratva, "Usuario, setUsuario" */}
        <Table variant="striped" colorScheme='teal' size='sm'>
          <Thead>
            <Tr>
              <Th>ID</Th>
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
                <Td>{user.id}</Td>
                <Td>{user.nombre}</Td>
                <Td>{user.apellido}</Td>
                <Td>{user.tipo}</Td>
                <Td>{user.correo}</Td>
                <Td>{user.telefono}</Td>
                <Td>{user.estatus}</Td>
                <Td>{user.registro}</Td>
                <Td>{user.actualizacion}</Td>
                <Td>
                  <IconButton icon={<BiSolidPencil />} size='sm' colorScheme="blue" variant='ghost' mr={2} onClick={() => handleEdit(user)} />
                  <IconButton icon={<BiSolidUserX />} size='sm' colorScheme="red" variant='ghost' />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

        {/* moadl de agrwgar usuario */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Usuario</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Nombre</FormLabel>
              <Input value={newUser.nombre} onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Apellido</FormLabel>
              <Input value={newUser.apellido} onChange={(e) => setNewUser({ ...newUser, apellido: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Tipo de Usuario</FormLabel>
              <Select value={newUser.tipo} onChange={(e) => setNewUser({ ...newUser, tipo: e.target.value })}>
                <option>Admin</option>
                <option>Usuario</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Correo</FormLabel>
              <Input type="email" value={newUser.correo} onChange={(e) => setNewUser({ ...newUser, correo: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Contraseña</FormLabel>
              <Input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Teléfono</FormLabel>
              <Input value={newUser.telefono} onChange={(e) => setNewUser({ ...newUser, telefono: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Estatus</FormLabel>
              <Select value={newUser.estatus} onChange={(e) => setNewUser({ ...newUser, estatus: e.target.value })}>
                <option>Activo</option>
                <option>Inactivo</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSaveNewUser}>Guardar</Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

        {/* modal de editar usuaeio */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Usuario</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Nombre</FormLabel>
              <Input value={selectedUser?.nombre || ''} onChange={(e) => setSelectedUser({ ...selectedUser, nombre: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Apellido</FormLabel>
              <Input value={selectedUser?.apellido || ''} onChange={(e) => setSelectedUser({ ...selectedUser, apellido: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Tipo de Usuario</FormLabel>
              <Select value={selectedUser?.tipo || ''} onChange={(e) => setSelectedUser({ ...selectedUser, tipo: e.target.value })}>
                <option>Admin</option>
                <option>Usuario</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Correo</FormLabel>
              <Input type="email" value={selectedUser?.correo || ''} onChange={(e) => setSelectedUser({ ...selectedUser, correo: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Teléfono</FormLabel>
              <Input value={selectedUser?.telefono || ''} onChange={(e) => setSelectedUser({ ...selectedUser, telefono: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Estatus</FormLabel>
              <Select value={selectedUser?.estatus || ''} onChange={(e) => setSelectedUser({ ...selectedUser, estatus: e.target.value })}>
                <option>Activo</option>
                <option>Inactivo</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSaveEdit}>Guardar</Button>
            <Button onClick={onEditClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Usuarios;
