import React, { useState, useEffect } from 'react';
import {
  Box, Button, Heading, Table, Thead, Tbody, Tr, Th, Td, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, ModalFooter, Select, useDisclosure
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
    status: 'Active' // default status
  });
  const [usuarios, setUsuarios] = useState([]);
  const [materiales, setMateriales] = useState([]);

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

  // Fetch usuarios from API
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error al hacer la solicitud de usuarios:', error);
      }
    };
    fetchUsuarios();
  }, [token]);

  // Fetch materiales from API
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
    if (!newLoan.id_user || !newLoan.id_material || !newLoan.loan_date || !newLoan.return_date) {
      console.error('Todos los campos son requeridos');
      return;
    }

    const loanToAdd = {
      id_user: Number(newLoan.id_user),
      id_material: Number(newLoan.id_material),
      loan_date: newLoan.loan_date, 
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
              <Th>Usuario</Th>
              <Th>Material</Th>
              <Th>Fecha de Prestamo</Th>
              <Th>Fecha de Regreso</Th>
              <Th>Estatus</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loans.map(loan => {
              const user = usuarios.find(u => u.id === loan.id_user);
              const material = materiales.find(m => m.ID_Material === loan.id_material);
              return (
                <Tr key={loan.ID_Loan}>
                  <Td>{user ? user.name : 'Usuario no encontrado'}</Td>
                  <Td>{material ? material.material_type : 'Material no encontrado'}</Td>
                  <Td>{loan.loan_date}</Td>
                  <Td>{loan.return_date}</Td>
                  <Td>{loan.status}</Td>
                  <Td>
                    <IconButton icon={<BiSolidPencil />} size='sm' colorScheme="blue" variant='ghost' mr={2} onClick={() => handleEdit(loan)} />
                    <IconButton icon={<BsXCircle />} size='sm' colorScheme="red" variant='ghost' onClick={() => handleDeleteLoan(loan.ID_Loan)} />
                  </Td>
                </Tr>
              );
            })}
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
              <FormLabel>User</FormLabel>
              <Select
                value={newLoan.id_user}
                onChange={(e) => setNewLoan({ ...newLoan, id_user: e.target.value })}
              >
                <option value="">Select User</option>
                {usuarios.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Material</FormLabel>
              <Select
                value={newLoan.id_material}
                onChange={(e) => setNewLoan({ ...newLoan, id_material: e.target.value })}
              >
                <option value="">Select Material</option>
                {materiales.map(material => (
                  <option key={material.ID_Material} value={material.ID_Material}>
                    {material.material_type}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Loan Date</FormLabel>
              <Input
                type="date"
                value={newLoan.loan_date}
                onChange={(e) => setNewLoan({ ...newLoan, loan_date: e.target.value })}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Return Date</FormLabel>
              <Input
                type="date"
                value={newLoan.return_date}
                onChange={(e) => setNewLoan({ ...newLoan, return_date: e.target.value })}
              />
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
              <FormLabel>User</FormLabel>
              <Select
                value={selectedLoan?.id_user}
                onChange={(e) => setSelectedLoan({ ...selectedLoan, id_user: e.target.value })}
              >
                <option value="">Select User</option>
                {usuarios.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Material</FormLabel>
              <Select
                value={selectedLoan?.id_material}
                onChange={(e) => setSelectedLoan({ ...selectedLoan, id_material: e.target.value })}
              >
                <option value="">Select Material</option>
                {materiales.map(material => (
                  <option key={material.ID_Material} value={material.ID_Material}>
                    {material.material_type}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Loan Date</FormLabel>
              <Input
                type="date"
                value={selectedLoan?.loan_date || ''}
                onChange={(e) => setSelectedLoan({ ...selectedLoan, loan_date: e.target.value })}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Return Date</FormLabel>
              <Input
                type="date"
                value={selectedLoan?.return_date || ''}
                onChange={(e) => setSelectedLoan({ ...selectedLoan, return_date: e.target.value })}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Status</FormLabel>
              <Select
                value={selectedLoan?.status || 'Active'}
                onChange={(e) => setSelectedLoan({ ...selectedLoan, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Blocked">Blocked</option>
              </Select>
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
