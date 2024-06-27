import { Card, Container, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import ClientForm from "components/entities/clients/ClientForm";
import { useRouter } from "next/router";



const EditClient:NextPage = () => {

    const router = useRouter()
    console.log({ router })
    return (
        <Container marginTop={8}>
            <Card padding={6}>
                <Heading textAlign="center" marginBottom={8}>Editando Cliente</Heading>
                <ClientForm clientId={router.query.clientId as string}/>
            </Card>
        </Container>
    )
}

export default EditClient;