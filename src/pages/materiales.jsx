import React, { useState } from 'react'; 
import {
  Box, Button, Heading, Table, Thead, Tbody, Tr, Th, Td, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, Select, ModalFooter, useDisclosure
} from '@chakra-ui/react';
import { BiSolidChevronLeft, BiSolidPencil } from "react-icons/bi";
import { BsWrenchAdjustable,BsXCircle  } from "react-icons/bs";

const Materiales = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  
  const [materiales, setMateriales] = useState([
    { id: 1, tipo: 'Metal', marca: 'Samsung', modelo: 'X123', estado: 'Nuevo' },
    { id: 2, tipo: 'Plástico', marca: 'LG', modelo: 'A456', estado: 'Usado' }
  ]);

  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [newMaterial, setNewMaterial] = useState({
    tipo: '',
    marca: '',
    modelo: '',
    estado: ''
  });

  const handleEdit = (material) => {
    setSelectedMaterial(material);
    onEditOpen();
  };

  const handleSaveEdit = () => {
    setMateriales(materiales.map(material => material.id === selectedMaterial.id ? selectedMaterial : material));
    onEditClose();
  };

  const handleSaveNewMaterial = () => {
    setMateriales([
      ...materiales,
      { id: materiales.length + 1, ...newMaterial }
    ]);
    onClose(); 
    setNewMaterial({ tipo: '', marca: '', modelo: '', estado: '' }); // Limpiar formulario
  };

  return (
    <Box backgroundColor="teal.600" minHeight="100vh" p={5} display="flex" flexDirection="column" alignItems="center">
      <Heading color="white" textAlign="center" mb={8} fontSize="3xl">Gestión de Materiales</Heading>
      <Box bg="white" p={6} borderRadius="lg" boxShadow="xl" width="80%">
        <Button leftIcon={<BsWrenchAdjustable />} colorScheme="teal" mb={4} onClick={onOpen}>
          Agregar Material
        </Button>
        <Button marginLeft={10} leftIcon={<BiSolidChevronLeft />} colorScheme="teal" mb={4}>
          Dashboard
        </Button>

        <Table variant="striped" colorScheme='teal' size='sm'>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Tipo de Material</Th>
              <Th>Marca</Th>
              <Th>Modelo</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {materiales.map(material => (
              <Tr key={material.id}>
                <Td>{material.id}</Td>
                <Td>{material.tipo}</Td>
                <Td>{material.marca}</Td>
                <Td>{material.modelo}</Td>
                <Td>{material.estado}</Td>
                <Td>
                  <IconButton icon={<BiSolidPencil />} size='sm' colorScheme="blue" variant='ghost' mr={2} onClick={() => handleEdit(material)} />
                  <IconButton icon={<BsXCircle  />} size='sm' colorScheme="red" variant='ghost' />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>


      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Material</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Tipo de Material</FormLabel>
              <Input value={newMaterial.tipo} onChange={(e) => setNewMaterial({ ...newMaterial, tipo: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Marca</FormLabel>
              <Input value={newMaterial.marca} onChange={(e) => setNewMaterial({ ...newMaterial, marca: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Modelo</FormLabel>
              <Input value={newMaterial.modelo} onChange={(e) => setNewMaterial({ ...newMaterial, modelo: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Estado</FormLabel>
              <Select value={newMaterial.estado} onChange={(e) => setNewMaterial({ ...newMaterial, estado: e.target.value })}>
                <option>Nuevo</option>
                <option>Usado</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSaveNewMaterial}>Guardar</Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Material</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Tipo de Material</FormLabel>
              <Input value={selectedMaterial?.tipo || ''} onChange={(e) => setSelectedMaterial({ ...selectedMaterial, tipo: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Marca</FormLabel>
              <Input value={selectedMaterial?.marca || ''} onChange={(e) => setSelectedMaterial({ ...selectedMaterial, marca: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Modelo</FormLabel>
              <Input value={selectedMaterial?.modelo || ''} onChange={(e) => setSelectedMaterial({ ...selectedMaterial, modelo: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Estado</FormLabel>
              <Select value={selectedMaterial?.estado || ''} onChange={(e) => setSelectedMaterial({ ...selectedMaterial, estado: e.target.value })}>
                <option>Nuevo</option>
                <option>Usado</option>
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

export default Materiales;
