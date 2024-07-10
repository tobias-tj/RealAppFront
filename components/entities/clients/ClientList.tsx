import { Card, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { Client } from './ClientForm';
import { useRouter } from 'next/navigation';

interface ClientFromDB extends Client{
    _id : string
    firstname: string
    sales?: {count: number, amount: number}
}

interface Props {
    clients: ClientFromDB[];
}

const ClientList = ({clients} : Props) => {
    const router = useRouter();
  return (
    <Flex flexDirection={"column"} gap={2} mt={3}>
        {clients.sort((a, b) => (b.sales?.amount || 0) - (a.sales?.amount || 0)).map((c) => (
            <Card key={c._id}
            py={2}
            px={4}
            cursor="pointer"
            _hover={{
                backgroundColor: "blue.400",
                color: "white",
                transition: "0.2s background-color ease-out, 0.2s color ease-out"
            }}
            onClick={() => router.push(`/clients/${c._id}`)}
            flexDir="row"
            justifyContent="space-between">
                <Text>{c.firstname}</Text>
                <Text>${(c.sales?.amount)?.toFixed(2) || 0}</Text>
            </Card>
        ))}
    </Flex>
  )
}

export default ClientList