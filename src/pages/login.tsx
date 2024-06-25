import { Button, ButtonGroup, Card, Container, FormControl, FormLabel, FormErrorMessage ,Heading, Input } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { env } from "~/env";
import { zodResolver } from "@hookform/resolvers/zod";

const shema = z.object({
    email : z.string().email("El email no es valido."),
    code : z.string().length(6, "El codigo debe contener 6 caracteres."),
})

type FieldValues = z.infer<typeof shema>

const Login: NextPage = () => {

    const { 
        register, 
        getValues,
        handleSubmit, 
        formState: {errors},
    } = useForm<FieldValues>({
        resolver:  zodResolver(shema),
        defaultValues: {email:"https.tobias.jara.404@gmail.com"}
    })

    const router = useRouter();

    const onSubmit = () => {
        const { email, code } = getValues()
        axios.post(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login/${email}`,
            { code }, {withCredentials: true}
        )
        .then(({ data }) => {
            router.push("/")
        })
        .catch(console.log)
    }
    
    const onError = () => {
        console.log({ errors })
    }

    return (
        <Container marginTop={10}>
            <Heading textAlign="center">Iniciar Sesion</Heading>
            <Card padding={3} alignItems="center" marginTop={2}>
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <FormControl marginBottom={5} isInvalid={!!errors.email}>
                        <FormLabel>Email</FormLabel>
                        <Input 
                        type='text' 
                        placeholder="Ingresa tu email" 
                        {...register("email")}  
                        />
                        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.code}>
                        <FormLabel>Codigo</FormLabel>
                        <Input 
                        type='text' 
                        placeholder="Ingresa tu codigo" 
                        {...register("code")}
                        />
                        <FormErrorMessage>{errors.code?.message}</FormErrorMessage>
                    </FormControl>
                    <ButtonGroup marginTop={5}>
                        <Button type="submit">Iniciar Sesion</Button>
                        <Button onClick={() => {
                            const email = getValues("email")
                            axios.post(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login/${email}/code`)
                                .then(console.log)
                                .catch(console.log)
                        }} 
                        >Generar Codigo</Button>
                    </ButtonGroup>
                </form>
            </Card>
        </Container>
    )
}

export default Login;