'use client'

import {
  Container,
  Text,
  Box,
  Heading,
  VStack,
  HStack,
  Badge,
  Flex,
  Spacer,
  Button,
  useToast,
} from '@chakra-ui/react'
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { BrowserProvider, parseEther, formatEther } from 'ethers'
import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

// Define the type for questionnement items
interface Questionnement {
  id: number
  name: string
  description: string
  votes_for: number
  votes_against: number
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [txLink, setTxLink] = useState<string>()
  const [txHash, setTxHash] = useState<string>()
  const [balance, setBalance] = useState<string>('0')

  // Define the initial questionnements array with 3 default items
  const [questionnements, setQuestionnements] = useState<Questionnement[]>([
    {
      id: 1,
      name: 'La pollution de la rivière X',
      description:
        "Nous savons que l'usine Y engendre des déchêts conséquents. Devrions-nous enquêter sur la pollution de la rivière X",
      votes_for: 12,
      votes_against: 5,
    },
    {
      id: 2,
      name: "L'installation de la Ferme du Bonheur",
      description: "Interview de Jean-Michel qui vient de s'installer en tant qu'agriculteur.",
      votes_for: 8,
      votes_against: 15,
    },
    {
      id: 3,
      name: 'Fermeture du Crazy Bar',
      description:
        'La préfecture a ordonné la fermeture du Crazy Bar. Devrions-nous enquêter sur ce sujet ?',
      votes_for: 24,
      votes_against: 2,
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

  const handleVote = (id: number, voteType: 'for' | 'against') => {
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

    setQuestionnements(prev =>
      prev.map(item => {
        if (item.id === id) {
          if (voteType === 'for') {
            return { ...item, votes_for: item.votes_for + 1 }
          } else {
            return { ...item, votes_against: item.votes_against + 1 }
          }
        }
        return item
      })
    )

    toast({
      title: 'Vote enregistré',
      description: `Vous avez voté ${voteType === 'for' ? 'pour' : 'contre'} cette proposition.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  // Sort questionnements by votes_for in descending order
  const sortedQuestionnements = [...questionnements].sort((a, b) => b.votes_for - a.votes_for)

  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={8} align="stretch">
        <Heading as="h3" size="lg" mb={6}>
          Questionnements
        </Heading>

        {sortedQuestionnements.map(item => (
          <Box
            key={item.id}
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
                  {item.name}
                </Heading>
                <Spacer />
                <HStack spacing={2}>
                  {/* <Badge colorScheme="green" fontSize="sm" px={2} py={1} borderRadius="full">
                    Pour: {item.votes_for}
                  </Badge>
                  <Badge colorScheme="red" fontSize="sm" px={2} py={1} borderRadius="full">
                    Contre: {item.votes_against}
                  </Badge> */}

                  <Badge colorScheme="green" fontSize="sm" px={2} py={1} borderRadius="full">
                    {item.votes_for}
                  </Badge>
                </HStack>
              </Flex>

              <Text>{item.description}</Text>

              <Flex mt={2}>
                <Button
                  size="sm"
                  colorScheme="green"
                  variant="outline"
                  onClick={() => handleVote(item.id, 'for')}
                  isDisabled={!isConnected}
                >
                  Voter Pour
                </Button>
                <Spacer />
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => handleVote(item.id, 'against')}
                  isDisabled={!isConnected}
                >
                  Voter Contre
                </Button>
              </Flex>
            </VStack>
          </Box>
        ))}

        <Box textAlign="center" mt={6} p={4} bg="blackAlpha.200" borderRadius="md">
          <Text fontSize="sm">
            {isConnected
              ? 'Vous pouvez voter sur les questionnements ci-dessus'
              : 'Connectez-vous pour voter'}
          </Text>
        </Box>
      </VStack>
    </Container>
  )
}
