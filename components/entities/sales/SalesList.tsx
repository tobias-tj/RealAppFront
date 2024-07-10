import { Card, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { useRouter } from 'next/navigation';

interface SaleFromDB {
    _id : string
    total_amount: number
    client: string
}

interface Props {
    sales: SaleFromDB[];
}

const SalesList = ({sales} : Props) => {
    const router = useRouter();
  return (
    <Flex flexDirection={"column"} gap={2} mt={3}>
        {sales.sort((a, b) => (b.total_amount || 0) - (a.total_amount || 0)).map((c) => (
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
                <Text>{c.client}</Text>
                <Text>${c.total_amount?.toFixed(2) || 0}</Text>
            </Card>
        ))}
    </Flex>
  )
}

export default SalesList