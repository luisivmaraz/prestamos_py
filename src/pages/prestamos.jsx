import React, { useState, useEffect } from 'react';
import {
  Box, Button, Heading, Table, Thead, Tbody, Tr, Th, Td, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, ModalFooter, useDisclosure
} from '@chakra-ui/react';
import { BiSolidChevronLeft, BiSolidPencil } from "react-icons/bi";
import { BsXCircle, BsPlusLg } from "react-icons/bs";
import { Link } from "react-router-dom";

const Loans = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [newLoan, setNewLoan] = useState({
    id_user: '',
    id_material: '',
    loan_date: '',
    return_date: '',
    status: 'Active'
  });

  // Authorization token stored in localStorage or wherever it is kept
  const token = localStorage.getItem('token');

  // Fetch loans from API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/loan', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => setLoans(data))
      .catch(error => console.error('Error fetching loans:', error));
  }, [token]);

  const handleEdit = (loan) => {
    setSelectedLoan({
      ...loan,
      id: loan.ID_Loan,
      loan_date: loan.loan_date.split("T")[0],
      return_date: loan.return_date.split("T")[0]
    });
    onEditOpen();
  };

  const handleSaveEdit = async () => {
    if (!selectedLoan.id_user || !selectedLoan.id_material || !selectedLoan.loan_date || !selectedLoan.return_date) {
      console.error('Todos los campos son requeridos');
      return;
    }

    if (!selectedLoan.id) {
      console.error('El ID del préstamo no está definido');
      return;
    }

    const updatedLoan = {
      id_user: Number(selectedLoan.id_user),
      id_material: Number(selectedLoan.id_material),
      loan_date: new Date(selectedLoan.loan_date).toISOString(),
      return_date: new Date(selectedLoan.return_date).toISOString(),
      status: selectedLoan.status || 'Active'
    };

    console.log("🔹 Enviando datos al backend:", JSON.stringify(updatedLoan));

    try {
      const response = await fetch(`http://127.0.0.1:8000/loan/${selectedLoan.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedLoan)
      });

      console.log("🔹 Respuesta del backend:", response);

      if (response.ok) {
        const data = await response.json();
        setLoans(loans.map(loan => loan.ID_Loan === data.ID_Loan ? data : loan));
        onEditClose();
      } else {
        const errorText = await response.text();
        console.error('❌ Error al actualizar préstamo:', errorText);
      }
    } catch (error) {
      console.error('❌ Error en la solicitud:', error);
    }
  };

  const handleSaveNewLoan = async () => {
    // Validación para asegurarse de que todos los campos estén completos
    if (!newLoan.id_user || !newLoan.id_material || !newLoan.loan_date || !newLoan.return_date) {
      console.error('Todos los campos son requeridos');
      return;
    }

    const loanToAdd = {
      id_user: Number(newLoan.id_user),
      id_material: Number(newLoan.id_material),
      loan_date: newLoan.loan_date, // Usar la fecha seleccionada
      return_date: newLoan.return_date,
      status: 'Active'
    };

    console.log("Datos enviados al backend:", JSON.stringify(loanToAdd));

    try {
      const response = await fetch('http://127.0.0.1:8000/loan/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(loanToAdd),
      });

      // Verificar que la respuesta sea exitosa
      if (response.ok) {
        const addedLoan = await response.json();
        setLoans([...loans, addedLoan]);
        onClose();
        setNewLoan({
          id_user: '',
          id_material: '',
          loan_date: '',
          return_date: '',
          status: 'Active'
        });
      } else {
        const errorData = await response.json();
        console.error('Error al agregar préstamo:', errorData);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleDeleteLoan = async (id) => {
    const response = await fetch(`http://127.0.0.1:8000/loan/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      setLoans(loans.filter(loan => loan.ID_Loan !== id));
    } else {
      console.error('Error al eliminar prestamo');
    }
  };

  return (
    <Box backgroundColor="teal.600" minHeight="100vh" p={5} display="flex" flexDirection="column" alignItems="center">
      <Heading color="white" textAlign="center" mb={8} fontSize="3xl">Loan Management</Heading>
      <Box bg="white" p={6} borderRadius="lg" boxShadow="xl" width="80%">
        <Button leftIcon={<BsPlusLg />} colorScheme="teal" mb={4} onClick={onOpen}>
          Add Loan
        </Button>
        <Link to="/Dashboard">
          <Button marginLeft={10} leftIcon={<BiSolidChevronLeft />} colorScheme="teal" mb={4}>
            Dashboard
          </Button>
        </Link>
        <Table variant="striped" colorScheme='teal' size='sm'>
          <Thead>
            <Tr>
              <Th>ID Prestamo</Th>
              <Th>ID de usuario</Th>
              <Th>ID de Material</Th>
              <Th>Fecha de Prestamo</Th>
              <Th>Fecha de Regreso</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loans.map(loan => (
              <Tr key={loan.ID_Loan}>
                <Td>{loan.ID_Loan}</Td>
                <Td>{loan.id_user}</Td>
                <Td>{loan.id_material}</Td>
                <Td>{loan.loan_date}</Td>
                <Td>{loan.return_date}</Td>
                <Td>
                  <IconButton icon={<BiSolidPencil />} size='sm' colorScheme="blue" variant='ghost' mr={2} onClick={() => handleEdit(loan)} />
                  <IconButton icon={<BsXCircle />} size='sm' colorScheme="red" variant='ghost' onClick={() => handleDeleteLoan(loan.ID_Loan)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal Add Loan */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Loan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>User ID</FormLabel>
              <Input type="number" value={newLoan.id_user} onChange={(e) => setNewLoan({ ...newLoan, id_user: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Material ID</FormLabel>
              <Input type="number" value={newLoan.id_material} onChange={(e) => setNewLoan({ ...newLoan, id_material: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Loan Date</FormLabel>
              <Input type="date" value={newLoan.loan_date} onChange={(e) => setNewLoan({ ...newLoan, loan_date: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Return Date</FormLabel>
              <Input type="date" value={newLoan.return_date} onChange={(e) => setNewLoan({ ...newLoan, return_date: e.target.value })} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSaveNewLoan}>Save</Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Edit Loan */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Loan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>User ID</FormLabel>
              <Input type="number" value={selectedLoan?.id_user || ''} onChange={(e) => setSelectedLoan({ ...selectedLoan, id_user: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Material ID</FormLabel>
              <Input type="number" value={selectedLoan?.id_material || ''} onChange={(e) => setSelectedLoan({ ...selectedLoan, id_material: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Loan Date</FormLabel>
              <Input type="date" value={selectedLoan?.loan_date || ''} onChange={(e) => setSelectedLoan({ ...selectedLoan, loan_date: e.target.value })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Return Date</FormLabel>
              <Input type="date" value={selectedLoan?.return_date || ''} onChange={(e) => setSelectedLoan({ ...selectedLoan, return_date: e.target.value })} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSaveEdit}>Save</Button>
            <Button onClick={onEditClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Loans;
