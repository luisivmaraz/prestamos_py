import React, { useState, useEffect } from 'react';
import {
  Box, Button, Heading, Table, Thead, Tbody, Tr, Th, Td, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, Select, ModalFooter, useDisclosure
} from '@chakra-ui/react';
import { BiSolidChevronLeft, BiSolidPencil } from "react-icons/bi";
import { BsWrenchAdjustable, BsXCircle } from "react-icons/bs";
import { Link } from 'react-router-dom';

const Materiales = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const [materiales, setMateriales] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [newMaterial, setNewMaterial] = useState({
    material_type: '',
    brand: '',
    model: '',
    state: 'Available'
  });

  const token = localStorage.getItem('authToken');

  // Obtener los materiales desde la API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/material/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => setMateriales(data))
      .catch(error => console.error('Error fetching materials:', error));
  }, [token]);

  const handleEdit = (material) => {
    setSelectedMaterial(material);
    onEditOpen();
  };

  const handleSaveEdit = () => {
    const updatedMaterial = selectedMaterial;
    fetch(`http://127.0.0.1:8000/material/${selectedMaterial.ID_Material}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedMaterial),
    })
      .then(response => response.json())
      .then(data => {
        setMateriales(materiales.map(material => material.ID_Material === data.ID_Material ? data : material));
        onEditClose();
      })
      .catch(error => console.error('Error updating material:', error));
  };

  const handleSaveNewMaterial = () => {
    const materialToAdd = { ...newMaterial };
    fetch('http://127.0.0.1:8000/material/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(materialToAdd),
    })
      .then(response => response.json())
      .then(data => {
        setMateriales([...materiales, data]);
        onClose();
        setNewMaterial({ material_type: '', brand: '', model: '', state: 'Available' });
      })
      .catch(error => console.error('Error adding material:', error));
  };


  const handleDeleteMaterial = async (id) => {
    if (!id) {
      console.error("Error: ID del material es undefined o inválido");
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/material/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
  
      if (response.ok) {
        setMateriales(materiales.filter(material => material.ID_Material !== id));
      } else {
        console.error('Error deleting material:', await response.json());
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación:', error);
    }
  };
  
  

  return (
    <Box backgroundColor="teal.600" minHeight="100vh" p={5} display="flex" flexDirection="column" alignItems="center">
      <Heading color="white" textAlign="center" mb={8} fontSize="3xl">Gestión de Materiales</Heading>
      <Box bg="white" p={6} borderRadius="lg" boxShadow="xl" width="80%">
        <Button leftIcon={<BsWrenchAdjustable />} colorScheme="teal" mb={4} onClick={onOpen}>
          Agregar Material
        </Button>
        <Link to="/Dashboard">
          <Button marginLeft={10} leftIcon={<BiSolidChevronLeft />} colorScheme="teal" mb={4}>
            Dashboard
          </Button>
        </Link>

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
              <Tr key={material.ID_Material}>
                <Td>{material.ID_Material}</Td>
                <Td>{material.material_type}</Td>
                <Td>{material.brand}</Td>
                <Td>{material.model}</Td>
                <Td>{material.state}</Td>
                <Td>
                  <IconButton icon={<BiSolidPencil />} size='sm' colorScheme="blue" variant='ghost' mr={2} onClick={() => handleEdit(material)} />
                  <IconButton icon={<BsXCircle />} size='sm' colorScheme="red" variant='ghost' onClick={() => handleDeleteMaterial(material.ID_Material)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal Agregar Material */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Material</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Tipo de Material</FormLabel>
              <Input value={newMaterial.material_type} onChange={(e) => setNewMaterial({ ...newMaterial, material_type: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Marca</FormLabel>
              <Input value={newMaterial.brand} onChange={(e) => setNewMaterial({ ...newMaterial, brand: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Modelo</FormLabel>
              <Input value={newMaterial.model} onChange={(e) => setNewMaterial({ ...newMaterial, model: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Estado</FormLabel>
              <Select value={newMaterial.state} onChange={(e) => setNewMaterial({ ...newMaterial, state: e.target.value })}>
                <option>Available</option>
                <option>Unavailable</option>
                <option>Loaned</option>
                <option>Maintenance</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSaveNewMaterial}>Guardar</Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Editar Material */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Material</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Tipo de Material</FormLabel>
              <Input value={selectedMaterial?.material_type || ''} onChange={(e) => setSelectedMaterial({ ...selectedMaterial, material_type: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Marca</FormLabel>
              <Input value={selectedMaterial?.brand || ''} onChange={(e) => setSelectedMaterial({ ...selectedMaterial, brand: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Modelo</FormLabel>
              <Input value={selectedMaterial?.model || ''} onChange={(e) => setSelectedMaterial({ ...selectedMaterial, model: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Estado</FormLabel>
              <Select value={selectedMaterial?.state || ''} onChange={(e) => setSelectedMaterial({ ...selectedMaterial, state: e.target.value })}>
                <option>Available</option>
                <option>Unavailable</option>
                <option>Loaned</option>
                <option>Maintenance</option>
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
