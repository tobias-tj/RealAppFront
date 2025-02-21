import { Button, ButtonGroup } from '@chakra-ui/react'
import axios from 'axios'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { env } from '~/env'

const LoginButtons = () => {
    const { getValues } = useFormContext()

    return (
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
    
    )
}

export default LoginButtons
