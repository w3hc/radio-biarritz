'use client'

import {
  Container,
  Heading,
  Text,
  Box,
  VStack,
  HStack,
  Badge,
  Flex,
  Spacer,
  Button,
  useToast,
} from '@chakra-ui/react'
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react'
import { BrowserProvider, parseEther, formatEther } from 'ethers'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

// Define the type for membership requests
interface MembershipRequest {
  id: number
  address: string
  requestDate: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function Admin() {
  const [isLoading, setIsLoading] = useState(false)
  const [txLink, setTxLink] = useState<string>()
  const [txHash, setTxHash] = useState<string>()
  const [balance, setBalance] = useState<string>('0')

  // Define the initial membership requests array with 3 default items
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>([
    {
      id: 1,
      address: '0xbFBaa5a59e3b6c06afF9c975092B8705f804Fa1c',
      requestDate: 'Lundi 25 décembre 2024 à 14h56',
      status: 'approved',
    },
    {
      id: 2,
      address: '0x7F8E2f15150Afc6d4EF1B723B5A7F704c08d0BA5',
      requestDate: 'Mardi 26 décembre 2024 à 09h12',
      status: 'pending',
    },
    {
      id: 3,
      address: '0x3d2C1A856De023eA2c2a069f8EDc6d30c399F16E',
      requestDate: 'Mercredi 27 décembre 2024 à 18h30',
      status: 'pending',
    },
  ])

  const { address, isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')
  const toast = useToast()
  const t = useTranslation()

  useEffect(() => {
    const checkBalance = async () => {
      if (address && walletProvider) {
        try {
          const provider = new BrowserProvider(walletProvider as any)
          const balance = await provider.getBalance(address)
          setBalance(formatEther(balance))
        } catch (error) {
          console.error('Error fetching balance:', error)
        }
      }
    }

    checkBalance()
  }, [address, walletProvider])

  const handleApprove = (id: number) => {
    if (!isConnected) {
      toast({
        title: t.common.error,
        description: t.home.notConnected,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setMembershipRequests(prev =>
      prev.map(request => {
        if (request.id === id) {
          return { ...request, status: 'approved' }
        }
        return request
      })
    )

    toast({
      title: 'Demande approuvée',
      description: `La demande a été approuvée avec succès.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleReject = (id: number) => {
    if (!isConnected) {
      toast({
        title: t.common.error,
        description: t.home.notConnected,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setMembershipRequests(prev =>
      prev.map(request => {
        if (request.id === id) {
          return { ...request, status: 'rejected' }
        }
        return request
      })
    )

    toast({
      title: 'Demande rejetée',
      description: `La demande a été rejetée.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  // Function to get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge colorScheme="green">Approuvée</Badge>
      case 'rejected':
        return <Badge colorScheme="red">Rejetée</Badge>
      default:
        return <Badge colorScheme="yellow">En attente</Badge>
    }
  }

  return (
    <main>
      <Container maxW="container.md" py={20}>
        <VStack spacing={8} align="stretch">
          <header>
            <Heading as="h1" size="xl" mb={2}>
              Admin dashboard
            </Heading>
            <Text fontSize="lg" color="gray.400" mb={6}>
              Gérer les demandes d&apos;adhésion
            </Text>
          </header>

          <section aria-label="Account Information">
            {isConnected ? (
              <Box bg="whiteAlpha.100" p={4} borderRadius="md" mb={6}>
                <Text>Admin connecté: {address}</Text>
                <Text>Balance: {parseFloat(balance).toFixed(4)} ETH</Text>
              </Box>
            ) : (
              <Box bg="whiteAlpha.100" p={4} borderRadius="md" mb={6}>
                <Text>Veuillez vous connecter pour accéder aux fonctions d&apos;admin</Text>
              </Box>
            )}
          </section>

          <Heading as="h3" size="lg" mb={4}>
            Demandes d&apos;adhésion
          </Heading>

          {membershipRequests.map(request => (
            <Box
              key={request.id}
              borderWidth="2px"
              borderColor="#8c1c84"
              borderRadius="xl"
              p={5}
              boxShadow="sm"
              transition="all 0.2s"
              _hover={{ boxShadow: 'md' }}
            >
              <VStack align="stretch" spacing={3}>
                <Flex align="center">
                  <Heading as="h4" size="md">
                    Demande #{request.id}
                  </Heading>
                  <Spacer />
                  {getStatusBadge(request.status)}
                </Flex>

                <Box>
                  <Text>
                    <strong>Adresse:</strong> {request.address}
                  </Text>
                  <Text>
                    <strong>Date de demande:</strong> {request.requestDate}
                  </Text>
                </Box>

                {request.status === 'pending' && (
                  <Flex mt={2}>
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={() => handleApprove(request.id)}
                      isDisabled={!isConnected}
                    >
                      Approuver
                    </Button>
                    <Spacer />
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleReject(request.id)}
                      isDisabled={!isConnected}
                    >
                      Rejeter
                    </Button>
                  </Flex>
                )}
              </VStack>
            </Box>
          ))}

          <Box textAlign="center" mt={6} p={4} bg="blackAlpha.200" borderRadius="md">
            <Text fontSize="sm">
              {isConnected
                ? "Vous pouvez gérer les demandes d'adhésion ci-dessus"
                : "Connectez-vous pour gérer les demandes d'adhésion"}
            </Text>
          </Box>

          <nav aria-label="Main Navigation">
            <Link href="/" style={{ color: '#45a2f8', textDecoration: 'underline' }}>
              {t.newPage.backHome}
            </Link>
          </nav>
        </VStack>
      </Container>
    </main>
  )
}
