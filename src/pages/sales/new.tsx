import { Card, Container, Heading } from "@chakra-ui/react";
import { NextPage } from "next"; 
import SaleForm from "components/entities/sales/SaleForm";



const NewClient:NextPage = () => {

    return (
        <Container marginTop={8}>
            <Card padding={6}>
                <Heading textAlign="center" marginBottom={8}>Nueva Venta</Heading>
                <SaleForm />
            </Card>
        </Container>
    )
}

export default NewClient;