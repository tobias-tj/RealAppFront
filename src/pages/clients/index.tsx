import { Button, ButtonGroup, Card, Container, Heading, Spinner } from '@chakra-ui/react'
import axios from 'axios'
import ClientList from 'components/entities/clients/ClientList'
import { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useQuery } from 'react-query'
import { env } from '~/env'

const Clients: NextPage = () => {

    const {data: clients, isLoading} = useQuery({
        queryKey: ["clients"],
        queryFn: async () => {
            const res = await axios.get(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients`, {withCredentials: true});
            return res.data.data;
        },
    })
    const router = useRouter()
  return (
    <Container marginTop={8}>
        <Card padding={6}>
            <Heading textAlign="center">Clientes</Heading>
            {isLoading ? <Spinner/> : <ClientList clients={clients}/>}
            <ButtonGroup>
                <Button 
                    mt={6}
                    colorScheme='blue' onClick={() => {
                router.push("/clients/new")
                }}>Nuevo Cliente</Button>
                <Button 
                mt={6}
                colorScheme='gray' onClick={() => {
              router.push("/")
            }}>Volver</Button>
            </ButtonGroup>
            
        </Card>
    </Container>
  )
}

export default Clients