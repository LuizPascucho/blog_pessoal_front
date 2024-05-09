import { createContext, ReactNode, useState } from "react"
import UsuarioLogin from "../models/UsuarioLogin"
import { login } from "../services/Service"
import { toastAlerta } from "../util/toastAlert"

// 2ª PARTE - TIPANDO O CONTEXTO, DECLARANDO AS INFORMAÇÃOES QUE O CONTEXTO ARMAZENARÁ
interface AuthContextProps {
    usuario: UsuarioLogin
    handleLogout(): void
    handleLogin(usuario: UsuarioLogin): Promise<void>
    isLoading: boolean
}

interface AuthProviderProps {
    children: ReactNode
}

// 1ª PARTE -  CONSTRUÇÃO INICIAL DO CONTEXTO DE ARMAZENAMENTO
export const AuthContext = createContext({} as AuthContextProps)

// 3ª PARTE - FUNÇÃO QUE GERENCIA O CONTEXTO  DE ARMAZENAMENTO
export function AuthProvider({ children }: AuthProviderProps) {

    // CRIANDO O ESTADO DE USUÁRIO LOGADO - useState
    const [usuario, setUsuario] = useState<UsuarioLogin>({
        id: 0,
        nome: "",
        usuario: "",
        senha: "",
        foto: "",
        token: ""
    })

    const [isLoading, setIsLoading] = useState(false)

    //RESPONSAVEL POR LOGAR O USUARIO, E ATUALIZAR O ESTADO DE USUARIO
    async function handleLogin(userLogin: UsuarioLogin) {
        setIsLoading(true) //INDICA QUE ESTA HAVENDO UM PROCESSAMENTO
        try {
            await login(`/usuarios/logar`, userLogin, setUsuario)
            toastAlerta('Usuário logado com sucesso', 'sucesso');
            setIsLoading(false)

        } catch (error) {
            console.log(error)
            toastAlerta('Dados inconsistentes', 'erro');
            setIsLoading(false)
        }
    }

    // RESPONSÁLVEL POR DESLOGAR O USUÁRIO, REINICIANDO O ESTADO DE USUÁRIO LOGADO
    function handleLogout() {
        setUsuario({
            id: 0,
            nome: "",
            usuario: "",
            senha: "",
            foto: "",
            token: ""
        })
    }

    return (
        // COMPARTILHAMENTO DOS DADOS PARA O RESTO DA APLICAÇÃO
        <AuthContext.Provider value={{ usuario, handleLogin, handleLogout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}