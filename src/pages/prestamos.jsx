import React, { useState } from 'react'; 
import {
  Box, Button, Heading, Table, Thead, Tbody, Tr, Th, Td, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, ModalFooter, useDisclosure
} from '@chakra-ui/react'; 
import { BiSolidChevronLeft,BiSolidPencil } from "react-icons/bi";
import { BsXCircle,BsPlusLg  } from "react-icons/bs";


const Prestamos = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  
 
  const [prestamos, setPrestamos] = useState([
    { id_prestamo: 1, id_usuario: 1, id_material: 101, fecha_prestamo: '2025-01-01', fecha_devolucion: '2025-02-01' },
    { id_prestamo: 2, id_usuario: 2, id_material: 102, fecha_prestamo: '2025-01-15', fecha_devolucion: '2025-02-15' }
  ]);

  const [selectedPrestamo, setSelectedPrestamo] = useState(null);
  const [newPrestamo, setNewPrestamo] = useState({
    id_usuario: '',
    id_material: '',
    fecha_prestamo: '',
    fecha_devolucion: ''
  });

  const handleEdit = (prestamo) => {
    setSelectedPrestamo(prestamo);
    onEditOpen();
  };

  const handleSaveEdit = () => {
    setPrestamos(prestamos.map(prestamo => prestamo.id_prestamo === selectedPrestamo.id_prestamo ? selectedPrestamo : prestamo));
    onEditClose();
  };

  const handleSaveNewPrestamo = () => {
    setPrestamos([
      ...prestamos,
      { id_prestamo: prestamos.length + 1, ...newPrestamo }
    ]);
    onClose(); 
    setNewPrestamo({ id_usuario: '', id_material: '', fecha_prestamo: '', fecha_devolucion: '' }); // Clear form
  };

  return (
    <Box backgroundColor="teal.600" minHeight="100vh" p={5} display="flex" flexDirection="column" alignItems="center">
      <Heading color="white" textAlign="center" mb={8} fontSize="3xl">Gestión de Préstamos</Heading>
      <Box bg="white" p={6} borderRadius="lg" boxShadow="xl" width="80%">
        <Button leftIcon={<BsPlusLg  />} colorScheme="teal" mb={4} onClick={onOpen}>
          Agregar Préstamo
        </Button>
        <Button marginLeft={10} leftIcon={<BiSolidChevronLeft />} colorScheme="teal" mb={4}>
          Dashboard
        </Button>

        <Table variant="striped" colorScheme='teal' size='sm'>
          <Thead>
            <Tr>
              <Th>ID Préstamo</Th>
              <Th>ID Usuario</Th>
              <Th>ID Material</Th>
              <Th>Fecha Préstamo</Th>
              <Th>Fecha Devolución</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {prestamos.map(prestamo => (
              <Tr key={prestamo.id_prestamo}>
                <Td>{prestamo.id_prestamo}</Td>
                <Td>{prestamo.id_usuario}</Td>
                <Td>{prestamo.id_material}</Td>
                <Td>{prestamo.fecha_prestamo}</Td>
                <Td>{prestamo.fecha_devolucion}</Td>
                <Td>
                  <IconButton icon={<BiSolidPencil />} size='sm' colorScheme="blue" variant='ghost' mr={2} onClick={() => handleEdit(prestamo)} />
                  <IconButton icon={<BsXCircle />} size='sm' colorScheme="red" variant='ghost' />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>


      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Préstamo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>ID Usuario</FormLabel>
              <Input type="number" value={newPrestamo.id_usuario} onChange={(e) => setNewPrestamo({ ...newPrestamo, id_usuario: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>ID Material</FormLabel>
              <Input type="number" value={newPrestamo.id_material} onChange={(e) => setNewPrestamo({ ...newPrestamo, id_material: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Fecha Préstamo</FormLabel>
              <Input type="date" value={newPrestamo.fecha_prestamo} onChange={(e) => setNewPrestamo({ ...newPrestamo, fecha_prestamo: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Fecha Devolución</FormLabel>
              <Input type="date" value={newPrestamo.fecha_devolucion} onChange={(e) => setNewPrestamo({ ...newPrestamo, fecha_devolucion: e.target.value })} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSaveNewPrestamo}>Guardar</Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Préstamo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>ID Usuario</FormLabel>
              <Input type="number" value={selectedPrestamo?.id_usuario || ''} onChange={(e) => setSelectedPrestamo({ ...selectedPrestamo, id_usuario: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>ID Material</FormLabel>
              <Input type="number" value={selectedPrestamo?.id_material || ''} onChange={(e) => setSelectedPrestamo({ ...selectedPrestamo, id_material: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Fecha Préstamo</FormLabel>
              <Input type="date" value={selectedPrestamo?.fecha_prestamo || ''} onChange={(e) => setSelectedPrestamo({ ...selectedPrestamo, fecha_prestamo: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Fecha Devolución</FormLabel>
              <Input type="date" value={selectedPrestamo?.fecha_devolucion || ''} onChange={(e) => setSelectedPrestamo({ ...selectedPrestamo, fecha_devolucion: e.target.value })} />
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

export default Prestamos;
