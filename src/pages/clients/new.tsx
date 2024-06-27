import { Button, Card, Container, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DevTool } from "@hookform/devtools";
import axios from "axios";
import { env } from "~/env";
import { useRouter } from "next/router";
import ClientForm from "components/entities/clients/ClientForm";



const NewClient:NextPage = () => {

    return (
        <Container marginTop={8}>
            <Card padding={6}>
                <Heading textAlign="center" marginBottom={8}>Nuevo Cliente</Heading>
                <ClientForm />
            </Card>
        </Container>
    )
}

export default NewClient;