/* eslint-disable @typescript-eslint/no-floating-promises */
import { Button, ButtonGroup, Card, Container, FormControl, FormLabel, FormErrorMessage ,Heading, Input } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { env } from "~/env";
import { zodResolver } from "@hookform/resolvers/zod";
import MyForm from "components/ui/forms/MyForm";
import MyInput from "components/ui/inputs/MyInput";
import LoginButtons from "components/users/LoginButtons";
import { NextPage } from "next";
import { LoginType, LoginSchema } from "schemas/AuthSchema";



const Login: NextPage = () => {

    const { 
        register, 
        getValues,
        handleSubmit, 
        formState: {errors},
    } = useForm<LoginType>({
        resolver:  zodResolver(LoginSchema),
    })

    const router = useRouter();

    const onSubmit = (data: LoginType) => {
        const { email, code } = data
        axios.post(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login/${email}`,
            { code }, {withCredentials: true}
        )
        .then(({ data }) => {
            router.push("/")
        })
        .catch(console.log)
    }
    
    const onError = (errors : any) => {
        console.log({ errors })
    }

    return (
        <Container marginTop={10}>
            <Heading textAlign="center">Iniciar Sesion</Heading>
            <Card padding={3} alignItems="center" marginTop={2}>
                <MyForm defaultValues={{email: "https.tobias.jara.404@gmail.com"}} zodSchema={LoginSchema} onSubmit={onSubmit} onError={onError}>
                    <MyInput fieldName="email" label="Email" placeholder="Ingresar Email"/>
                    <MyInput fieldName="code" label="Codigo" placeholder="Ingresar Codigo" />
                    <LoginButtons />
                </MyForm>
            </Card>
        </Container>
    )
}

export default Login;